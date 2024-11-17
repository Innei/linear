import { queryClient } from '~/lib/query-client'
import { NotificationRequests } from '~/store/notification/store'

export const pollingNotifications = () => {
  const timeout = 1000 * 60 * 5 // 5 minutes

  const job = () => {
    // TODO check token
    return queryClient.prefetchQuery({
      queryKey: ['notifications'],
      queryFn: () => NotificationRequests.fetch(),
    })
  }

  setTimeout(async () => {
    await job().finally(() => {
      pollingNotifications()
    })
  }, timeout)
}
