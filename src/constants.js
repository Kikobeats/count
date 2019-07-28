'use strict'

const chalk = require('chalk')

const { API_KEY, PORT = 1337, NODE_ENV = 'development', DB_URI } = process.env

if (!DB_URI) {
  console.log(
    `${chalk.yellow(
      'warning'
    )} \`DB_URI\` not set, will be used a volatile database on memory.`
  )
}

const isProduction = NODE_ENV === 'production'

const LOG_FORMAT =
  process.env.LOG_FORMAT || (NODE_ENV === 'development' && 'dev')

module.exports = {
  API_KEY,
  DB_URI,
  isProduction,
  LOG_FORMAT,
  NODE_ENV,
  PORT
}
