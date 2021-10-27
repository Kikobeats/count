'use strict'

import { parseValue } from './parse-value'

export const toQuery = ({ searchParams }) => {
  const query = Object.fromEntries(searchParams)
  return Object.keys(query).reduce(
    (acc, key) => ({ ...acc, [key]: parseValue(query[key]) }),
    {}
  )
}
