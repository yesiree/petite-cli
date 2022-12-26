import { castTo } from './utils.js'
import { errorTypesMap } from './errors.js'

const seekCommand = ({
  fixed,
  group: parent,
  params: ancestorParams = [],
  context = [],
} = {}) => {

  const next = fixed[0]
  const {
    groups = {},
    commands = {},
    action,
    parentParams = []
  } = parent

  const group = groups[next]
  if (group) {
    group.type = 'group'
    group.parent = parent
    return seekCommand({
      fixed: fixed.slice(1),
      group,
      params: [...ancestorParams, ...parentParams],
      context: [...context, next]
    })
  }

  const command = commands[next] || action
  if (command) {
    command.type = 'command'
    command.parent = parent
    return {
      fixed: fixed.slice(1),
      parent,
      command,
      params: [
        ...ancestorParams,
        ...parentParams,
        ...(command.params || [])
      ]
    }
  }

  return {
    group: parent,
    error: {
      type: errorTypesMap.invalidCommand,
      name: next,
      parent
    }
  }
}

export const findCommand = ({ fixed: originalFixed, named, config }) => {
  const errors = []
  const args = { fixed: [], named: {} }
  const {
    error,
    parent,
    fixed,
    command,
    params = []
  } = seekCommand({
    fixed: originalFixed,
    group: config,
    params: []
  })

  if (error) errors.push(error)

  const radioGroups = {}
  params.forEach(param => {
    const {
      label,
      keys = [],
      // description,
      type,
      choices,
      pattern,
      required,
      radioGroup
    } = param
    let key, value
    if (keys.length) {
      key = keys[0]
      value = keys.map(x => named[x]).find(x => x)
    } else {
      value = fixed.shift()
    }

    value = castTo(value, type)

    if (radioGroup && radioGroups[radioGroup]) {
      const options = params
        .filter(x => x.radioGroup === radioGroup)
        .map(x => x.label)
      errors.push({ type: errorTypesMap.conflictingParam, label, options, command, parent })
    } else if (radioGroup) {
      radioGroups[radioGroup] = true
    }

    if (value === undefined && required) {
      errors.push({ type: errorTypesMap.missingParam, label, command, parent })
    }

    if (choices && !choices.includes(value)) {
      errors.push({ type: errorTypesMap.invalidParamValue, label, value, options: choices })
    }

    if (pattern && !value.test(pattern)) {
      errors.push({ type: errorTypesMap.invalidParamValue, label, value, pattern })
    }

    if (key) args.named[key] = value
    else args.fixed.push(value)
  })

  return {
    errors,
    parent,
    command,
    args
  }
}
