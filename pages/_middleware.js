/* global Response */

import UrlPattern from 'url-pattern'

import { getCollection } from '@/lib/upstash'
import { toQuery } from '@/lib/to-query'

const pattern = new UrlPattern('/:collection/:key')

export default async function middleware (request) {
  const url = request.nextUrl

  if (url.pathname === '/' || url.pathname === '/robots.txt') {
    return new Response(null, {
      status: 204
    })
  }

  const query = toQuery(url)

  const quantity = Number(query.incr || query.increment)

  const { collection, key } = pattern.match(url.pathname)

  const { get, set } = getCollection(collection)

  let value = (await get(key)) || { count: 0 }
  if (Number.isFinite(quantity)) value = await set(key, value, quantity)

  return new Response(
    JSON.stringify(value, {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Method': 'GET',
        'Access-Control-Allow-Origin': url.origin,
        'Access-Control-Allow-Headers': '*'
      }
    })
  )
}
