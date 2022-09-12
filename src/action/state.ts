import { getState, saveState } from '@actions/core'

export function saveMessageState(channel?: string, ts?: string) {
  if (channel) saveState('channel', channel)
  if (ts) saveState('ts', ts)
}

export function getMessageState() {
  return {
    channel: getState('channel'),
    ts: getState('ts'),
  }
}
