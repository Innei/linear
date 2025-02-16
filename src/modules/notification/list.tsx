import { useVirtualizer } from '@tanstack/react-virtual'
import { memo, useEffect, useMemo, useState } from 'react'

import { ScrollArea } from '~/components/ui/scroll-area/ScrollArea'
import type { DB_Notification } from '~/database'
import { useRouteParams } from '~/hooks/biz/useRouter'
import { useRefValue } from '~/hooks/common'
import { filterUnreadNotifications } from '~/store/notification/helper'
import { useSortedNotifications } from '~/store/notification/hooks'

import { NotificationItem } from './NotificationItem'
import { PeekNotification } from './peek'

export type NotificationListProps = {
  repoId?: string
}
export const NotificationList = memo(({ repoId }: NotificationListProps) => {
  const { type } = useRouteParams()
  const allNotifications = useSortedNotifications(
    type === 'unread' ? filterUnreadNotifications : undefined,
  )

  const notifications = useMemo(() => {
    if (repoId) {
      return allNotifications.filter(
        (n) => n.repositoryId.toString() === repoId,
      )
    }
    return allNotifications
  }, [allNotifications, repoId])

  const notificationsRef = useRefValue(notifications)

  const [unreadNotificationSnapshot, setUnreadNotificationSnapshot] = useState(
    [] as DB_Notification[],
  )

  // 增量 unread 的判断 是否有最新的通知
  // const isNotificationsUnreadChanged =
  //   notifications.length !== unreadNotificationSnapshot.length

  useEffect(() => {
    if (type === 'unread') {
      setUnreadNotificationSnapshot(
        notificationsRef.current as DB_Notification[],
      )
    }
  }, [notificationsRef, type])

  const finalNotifications =
    type === 'unread' ? unreadNotificationSnapshot : notifications

  const [parentRef, setParentRef] = useState<HTMLDivElement | null>(null)

  // The virtualizer
  const rowVirtualizer = useVirtualizer({
    count: finalNotifications.length,
    getScrollElement: () => parentRef,
    estimateSize: () => 12,
    overscan: 30,
  })

  return (
    <>
      <ScrollArea flex rootClassName="grow" ref={setParentRef}>
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
                  id={finalNotifications[virtualItem.index].id}
                  prevId={
                    finalNotifications[virtualItem.index - 1]?.id || undefined
                  }
                />
              </div>
            )
          })}
        </div>
      </ScrollArea>
      <PeekNotification />
    </>
  )
})
// const Render = memo(({ item }: { item: DB_Notification }) => {
//   return <NotificationItem id={item.id} />
// })
