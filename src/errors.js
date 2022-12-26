import { logger } from './logger.js'

export const errorTypesMap = {
  invalidCommand: 'invalid-command',
  invalidParam: 'invalid-param',
  missingParam: 'missing-param',
  conflictingParam: 'conflicting-param',
  invalidParamValue: 'invalid-param-value',
}

const getCommandGroupPath = node => {
  const path = []
  while (node) {
    path.unshift(node.name || JSON.stringify(node))
  }
  return path.join(' -> ')
}

export const showInvalidCommandError = (name, parent) => {
  const context = parent
    ? ` in command group '${getCommandGroupPath(parent)}'.`
    : '.'
  logger.error(`Invalid command '${name}'${context}`)
}

export const showInvalidParamError = (name) => {
  logger.error(`Invalid parameter '${name}'.`)
}

export const showMissingParamError = (label, command, parent) => {
  const { name: commandName } = command
  let context = '.'
  if (commandName) {
    context = ` in command '${commandName}`
    if (parent) {
      context += ` in command group '${getCommandGroupPath(parent)}'`
    }
    context += '.'
  }
  logger.error(`Missing required argument '${label}'${context}`)
}

export const showConflictingParamError = (label, params, command, parent) => {
  const { name: commandName } = command
  let context = '.'
  if (commandName) {
    context = ` in command '${commandName}'`
    if (parent) {
      context += ` in command group '${getCommandGroupPath(parent)}'`
    }
    context += '.'
  }
  logger.error(`Conflicting argument '${label}'${context} Must be one of ${listOptions(options)}.`)
}

export const showInvalidParamValueError = (name, value, options) => {
  let message = `Invalid value '${value}' for parameter '${name}'.`
  if (options) {
    if (Array.isArray(options)) {
      message += ` Must be one of ${listOptions(options)}.`
    } else if (options instanceof RegExp) {
      message += ` Must match pattern ${options}.`
    } else if (typeof options === 'string') {
      message += ` Must be of type '${options}'.`
    }
  }
  logger.error(message)
}

export const showErrors = (...errors) => {
  for (const { type, details } of errors) {
    switch (type) {
      case errorTypesMap.invalidCommand: {
        const { name, parent } = details
        showInvalidCommandError(name, parent)
        break
      } case errorTypesMap.invalidParam: {
        const { name } = details
        showInvalidParamError(name)
        break
      } case errorTypesMap.conflictingParam: {
        const { label, options, command, parent } = details
        showConflictingParamError(label, options, command, parent)
      } case errorTypesMap.missingParam: {
        const { label, command, parent } = details
        showMissingParamError(label, command, parent)
      } case errorTypesMap.invalidParamValue: {
        const { name, value, options } = details
        showInvalidParamValueError(name, value, options)
        break
      }
      default:
        throw new Error(`errors: invalid error type '${type}'.`)
    }
  }
}

export const showValidationErrors = errors => {
  logger.error(`Found the following errors in your CLI config:`)
  for (const error of errors) {
    const { message } = error
    const location = error.instancePath
      .slice(1)
      .replace(/\//g, '.')



    logger.error(
      `Found issue in your CLI configuration at ${location}.\n` +
      `Error: ${error.message}`
    )
    console.dir(error)
  }
}
