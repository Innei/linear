import { useSortedNotifications } from '~/store/notification/hooks'

export const Component = () => {
  const notifications = useSortedNotifications()

  return (
    <div className="h-screen grow overflow-auto rounded-lg border p-4">
      {notifications.map((n) => (
        <div key={n.id}>
          {n.subject.title} {n.updated_at} {n.repositoryId}
        </div>
      ))}
    </div>
  )
}
