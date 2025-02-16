export const parseIssueSubjectUrl = (url: string) => {
  const { pathname } = new URL(url)
  const [, , owner, repo, , issue_number] = pathname.split('/')

  return {
    owner,
    repo,
    issue_number: Number(issue_number),
  }
}
