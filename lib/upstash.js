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
    const value = data.result
    return { count: value === null ? 0 : value }
  } else {
    throw new Error(
      `Upstash failed with (${res.status}): ${
        typeof data === 'string' ? data : JSON.stringify(data, null, 2)
      }`
    )
  }
}

export const upstash = createUpstash(
  process.env.UPSTASH_URL,
  process.env.UPSTASH_TOKEN
)
