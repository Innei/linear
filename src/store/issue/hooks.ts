import { useQuery } from '@tanstack/react-query'

import { issueRequest, useIssueStore } from './store'

export const useIssue = (id: number) => {
  const issue = useIssueStore((state) => state.issues[id])
  return issue
}

export const useFetchIssue = ({
  owner,
  repo,
  issue_number,
}: {
  owner: string
  repo: string
  issue_number: number
}) => {
  return useQuery({
    queryKey: ['issues', owner, repo, issue_number],
    queryFn: () => issueRequest.fetch({ issue_number, owner, repo }),
  })
}
