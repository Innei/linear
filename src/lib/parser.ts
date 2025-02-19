export const parseIssueSubjectUrl = (url: string) => {
  const { pathname } = new URL(url)
  const [, , owner, repo, , issue_number] = pathname.split('/')

  return {
    owner,
    repo,
    issue_number: Number(issue_number),
  }
}

export const parsePullRequestSubjectUrl = (url: string) => {
  const { pathname } = new URL(url)
  const [, , owner, repo, , pull_number] = pathname.split('/')

  return { owner, repo, pull_number: Number(pull_number) }
}
