/* global Response */

import { Redis } from '@upstash/redis'
import { parse } from 'regexparam'

const { incr, get, mget } = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN
})

function exec (path, result) {
  let i = 0
  const out = {}
  const matches = result.pattern.exec(path)
  while (i < result.keys.length) {
    out[result.keys[i]] = matches[++i] || null
  }
  return out
}

const router = parse('/:namespace/:key')

const allowedDomains = process.env.DOMAINS.split(',').map(n => n.trim())

const isProduction = process.env.NODE_ENV === 'production'

const getCount = value => (value !== null ? value : 0)

const isAllowedDomain = isProduction
  ? origin => allowedDomains.includes(origin)
  : () => true

const baseUrl = ({ headers }) =>
  `${headers.get('x-forwarded-proto')}://${headers.get('x-forwarded-host')}`

export const config = { runtime: 'experimental-edge' }

export default async request => {
  const url = new URL(request.url, baseUrl(request))
  const origin = request.headers.get('origin')

  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Max-Age': '86400'
      }
    })
  }

  const isAllowed = isAllowedDomain(origin)

  if (!isAllowed) {
    console.error({ origin, isAllowed })
    return new Response(null, { status: 403 })
  }

  const { namespace, key } = exec(url.pathname, router)
  const isReadOnly = !url.searchParams.has('incr')
  const isCollection = key.includes(',')

  const data = await (() => {
    if (!isReadOnly) return incr(`${namespace}:${key}`)
    if (!isCollection) return get(`${namespace}:${key}`)
    const keys = key.split(',').map(key => `${namespace}:${key}`)
    return mget(...keys)
  })()

  const value = isCollection ? data.map(getCount) : getCount(data)

  console.log({
    isReadOnly,
    isCollection,
    key: `${namespace}:${key}`,
    data,
    value
  })

  return Response.json(value, {
    headers: {
      'Access-Control-Allow-Origin': origin
    }
  })
}
