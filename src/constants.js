'use strict'

const { API_KEY, PORT = 1337, NODE_ENV = 'development' } = process.env

if (!API_KEY) {
  console.warn('`API_KEY` not set, anyone can increment your counters.')
}

const isProduction = NODE_ENV === 'production'

const LOG_FORMAT =
  process.env.LOG_FORMAT || (NODE_ENV === 'development' && 'dev')

module.exports = {
  ...process.env,
  API_KEY,
  isProduction,
  LOG_FORMAT,
  NODE_ENV,
  PORT
}
