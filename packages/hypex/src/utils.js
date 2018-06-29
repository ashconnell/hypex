import config from './config'

export const invariant = (valid, message) => {
  if (valid === false && !config.prod) {
    throw new Error(`[mobx-quantum] ${message}`)
  }
}
