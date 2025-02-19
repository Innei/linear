
import { Markdown } from '~/components/ui/markdown'
import { useFetchPullRequest, usePullRequest } from '~/store/pull-request/hooks'

import type { SelectedPullRequest } from './atom'
import { useSelectedNotification } from './atom'

export const PullRequestDetail = () => {
  const selectedNotification = useSelectedNotification() as SelectedPullRequest
  const { data: pullRequest } = useFetchPullRequest({
    owner: selectedNotification.owner,
    repo: selectedNotification.repo,
    pull_number: selectedNotification.pull_request_number,
  })

  if (!pullRequest)
    return (
      <div className="center flex absolute inset-0">
        <i className="loading loading-dots" />
      </div>
    )

  return <PullRequestDetailImpl id={pullRequest.id} />
}

const PullRequestDetailImpl = ({ id }: { id: number }) => {
  const pullRequest = usePullRequest(id)

  if (!pullRequest) return null

  return (
    <div className="flex h-full flex-col">
      {/* Pull Request Header */}
      <div className="px-6 py-4">
        <div className="mb-2 block space-x-2">
          <span
            className={`inline-flex items-center rounded-full px-2 py-1 text-sm font-medium capitalize ${
              pullRequest.state === 'open'
                ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-100'
                : 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-100'
            }`}
          >
            <i
              className={`mr-1 ${
                pullRequest.state === 'open'
                  ? 'i-octicon-git-pull-request-16'
                  : 'i-octicon-git-pull-request-closed-16'
              }`}
            />
            {pullRequest.state}
          </span>
          <h1 className="inline text-xl font-semibold">{pullRequest.title}</h1>
        </div>

        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
          <img
            src={pullRequest.user?.avatar_url}
            alt={pullRequest.user?.login}
            className="mr-2 size-5 rounded-full"
          />
          <span className="font-medium">{pullRequest.user?.login}</span>
          <span className="mx-1">opened this pull request</span>
          <time dateTime={pullRequest.created_at}>
            {new Date(pullRequest.created_at).toLocaleDateString()}
          </time>
        </div>
      </div>

      {/* Pull Request Body */}
      {pullRequest.body && (
        <div className="grow overflow-auto border-t px-6 py-4">
          <Markdown content={pullRequest.body} />
        </div>
      )}
    </div>
  )
}
