'use strict'

const dispatch = require('micro-route/dispatch')
const { send } = require('micro')

const decorate = fn => (req, res, { params = {}, query = {} } = {}) => {
  req.params = params
  req.query = query
  return fn(req, res)
}

const upsert = decorate(require('./middlewares'))

module.exports = dispatch()
  .dispatch('/:collection/:id', 'GET', upsert)
  .dispatch('/', 'GET', (req, res) => send(res, 204, null))
  .dispatch('/:collection/:id/', 'GET', upsert)
  .otherwise((req, res) => send(res, 403, null))
