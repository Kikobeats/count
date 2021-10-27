/* global fetch */

const createUpstash = (baseUrl, token) => async (args, init = {}) => {
  const command = args.join('/')
  const url = `${baseUrl}/${encodeURI(command)}`

  const res = await fetch(url, {
    ...init,
    headers: {
      authorization: `Bearer ${token}`,
      ...init.headers
    }
  })

  const contentType = res.headers.get('content-type') || ''

  const data = contentType.includes('application/json')
    ? await res.json()
    : await res.text()

  if (res.ok) {
    return { count: data.result }
  } else {
    throw new Error(
      `Upstash failed with (${res.status}): ${
        typeof data === 'string' ? data : JSON.stringify(data, null, 2)
      }`
    )
  }
}

const upstash = createUpstash(
  process.env.UPSTASH_URL,
  process.env.UPSTASH_TOKEN
)

export const getDb = namespace => async key =>
  upstash(['incr', `${namespace}:${key}`])
