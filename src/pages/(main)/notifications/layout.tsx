import { Outlet } from 'react-router'

import { Tabs, TabsList, TabsTrigger } from '~/components/ui/tabs'
import type { NotificationType } from '~/hooks/biz/useRouter'
import { useRouteParams, useRouter } from '~/hooks/biz/useRouter'
import { useNotificationLength } from '~/store/notification/hooks'

export const Component = () => {
  const length = useNotificationLength()
  const { type } = useRouteParams()
  const { navigate } = useRouter()

  return (
    <div className="flex relative grow flex-col">
      <div className="flex relative items-center">
        <Tabs
          variant="rounded"
          value={type || 'all'}
          onValueChange={(value) => {
            navigate({
              type: value as NotificationType,
            })
          }}
          className="w-full border-b"
        >
          <TabsList className="border-b-0 p-2">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread">Unread</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex absolute inset-y-0 right-2 items-center text-xs text-tertiary">
          {length} notifications
        </div>
      </div>
      <Outlet />
    </div>
  )
}
