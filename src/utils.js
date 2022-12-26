import { fileURLToPath } from 'url'
import { extname, dirname } from 'path'

export const getAsList = options => options.length < 2
  ? options.join(', ')
  : options.slice(0, -1) + ' or ' + options.slice(-1)

export const castTo = (value, type) => {
  if (value === undefined || type === undefined) return value
  switch (type) {
    case 'string': return '' + value
    case 'number': return +value
    case 'boolean': {
      value = ('' + value).toLowerCase()
      return value === 'true'
        || value === 't'
        || value === 'yes'
        || value === 'y'
        || value === '1'
    }
  }
}

const stripExt = path => {
  const ext = extname(path)
  return ext ? path.slice(0, -ext.length) : path
}

export const getMeta = meta => {
  const script = stripExt(process.argv[1])
  const filename = fileURLToPath(meta.url)
  const module = stripExt(filename)
  return {
    isMain: script === module,
    dirname: dirname(filename),
    filename
  }
}
