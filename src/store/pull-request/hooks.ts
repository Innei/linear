import { useQuery } from '@tanstack/react-query'

import { pullRequestRequest, usePullRequestStore } from './store'

export const usePullRequest = (id: number) => {
  const pullRequest = usePullRequestStore((state) => state.pullRequests[id])
  return pullRequest
}

export const useFetchPullRequest = ({
  owner,
  repo,
  pull_number,
}: {
  owner: string
  repo: string
  pull_number: number
}) => {
  return useQuery({
    queryKey: ['pullRequests', owner, repo, pull_number],
    queryFn: () => pullRequestRequest.fetchById({ owner, repo, pull_number }),
  })
}
