import { useVirtualizer } from '@tanstack/react-virtual'
import { memo, useState } from 'react'

import { RelativeTime } from '~/components/ui/datetime'
import {
  useNotification,
  useSortedNotifications,
} from '~/store/notification/hooks'

export const NotificationList = () => {
  const notifications = useSortedNotifications()
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
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
        }}
        className="relative contain-strict"
      >
        {rowVirtualizer.getVirtualItems().map((virtualItem) => {
          return (
            <div
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
              <NotificationItem id={notifications[virtualItem.index].id} />
            </div>
          )
        })}
      </div>
    </div>
  )
}
const NotificationItem = memo((props: { id: string }) => {
  const notification = useNotification(props.id)
  if (!notification) return null
  return (
    <a
      href={notification.subject.url}
      onClick={(e) => {
        e.preventDefault()
      }}
      onDoubleClick={() => {
        window.open(notification.subject.url, '_blank')
      }}
      className="flex cursor-link items-center justify-between px-4 py-2 hover:bg-muted"
    >
      <div>{notification.subject.title}</div>

      <div className="text-xs tabular-nums text-tertiary">
        <RelativeTime
          displayAbsoluteTimeAfterDay={1}
          date={notification.updated_at}
        />
      </div>
    </a>
  )
})
