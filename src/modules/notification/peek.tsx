import { AnimatePresence, m } from 'motion/react'
import { useMemo } from 'react'

import { Markdown } from '~/components/ui/markdown'
import { ScrollArea } from '~/components/ui/scroll-area'
import { useFetchIssue, useIssue } from '~/store/issue/hooks'

import type { SelectedIssue } from './atom'
import { setSelectedNotification, useSelectedNotification } from './atom'

export const PeekNotification = () => {
  const selectedNotification = useSelectedNotification()

  const open = !!selectedNotification
  return (
    <AnimatePresence>
      {open && (
        <m.div
          className="flex fixed inset-y-0 right-0 w-[50vw] max-w-[800px] flex-col border-l bg-slate-50 dark:bg-zinc-900"
          initial={{ opacity: 0, transform: 'translateX(100%)' }}
          animate={{
            opacity: 1,
            transform: 'translateX(0%)',
          }}
          transition={{
            type: 'spring',
            stiffness: 360,
            damping: 40,
          }}
          exit={{ opacity: 0, transform: 'translateX(100%)' }}
        >
          <PeekHeader />
          <ScrollArea.ScrollArea
            rootClassName="h-0 grow"
            viewportClassName="overflow-auto"
          >
            <ConditionalRender />
          </ScrollArea.ScrollArea>
        </m.div>
      )}
    </AnimatePresence>
  )
}

const PeekHeader = () => {
  const selectedNotification = useSelectedNotification()

  const headerTitle = useMemo(() => {
    if (!selectedNotification) return ''
    if (selectedNotification.type === 'issue') {
      return `${selectedNotification.owner}/${selectedNotification.repo} #${selectedNotification.issue_number}`
    }
    return `${selectedNotification.owner}/${selectedNotification.repo} #${selectedNotification.pull_request_number}`
  }, [selectedNotification])
  return (
    <div className="flex relative items-center justify-between border-b p-4">
      <span className="shrink grow truncate text-lg font-semibold">
        {headerTitle}
      </span>
      <button
        type="button"
        className="flex shrink-0 items-center justify-center"
        onClick={() => {
          setSelectedNotification(null)
        }}
      >
        <i className="i-mingcute-close-line text-xl" />
      </button>
    </div>
  )
}

const ConditionalRender = () => {
  const selectedNotification = useSelectedNotification()

  if (!selectedNotification) return null

  switch (selectedNotification.type) {
    case 'issue': {
      return <IssueDetail />
    }
    case 'pull_request': {
      return <PullRequestDetail />
    }
  }
}

const IssueDetail = () => {
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

const PullRequestDetail = () => {
  return <div>PullRequestDetail</div>
}
