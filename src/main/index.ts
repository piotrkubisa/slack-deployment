import { Context } from '@actions/github/lib/context'
import { setFailed, setOutput } from '@actions/core'
import {
  extractTag,
  getRepositoryURL,
  isReleaseWorkflow,
  saveMessageState,
  github,
  slack,
  slackChannel,
  slackIconEmoji,
  slackIconUrl,
  slackUsername,
} from '../action'
import { ChatPostMessageArguments } from '@slack/web-api'
import { context } from '@actions/github'

async function run(ctx: Context): Promise<void> {
  const { runId, ref, sha } = ctx
  const { owner, repo } = ctx.repo

  const tag = extractTag(ref)
  const shaShort = sha.substring(0, 7)

  const repositoryURL = getRepositoryURL(owner, repo)
  const workflowURL = `${repositoryURL}/actions/runs/${runId}`
  const releaseURL = `${repositoryURL}/releases/tag/${tag}`
  const commitURL = `${repositoryURL}/commit/${sha}`

  const commit = await github.rest.repos.getCommit({ owner, repo, ref: sha })

  const mdRef = isReleaseWorkflow(ref)
    ? `<${releaseURL}|${tag}>`
    : `<${commitURL}|${shaShort}>`

  const text = `${isReleaseWorkflow(ref) ? tag : shaShort} \n\n ${commit.data.commit.message}`

  let params: ChatPostMessageArguments = {
    channel: slackChannel,
    text,
    blocks: [
      {
        type: 'section',
        text: { type: 'mrkdwn', text },
        accessory: {
          type: 'button',
          text: {
            type: 'plain_text',
            text: 'See run details',
            emoji: true,
          },
          value: 'click_me_123',
          url: workflowURL,
          action_id: 'button-action',
        },
      },
      {
        type: 'context',
        elements: [
          { type: 'mrkdwn', text: mdRef },
          { type: 'mrkdwn', text: `<${repositoryURL}|${repo}>` },
        ],
      },
    ],
    username: slackUsername,
    icon_emoji: slackIconEmoji,
    icon_url: slackIconUrl,
  }

  const result = await slack.chat.postMessage(params)

  setOutput('ts', result.ts)
  setOutput('channel', result.channel)

  saveMessageState(result.channel, result.ts)
}


run(context)
  .catch(err => {
    setFailed(err.message)
    process.exit(1)
  })
  .then(() => {
    process.exit(0)
  })