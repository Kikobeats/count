'use strict'

const KeyvFirestore = require('keyv-firestore')
const Keyv = require('keyv')

const {
  FIRESTORE_PROJECT_ID,
  FIRESTORE_COLLECTION_NAME,
  FIRESTORE_PRIVATE_KEY,
  FIRESTORE_CLIENT_EMAIL
} = require('./constants')

const firebase = new KeyvFirestore({
  projectId: FIRESTORE_PROJECT_ID,
  collection: FIRESTORE_COLLECTION_NAME,
  credentials: {
    private_key: (() => {
      const begin = '-----BEGIN PRIVATE KEY-----\n'
      const end = '\n-----END PRIVATE KEY-----\n'
      const key = FIRESTORE_PRIVATE_KEY.replace(/\\n/g, '\n')
        .replace(begin, '')
        .replace(end, '')
      return `${begin}${key}${end}`
    })(),
    client_email: FIRESTORE_CLIENT_EMAIL
  }
})

const keyv = new Keyv({ store: firebase })

const init = async (id, data) => {
  const now = Date.now()

  data = {
    updatedAt: now,
    createdAt: now,
    count: 1
  }
  await keyv.set(id, data)
  return data
}

const increment = async (id, data) => {
  data.updatedAt = Date.now()
  data.count = data.count + 1
  await keyv.set(id, data)
  return data
}

module.exports = {
  init,
  get: keyv.get.bind(keyv),
  increment
}
