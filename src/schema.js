import Ajv from 'ajv/dist/2019.js'

export const optsSchema = {
  $defs: {
    param: {
      type: 'object',
      required: ['label', 'description'],
      properties: {
        label: { type: 'string' },
        keys: {
          type: ['string', 'array'],
          items: { type: 'string' }
        },
        description: { type: 'string' },
        type: {
          type: 'string',
          enum: ['string', 'number', 'boolean']
        },
        choices: {
          type: 'array',
          items: { type: 'string' }
        },
        pattern: { },
        required: { type: 'boolean' },
        radioGroup: { type: 'string' }
      }
    },
    params: {
      type: 'array',
      items: { $ref: '#/$defs/param' },
      minItems: 1,
    },
    command: {
      type: 'object',
      required: ['name', 'description', 'run'],
      properties: {
        name: { type: 'string' },
        description: { type: 'string' },
        params: { $ref: '#/$defs/params' },
        run: { validator: method => typeof method === 'function' }
      }
    },
    commands: {
      type: 'object',
      patternProperties: { '^[a-zA-Z][a-zA-Z0-9]*$': { $ref: '#/$defs/command' } },
      minProperties: 1
    },
    group: {
      type: 'object',
      required: ['name', 'description'],
      anyOf: [
        { required: ['groups'] },
        { required: ['commands'] },
        { required: ['action'] }
      ],
      properties: {
        name: { type: 'string' },
        description: { type: 'string' },
        groups: { $ref: '#/$defs/groups' },
        commands: { $ref: '#/$defs/commands' },
        action: { $ref: '#/$defs/command' },
        params: { $ref: '#/$defs/params' }
      }
    },
    groups: {
      type: 'object',
      patternProperties: { '^[a-zA-Z][a-zA-Z0-9]*$': { $ref: '#/$defs/group' } },
      minProperties: 1
    }
  },
  type: 'object',
  allOf: [{ $ref: '#/$defs/group' }],
  required: ['name', 'version'],
  properties: {
    version: { type: 'string' },
    promptForMissingArgs: { type: 'boolean' },
  }
}

const ajv = new Ajv({ allowUnionTypes: true })
ajv.addKeyword({
  keyword: 'validator',
  compile(schema, /*parentSchema*/) {
    return function validator(data) {
      const isValid = schema(data)
      if (isValid) return true
      validator.errors = [{
        keyword: 'validator',
        message: `Value '${data}' of type '${typeof data}' did not pass the validator function: ${schema.toString()}.`,
        params: {}
      }]
      return false
    }
  }
})

export const configValidator = ajv.compile(optsSchema)
