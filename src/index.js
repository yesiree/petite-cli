import Ajv from 'ajv/dist/2019.js'
import { optsSchema } from './schema.js'
import { showHelp } from './help.js'
import { findCommand } from './route.js'
import { logger, configureLogging, writeOutput } from './logger.js'
import { getIoMode, getIoFormat, ioParams, queryAndFormat } from './output.js'
import { showErrors, showValidationErrors } from './errors.js'
import { parseArgs } from './parse.js'
import { configValidator } from './schema.js'


const builtInCommands = {
  version: 'version',
  v: 'version',
  help: 'help'
}

export const execute = (config) => {
  const isValid = configValidator(config)
  if (!isValid) {
    showValidationErrors(configValidator.errors)
    process.exit(1)
  }

  if (!config.params) config.params = []
  config.params = [...config.params, ...ioParams]

  const { name, version } = config
  const { fixed, named } = parseArgs()

  const root = builtInCommands[fixed[0]]
  switch (root) {
    case 'version':
      logger.info(`${name} ${version}`)
      process.exit(0)
      break
    case 'help':
      showHelp({ config, fixed, named })
      process.exit(0)
      break
    default:
      // TODO generic term for group or command
      const { errors, parent, command, args } = findCommand({ fixed, named, config }) || {}
      if (errors && errors.length) {
        showErrors(errors)
        showHelp({ config, fixed, named, parent, command })
        process.exit(1)
      }

      const {
        query,
        json, text, // formats
        interactive, autonomous, silent, // modes
      } = named

      const mode = getIoMode({ interactive, autonomous, silent })
      const format = getIoFormat({ json, text })

      configureLogging({ mode })
      const data = command.run({ logger, ...args })
      const output = queryAndFormat(data, query, format)
      writeOutput(output)
  }
}
