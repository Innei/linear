import { useQuery } from '@tanstack/react-query'

import { useSortedNotifications } from '~/store/notification/hooks'
import { NotificationRequests } from '~/store/notification/store'

export const Component = () => {
  useQuery({
    queryKey: ['repos'],
    queryFn: () => NotificationRequests.fetchDelta(),
  })

  const notifications = useSortedNotifications()

  return (
    <div className="rounded-lg border p-4">
      {notifications.map((n) => (
        <div key={n.id}>
          {n.subject.title} {n.updated_at} {n.repositoryId}
        </div>
      ))}
    </div>
  )
}
