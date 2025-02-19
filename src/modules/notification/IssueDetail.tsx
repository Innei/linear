import { Markdown } from '~/components/ui/markdown'
import { useFetchIssue, useIssue } from '~/store/issue/hooks'

import type { SelectedIssue } from './atom'
import { useSelectedNotification } from './atom'

export const IssueDetail = () => {
  const selectedNotification = useSelectedNotification() as SelectedIssue
  const { data: issue } = useFetchIssue({
    owner: selectedNotification.owner,
    repo: selectedNotification.repo,
    issue_number: selectedNotification.issue_number,
  })

  if (!issue)
    return (
      <div className="center flex absolute inset-0">
        <i className="loading loading-dots" />
      </div>
    )

  return <IssueDetailImpl id={issue.id} />
}
const IssueDetailImpl = ({ id }: { id: number }) => {
  const issue = useIssue(id)

  if (!issue) return null

  return (
    <div className="flex h-full flex-col">
      {/* Issue Header */}
      <div className="px-6 py-4">
        <div className="flex mb-4 items-center gap-2">
          <span
            className={`inline-flex items-center rounded-full px-2 py-1 text-sm font-medium capitalize ${
              issue.state === 'open'
                ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-100'
                : 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-100'
            }`}
          >
            <i
              className={`mr-1 ${
                issue.state === 'open'
                  ? 'i-octicon-issue-opened-16'
                  : 'i-octicon-issue-closed-16'
              }`}
            />
            {issue.state}
          </span>
          <h1 className="text-xl font-semibold">{issue.title}</h1>
        </div>

        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
          <img
            src={issue.user?.avatar_url}
            alt={issue.user?.login}
            className="mr-2 size-5 rounded-full"
          />
          <span className="font-medium">{issue.user?.login}</span>
          <span className="mx-1">opened this issue</span>
          <time dateTime={issue.created_at}>
            {new Date(issue.created_at).toLocaleDateString()}
          </time>
        </div>
      </div>

      {/* Issue Body */}
      {issue.body && (
        <div className="grow overflow-auto border-t px-6 py-4">
          <Markdown content={issue.body} />
        </div>
      )}
    </div>
  )
}
