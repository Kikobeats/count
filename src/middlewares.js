'use strict'

const { RateLimiterMemory } = require('rate-limiter-flexible')
const requestIp = require('request-ip')
const { promisify } = require('util')
const { send } = require('micro')

const { get, init, increment } = require('./db')
const { API_KEY } = require('./constants')

const helmet = promisify(require('helmet')())
const cors = promisify(require('cors')())

const rateLimiterMemory = new RateLimiterMemory({
  points: 10,
  duration: 3600
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

const count = async (req, res) => {
  const { id } = req.params
  let data = await get(id)
  data = await (data === undefined ? init : increment)(id, data)
  return send(res, 201, data)
}

const applyMiddleware = (service, middlewares = []) => {
  return middlewares
    .reverse()
    .reduce((fn, nextMiddleware) => nextMiddleware(fn), service)
}

const decorate = fn => handler => (req, res, ...rest) => {
  const next = () => handler(req, res, ...rest)
  return fn(req, res, next)
}

const normalize = handler => async (req, res, { params, query }) => {
  req.params = params
  req.query = query
  return handler(req, res)
}

module.exports = applyMiddleware(count, [
  normalize,
  decorate(cors),
  decorate(helmet),
  decorate(authentication),
  decorate(rateLimit)
])
