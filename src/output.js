export const ioModesList = ['interactive', 'autonomous', 'silent']
export const ioModesMap = {
  interactive: 'interactive',
  autonomous: 'autonomous',
  silent: 'silent'
}

export const getIoMode = ({ interactive, autonomous, silent }) => {
  if (silent) return ioModesMap.silent
  if (autonomous) return ioModesMap.autonomous
  return ioModesMap.interactive
}

export const ioFormatList = ['json', 'text']
export const ioFormatMap = {
  json: 'json',
  text: 'text'
}

export const getIoFormat = ({ json, text }) => {
  if (text) return ioFormatMap.text
  return ioFormatMap.json
}

export const ioParams = [
  {
    label: 'QUERY',
    keys: ['query'],
    description: 'A dot-notation json query to transoform the output.'
  },
  {
    label: 'INTERACTIVE',
    keys: ['interactive'],
    description: 'Allow interactive inputs and outputs.',
    type: 'boolean',
    radioGroup: 'io-mode'
  },
  {
    label: 'AUTONOMOUS',
    keys: ['autonomous'],
    description: 'Disable interactive prompts and make output linear.',
    type: 'boolean',
    radioGroup: 'io-mode'
  },
  {
    label: 'SILENT',
    keys: ['silent'],
    description: 'Silence all output from the program.',
    type: 'boolean',
    radioGroup: 'io-mode'
  },
  {
    label: 'JSON',
    keys: ['json'],
    description: 'Format output as json.',
    type: 'boolean',
    radioGroup: 'io-format'
  },
  {
    label: 'TEXT',
    keys: ['text'],
    description: 'Format output as plain text.',
    type: 'boolean',
    radioGroup: 'io-format'
  }
]

export const queryAndFormat = (data, query = '', format = ioFormatMap.json) => {
  if (typeof query !== 'string') {
    throw Error(`Path parameter must be a string. Found '${typeof query}' with value '${query}'`)
  }
  if (!data) return
  if (!query) data

  const keys = query.split('.').filter(Boolean)
  let node = data
  for (const key of keys) {
    node = node[key]
    if (!node) break
  }

  switch (format) {
    case 'text':
      return '' + node
    case 'json':
    default:
      return JSON.stringify(node, null, 2)
  }
}
