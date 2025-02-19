import { AnimatePresence, m } from 'motion/react'
import { useMemo } from 'react'

import { ScrollArea } from '~/components/ui/scroll-area'

import { setSelectedNotification, useSelectedNotification } from './atom'
import { IssueDetail } from './IssueDetail'
import { PullRequestDetail } from './PullRequestDetail'

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
