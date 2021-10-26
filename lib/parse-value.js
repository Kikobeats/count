const parseJSON = input => {
  try {
    return JSON.parse(input)
  } catch (_) {
    return input
  }
}

export const parseValue = value => (value === '' ? true : parseJSON(value))
