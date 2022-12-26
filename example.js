import { execute } from './src/index.js'

execute({
  name: 'example',
  // version: '0.0.1',
  description: 'A simple example cli.',
  action: {
    name: '',
    description: 'The default action for this example cli',
    run: 'foo'
  }
})
