'use strict'

const dispatch = require('micro-route/dispatch')
const { send } = require('micro')

const { upsert } = require('./src')

module.exports = dispatch()
  .dispatch('/', 'GET', (req, res) => send(res, 204, null))
  .dispatch('/:id', 'GET', upsert)
  .dispatch('/:id/', 'GET', upsert)
  .dispatch('/robots.txt', 'GET', (req, res) => send(res, 204, null))
  .dispatch('/favicon.ico', 'GET', (req, res) => send(res, 204, null))
  .otherwise((req, res) => send(res, 403, null))
