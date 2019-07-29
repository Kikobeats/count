'use strict'

const KeyvFirestore = require('keyv-firestore')
const Keyv = require('keyv')

const {
  FIRESTORE_PROJECT_ID,
  FIRESTORE_PRIVATE_KEY,
  FIRESTORE_CLIENT_EMAIL
} = require('./constants')

const createFirebase = collection =>
  new KeyvFirestore({
    projectId: FIRESTORE_PROJECT_ID,
    collection,
    credentials: {
      private_key: Buffer.from(FIRESTORE_PRIVATE_KEY, 'base64').toString(),
      client_email: FIRESTORE_CLIENT_EMAIL
    }
  })

module.exports = collection => {
  const firebase = createFirebase(collection)
  const keyv = new Keyv({ store: firebase })

  const init = async (id, data) => {
    const now = Date.now()
    data = { updatedAt: now, createdAt: now, count: 1 }
    await keyv.set(id, data)
    return data
  }

  const increment = async (id, data, quantity) => {
    data.updatedAt = Date.now()
    data.count = data.count + (Number(quantity) || 1)
    await keyv.set(id, data)
    return data
  }

  return {
    init,
    get: keyv.get.bind(keyv),
    increment
  }
}
