import { getInput } from '@actions/core'

export const slackChannel = getInput('slack_channel', { required: true })
export const slackUsername = getInput('slack_username')
export const slackIconEmoji = getInput('slack_icon_emoji')
export const slackIconUrl = getInput('slack_icon_url')
