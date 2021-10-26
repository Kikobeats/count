/* global Response */

import UrlPattern from 'url-pattern'

import { toQuery } from '@/lib/to-query'
import { getCollection } from '@/lib/upstash'

const pattern = new UrlPattern('/:collection/:key')

export default async function middleware (request) {
  const url = request.nextUrl
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
