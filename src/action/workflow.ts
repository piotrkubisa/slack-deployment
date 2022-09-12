export const extractTag = (ref: string): string => {
  if (!ref) {
    throw new Error('provided ref is empty or not provided at all')
  }
  if (ref.startsWith('refs/tags/')) {
    return ref.replace('refs/tags/', '')
  }
  return ref
}

export const getWorkflowType = (ref: string): 'tag' | 'branch' | 'pull_request' => {
  if (ref.startsWith('refs/tags/')) {
    // Pushed on tag creation
    return 'tag'
  }
  if (ref.startsWith('refs/heads/')) {
    // Pushed to merge 2 branches
    return 'branch'
  }
  if (ref.startsWith('refs/pull/')) {
    // Pull request opened, synchronized, opened
    return 'pull_request'
  }
  throw new Error('could not recognize type of the workflow')
}

export const isReleaseWorkflow = (ref: string, tagName?: string): boolean => getWorkflowType(ref) == 'tag' || tagName != ''

export const getRepositoryURL = (owner: string, repo: string): string => `${process.env.GITHUB_SERVER_URL || 'https://github.com'}/${owner}/${repo}`