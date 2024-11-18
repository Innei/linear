import { selectNotificationLength } from './selectors'
import { useNotificationStore } from './store'

export const useSortedNotifications = () => {
  const notifications = useNotificationStore((state) => {
    return Object.values(state.notifications).sort((a, b) => {
      return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    })
  })

  return notifications
}

export const useIsSyncingNotifications = () => {
  return useNotificationStore((state) => state.syncingAll || state.syncingDelta)
}

export const useNotification = (id: string) => {
  return useNotificationStore((state) => state.notifications[id])
}

export const useNotificationLength = () => {
  return useNotificationStore(selectNotificationLength)
}
