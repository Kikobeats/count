'use strict'

const dispatch = require('micro-route/dispatch')
const { send } = require('micro')

const upsert = require('./src')

module.exports = dispatch()
  .dispatch('/:collection/:id', 'GET', upsert)
  .dispatch('/', 'GET', (req, res) => send(res, 204, null))
  .dispatch('/:collection/:id/', 'GET', upsert)
  .otherwise((req, res) => send(res, 403, null))
