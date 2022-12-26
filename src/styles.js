import chalk from 'chalk'
import { getMeta } from './utils.js'

const styles = {
  default: chalk.white,

  debug: chalk.blueBright.bold,

  info: chalk.whiteBright,
  warn: chalk.hex('#FFD500'),
  error: chalk.redBright,
  success: chalk.greenBright,

  cyan: chalk.cyanBright,
  magenta: chalk.magentaBright,
  yellow: chalk.yellow,

  heading: chalk.whiteBright.bold.underline,
  comment: chalk.gray.italic,
  label: chalk.gray.bold,
  link: chalk.underline.bold,
  code: chalk.bold.cyan,
  desc: chalk.italic,
  choices: chalk.bold.magenta,
  timestamp: chalk.blackBright
}

export const tags = {
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

const date = (date = new Date) => {
  const YYYY = date.getFullYear()
  const MM = ('' + (date.getMonth() + 1)).padStart(2, '0')
  const DD = ('' + date.getDate()).padStart(2, '0')
  const hh = ('' + date.getHours()).padStart(2, '0')
  const mm = ('' + date.getMinutes()).padStart(2, '0')
  const ss = ('' + date.getSeconds()).padStart(2, '0')
  return `${YYYY}-${MM}-${DD} ${hh}:${mm}:${ss}`
}

const tag = (tag, str) => styles[tags[tag] || tags.default](('' + str).toUpperCase())

export const heading = str => styles.heading(str)
export const comment = str => styles.comment(str)
export const label = str => styles.label(('' + str).toUpperCase())
export const link = str => styles.link(str)
export const code = str => styles.code(str)
export const desc = str => styles.desc(str)
export const choices = items => styles.choices(Array.isArray(items) ? items.join(', ') : '' + items)
export const timestamp = () => styles.timestamp(`[${date()}]`)
export const log = (msg, ...meta) => `${styles.timestamp()}${meta.length ? ' ' + tag(...meta) : ''} ${msg}`
export const debug = (msg, ...meta) => `${styles.timestamp()}${meta.length ? ' ' + tag(...meta) : ''} ${styles.debug(msg)}`
export const info = str => styles.info(str)
export const success = str => styles.success(str)
export const warn = str => styles.warn(str)
export const error = str => styles.error(str)

if (getMeta(import.meta).isMain) {
  console.log('')
  const sentence = `The quick brown fox jumped over the lazy dog.`
  const keys = Object.keys(styles)
  const max = keys.reduce((a, c) => Math.max(a, c.length), 0)
  keys.forEach(key => {
    const style = styles[key]
    const label = key.padStart(max, ' ')
    console.log(` ${label}: ${style(sentence)}`)
  })
  console.log('')
}
