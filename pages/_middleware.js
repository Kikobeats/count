/* global Response */

import { auth, incr, get, mget } from '@upstash/redis'
import { exec, parse } from 'matchit'

auth({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
  edgeUrl: process.env.UPSTASH_REDIS_EDGE_URL
})

const pattern = parse('/:namespace/:key')

const allowedDomains = process.env.DOMAINS.split(',').map(n => n.trim())

const isProduction = process.env.NODE_ENV === 'production'

const getCount = value => (value !== null ? value : 0)

const isAllowedDomain = isProduction
  ? origin => allowedDomains.includes(origin)
  : () => true

export default async function middleware (request) {
  const url = request.nextUrl
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

  if (
    url.pathname === '/' ||
    url.pathname === '/favicon.ico' ||
    url.pathname === '/robots.txt'
  ) {
    return new Response()
  }

  const isAllowed = isAllowedDomain(origin)

  if (!isAllowed) {
    console.error({ origin, isAllowed })
    return new Response(null, { status: 403 })
  }

  const { namespace, key } = exec(url.pathname, pattern)

  const isReadOnly = !url.searchParams.has('incr')
  const isCollection = key.includes(',')

  const { data } = await (() => {
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

  return new Response(JSON.stringify(value), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': origin
    }
  })
}
