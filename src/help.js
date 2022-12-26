import * as styles from './styles.js'


export const showHelp = ({
  config, fixed, named,
  parent, command, args
} = {}) => {
  if (errors) {
    errors.forEach(({ error, parent }) => {
      console.log(error)
    })
  }
}
