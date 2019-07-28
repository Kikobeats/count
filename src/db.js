'use strict'

const Keyv = require('keyv')

const { DB_URI } = require('./constants')

const keyv = new Keyv(DB_URI)

const init = async (id, data) => {
  const now = Date.now()

  data = {
    updatedAt: now,
    createdAt: now,
    pageviews: 1
  }
  await keyv.set(id, data)
  return data
}

const increment = async (id, data) => {
  data.updatedAt = Date.now()
  data.pageviews = data.pageviews + 1
  await keyv.set(id, data)
  return data
}

module.exports = {
  init,
  get: keyv.get.bind(keyv),
  increment
}
