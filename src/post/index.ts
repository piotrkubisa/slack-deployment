import * as core from '@actions/core'

const run = (): Promise<void> => {
  return new Promise(() => {
    console.log('Hello World')
  })
}

run()
  .catch(err => {
    core.setFailed(err.message)
    process.exit(1)
  })
  .then(() => {
    process.exit(0)
  })