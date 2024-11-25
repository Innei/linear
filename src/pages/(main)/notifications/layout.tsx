import { Outlet } from 'react-router'

import { Tabs, TabsList, TabsTrigger } from '~/components/ui/tabs'
import { useNotificationLength } from '~/store/notification/hooks'

export const Component = () => {
  const length = useNotificationLength()

  return (
    <div className="flex relative grow flex-col">
      <div className="flex relative items-center">
        <Tabs defaultValue="all" className="w-full border-b">
          <TabsList className="border-b-0 p-2">
            <TabsTrigger variant="rounded" value="all">
              All
            </TabsTrigger>
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
