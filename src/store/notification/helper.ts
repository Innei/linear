import type { DB_Notification } from '~/database'

export const filterUnreadNotifications = (notification: DB_Notification) => {
  return !notification.last_read_at
}
