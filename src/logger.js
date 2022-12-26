import chalk from 'chalk'
import { ioModesList, ioModesMap } from './output.js'
import { getAsList } from './utils.js'

let opts = {
  mode: ioModesMap.interactive
}

export const configureLogging = ({ mode = opts.mode }) => {
  if (!ioModesList.includes(mode)) {
    const modesStr = getAsList(ioModesList)
    throw Error(`logger: invalid mode: '${mode}'. Must be one of ${modesStr}`)
  }
  opts = { ...opts, mode }
}

const tags = {
  default: 'default',
  debug: 'debug',
  info: 'info',
  warn: 'warn',
  error: 'error',
  success: 'success',
  cyan: 'cyan',
  magenta: 'magenta',
  yellow: 'yellow',
}

const styles = {
  default: chalk.white,
  debug: chalk.blueBright,
  info: chalk.whiteBright,
  warn: chalk.hex('#FFA500'),
  error: chalk.redBright,
  success: chalk.greenBright,
  cyan: chalk.cyanBright,
  magenta: chalk.magentaBright,
  yellow: chalk.yellow
}

const timestamp = (date = new Date()) => {
  const YYYY = date.getFullYear()
  const MM = ('' + (date.getMonth() + 1)).padStart(2, '0')
  const DD = ('' + date.getDate()).padStart(2, '0')
  const hh = ('' + date.getHours()).padStart(2, '0')
  const mm = ('' + date.getMinutes()).padStart(2, '0')
  const ss = ('' + date.getSeconds()).padStart(2, '0')
  return chalk.gray(`[${YYYY}-${MM}-${DD} ${hh}:${mm}:${ss}]`)
}

const MAX_PREFIX_LEN = 5
const ELLIPSIS = '...'
const prefix = (tag = 'LOG') => {
  return chalk.bold(
    (
      tag.length > MAX_PREFIX_LEN
        ? tag.slice(0, MAX_PREFIX_LEN - ELLIPSIS.length) + ELLIPSIS
        : tag.padStart(MAX_PREFIX_LEN, ' ')
    ).toUpperCase()
  )
}

const log = (tag, message, { label = '', ...data } = {}) => {
  const style = styles[tag] || styles.default
  const time = timestamp()
  const content = label
    ? style(`${prefix(label)}: ${message}`)
    : style(message)
  const lines = `${time} ${content}`
    .split('\n')
    .map((x, i) => i === 0 ? x : ' '.repeat(22) + x)
  process.stderr.write(`${lines.join('\n')}\n`)
  if (Object.keys(data).length) {
    const json = JSON
      .stringify(data, null, 2)
      .split('\n')
      .map(x => ' '.repeat(22) + x)
    process.stderr.write(json)
    // process.stderr.write(`${JSON.stringify(data, null, 2)}\n`)
  }
}

export const logger = {
  log: log.bind(null, ''),
  debug: log.bind(null, tags.debug),
  info: log.bind(null, tags.info),
  warn: log.bind(null, tags.warn),
  // error: log.bind(null, tags.error),
  error(e, extras) {
    let message = e
    if (e instanceof Error) {
      message = `${e.message}\n${e.stack}`
    }
    log(tags.error, message, extras)
  },
  success: log.bind(null, tags.success),
  cyan: log.bind(null, tags.cyan),
  magenta: log.bind(null, tags.magenta),
  yellow: log.bind(null, tags.yellow),
}

export const writeOutput = output => {
  process.stdout.write(`${output}\n`)
}
