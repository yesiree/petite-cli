export const parseArgs = (args = process.argv.slice(2)) => {
  const fixed = []
  const named = {}
  for (const arg of args) {
    const isNamed = arg[0] === '-'
    const isShort = isNamed && arg[1] !== '-'
    if (isNamed) {
      let key = '', value = true
      for (const c of arg) {
        if (!key && c === '-') continue
        if (value === true && c === '=') value = ''
        else if (value === true) key += c
        else value += c
      }
      const keys = value === true && isShort ? key.split('') : [key]
      keys.forEach(key => named[key] = value)
    } else {
      fixed.push(arg)
    }
  }
  return { fixed, named }
}
