'use strict'

const UrlPattern = require('url-pattern')
const { send, Router } = require('micri')
const toQuery = require('to-query')()

const { router, on, otherwise } = Router

const createRoute = str => (req, res) => {
  const pattern = new UrlPattern(str)
  const [route, rawQuery] = req.url.split('?')

  req.query = toQuery(`/?${rawQuery}`)
  req.params = pattern.match(route)

  return req.params && req.params.collection && req.params.id
}

const isRootRoute = req => req.url === '/'

module.exports = fn =>
  router(
    on.get(isRootRoute, (req, res) => send(res, 204)),
    on.get(createRoute('/:collection/:id'), fn),
    on.get(createRoute('/:collection/:id/'), fn),
    otherwise((req, res) => send(res, 403))
  )
