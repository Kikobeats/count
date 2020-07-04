'use strict'

const { API_KEY, PORT = 1337, NODE_ENV = 'development' } = process.env

if (!API_KEY) {
  console.warn('`API_KEY` not set, anyone can increment your counters.')
}

const isProduction = NODE_ENV === 'production'

const LOG_FORMAT =
  process.env.LOG_FORMAT || (NODE_ENV === 'development' && 'dev')

const ALLOWED_DOMAINS = process.env.DOMAINS
  ? process.env.DOMAINS.split(',').map(n => n.trim())
  : undefined

module.exports = {
  ...process.env,
  ALLOWED_DOMAINS,
  API_KEY,
  isProduction,
  LOG_FORMAT,
  NODE_ENV,
  PORT
}
