import * as core from '@actions/core'
import { publishMessage } from '../action'

publishMessage()
  .catch(err => {
    core.setFailed(err.message)
    process.exit(1)
  })
  .then(() => {
    process.exit(0)
  })