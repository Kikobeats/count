'use strict'

const { RateLimiterMemory } = require('rate-limiter-flexible')
const requestIp = require('request-ip')
const { promisify } = require('util')
const { send } = require('micro')

const createDb = require('./db')
const { RATE_LIMIT_WINDOW, RATE_LIMIT_MAX, API_KEY } = require('./constants')

const helmet = promisify(require('helmet')())

const rateLimiterMemory = new RateLimiterMemory({
  points: RATE_LIMIT_MAX,
  duration: RATE_LIMIT_WINDOW / 1000
})

const rateLimit = async (req, res, next) => {
  const key = requestIp.getClientIp(req)
  try {
    await rateLimiterMemory.consume(key, 1)
    return next()
  } catch (_) {
    return send(res, 200)
  }
}

const authentication = (req, res, next) => {
  const apiKey = req.headers['x-api-key'] || req.query.key || req.query.apiKey
  return apiKey === API_KEY ? next() : send(res, 403)
}

const getId = req => {
  let id = req.params.id
  if (id.startsWith('/')) id = id.substring(1)
  if (id.endsWith('/')) id = id.substring(0, id.length - 1)
  return id
}

const upsert = async (req, res) => {
  const id = getId(req)
  const quantity =
    req.query.incr !== undefined
      ? req.query.incr
      : req.query.increment !== undefined && req.query.increment

  const { get, init, increment } = createDb(req.params.collection)
  let data = (await get(id)) || { count: 0 }
  let status = 200

  if (quantity !== undefined) {
    data = await (data === undefined ? init : increment)(id, data, quantity)
    status = 201
  }

  return send(res, status, data)
}

const applyMiddleware = (service, middlewares = []) => {
  return middlewares
    .filter(Boolean)
    .reverse()
    .reduce((fn, nextMiddleware) => nextMiddleware(fn), service)
}

const decorate = fn => handler => (req, res, ...rest) => {
  const next = () => handler(req, res, ...rest)
  return fn(req, res, next)
}

const normalize = handler => async (
  req,
  res,
  { params = {}, query = {} } = {}
) => {
  req.params = params
  req.query = query
  return handler(req, res)
}

const middlewares = [
  normalize,
  decorate(helmet),
  decorate(authentication),
  RATE_LIMIT_MAX && RATE_LIMIT_WINDOW && decorate(rateLimit)
]

module.exports = applyMiddleware(upsert, middlewares)
