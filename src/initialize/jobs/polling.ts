import { getAppPollingInterval } from '~/atoms/app'
import { queryClient } from '~/lib/query-client'
import { sleep } from '~/lib/utils'
import { NotificationRequests } from '~/store/notification/store'

export const pollingNotifications = async () => {
  const job = () => {
    // TODO check token
    return queryClient.prefetchQuery({
      queryKey: ['notifications'],
      queryFn: () => NotificationRequests.fetch(),
    })
  }

  while (true) {
    await job().catch((err) => {
      console.error('Fetching notifications failed', err)
    })
    const pollingInterval = getAppPollingInterval()
    await sleep(pollingInterval)
  }
}
