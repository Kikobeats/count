/* global fetch */

const createUpstash = (baseUrl, token) => async (args, init = {}) => {
  const command = args.join('/')
  const url = `${baseUrl}/${command}`

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
    return data.result && data.result.startsWith('{')
      ? JSON.parse(data.result)
      : data.result
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

export const getCollection = collection => {
  const get = key => upstash(['get', `${collection}:${key}`])
  const set = async (key, { updatedAt, createdAt, count }, quantity) => {
    const now = Date.now()
    const value = {
      updatedAt: updatedAt || now,
      createdAt: createdAt || now,
      count: count + quantity
    }
    await upstash(['set', `${collection}:${key}`], {
      method: 'POST',
      body: JSON.stringify(value)
    })
    return value
  }
  return { get, set }
}
