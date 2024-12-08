import * as Avatar from '@radix-ui/react-avatar'
import { TooltipPortal } from '@radix-ui/react-tooltip'
import { useVirtualizer } from '@tanstack/react-virtual'
import { memo, useMemo, useState } from 'react'

import { useUser } from '~/atoms/user'
import { RelativeTime } from '~/components/ui/datetime'
import { ActivityType } from '~/components/ui/icons/ActivityType'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/ui/tooltip'
import { useRouteParams } from '~/hooks/biz/useRouter'
import { cn } from '~/lib/cn'
import { getGitHubURL } from '~/lib/gh'
import { filterUnreadNotifications } from '~/store/notification/helper'
import {
  useNotification,
  useSortedNotifications,
} from '~/store/notification/hooks'
import { NotificationStoreActions } from '~/store/notification/store'
import { useRepo } from '~/store/repo/hooks'

export const NotificationList = memo(() => {
  const { type } = useRouteParams()
  const notifications = useSortedNotifications(
    type === 'unread' ? filterUnreadNotifications : undefined,
  )
  const [parentRef, setParentRef] = useState<HTMLDivElement | null>(null)

  // The virtualizer
  const rowVirtualizer = useVirtualizer({
    count: notifications.length,
    getScrollElement: () => parentRef,
    estimateSize: () => 12,
    overscan: 30,
  })

  return (
    <div className="grow overflow-auto py-4" ref={setParentRef}>
      {/* <List
        id="notifications"
        keyExtractor={(item) => item.id}
        data={notifications}
        renderItem={Render}
      /> */}
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
        }}
        className="relative contain-strict"
      >
        {rowVirtualizer.getVirtualItems().map((virtualItem) => {
          return (
            <div
              className="duration-200 will-change-transform"
              key={virtualItem.key}
              ref={rowVirtualizer.measureElement}
              data-index={virtualItem.index}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                transform: `translateY(${virtualItem.start}px)`,
              }}
            >
              <NotificationItem
                id={notifications[virtualItem.index].id}
                prevId={notifications[virtualItem.index - 1]?.id || undefined}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
})
// const Render = memo(({ item }: { item: DB_Notification }) => {
//   return <NotificationItem id={item.id} />
// })
const NotificationItem = memo((props: { id: string; prevId?: string }) => {
  const notification = useNotification(props.id)
  const prevNotificationRepoId = useNotification(
    props.prevId || '',
    (n) => n?.repositoryId,
  )
  const prevRepo = useRepo(prevNotificationRepoId || 0)
  const repo = useRepo(notification.repositoryId)

  const prevRepoEqual = prevRepo?.id === repo?.id

  const user = useUser()

  const resolvedUrl = useMemo(() => {
    if (!repo) return null
    return getGitHubURL(notification, repo, user?.id?.toString())
  }, [notification, repo, user?.id])

  const { unread } = notification

  if (!notification) return null

  if (!repo?.owner) return null

  return (
    <a
      data-id={notification.id}
      href={resolvedUrl || ''}
      onClick={(e) => {
        e.preventDefault()

        NotificationStoreActions.markAsRead(notification.id)
      }}
      onDoubleClick={() => {
        if (resolvedUrl) {
          window.open(resolvedUrl, '_blank')
        }
      }}
      className={
        'flex cursor-link items-center justify-between px-4 py-2 hover:bg-muted'
      }
    >
      <div className="flex items-center gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            {/* FIXME: 这里可能不显示 */}
            {!prevRepoEqual && repo ? (
              <Avatar.Root className="size-6 shrink-0">
                <Avatar.Image
                  className="size-6 rounded-full"
                  src={repo.owner.avatar_url}
                />
                <Avatar.Fallback
                  delayMs={100}
                  className="center inline-flex size-6 rounded-full border text-xs text-base-content/50"
                >
                  {repo.owner.login.slice(0, 2)}
                </Avatar.Fallback>
              </Avatar.Root>
            ) : (
              <div className="size-6" />
            )}
          </TooltipTrigger>
          <TooltipPortal>
            <TooltipContent>
              {repo.owner.login}/{repo.name}
            </TooltipContent>
          </TooltipPortal>
        </Tooltip>
        <div>
          {!prevRepoEqual && repo && (
            <a
              href={repo.html_url}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => {
                e.preventDefault()
                window.open(repo.html_url, '_blank')
              }}
              className="text-xs font-medium text-base-content/60"
            >
              {repo.owner.login}/{repo.name}
            </a>
          )}
          <div
            className={cn(
              "before:mr-1.5 before:inline-block before:size-2 before:shrink-0 before:translate-y-[-2px] before:rounded-full before:bg-accent before:duration-200 before:content-['']",
              !unread && 'before:-mr-2 before:scale-0',
              'flex min-w-0 items-center',
            )}
          >
            <span className="shrink-0 translate-y-0.5 self-start">
              <ActivityType type={notification.subject.type} />
            </span>
            <span className="ml-1 shrink">{notification.subject.title}</span>
          </div>
        </div>
      </div>

      <div className="ml-2 shrink-0 text-xs tabular-nums text-tertiary">
        <RelativeTime
          displayAbsoluteTimeAfterDay={1}
          date={notification.updated_at}
        />
      </div>
    </a>
  )
})
