import { formatDate } from 'date-fns'

import {
  useIsSyncingNotifications,
  useNotificationSyncAt,
  useNotificationUpdatedAt,
} from '~/store/notification/hooks'

import {
  Tooltip,
  TooltipContent,
  TooltipPortal,
  TooltipTrigger,
} from '../ui/tooltip'

export const Sidebar = () => {
  const isSyncingNotifications = useIsSyncingNotifications()
  const syncAt = useNotificationSyncAt()
  const updatedAt = useNotificationUpdatedAt()
  return (
    <div className={'flex relative h-full flex-col space-y-3 border-r pt-2.5'}>
      {isSyncingNotifications ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex absolute bottom-2 right-2 cursor-auto select-none items-center gap-1 rounded-full border px-2 py-1 text-xs text-base-content/50">
              <i className="i-mingcute-loading-3-line animate-spin" /> Syncing
            </div>
          </TooltipTrigger>
          <TooltipContent>Syncing notifications...</TooltipContent>
        </Tooltip>
      ) : (
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="center flex absolute bottom-2 right-2 size-6 cursor-auto select-none rounded-full border text-xs text-base-content/50">
              <i className="i-mingcute-time-duration-line" />
            </div>
          </TooltipTrigger>
          <TooltipPortal>
            <TooltipContent>
              {syncAt && (
                <p>Last synced at {formatDate(syncAt, 'MMM d, yyyy h:mm a')}</p>
              )}
              {updatedAt && (
                <p>Updated at {formatDate(updatedAt, 'MMM d, yyyy h:mm a')}</p>
              )}
            </TooltipContent>
          </TooltipPortal>
        </Tooltip>
      )}
    </div>
  )
}
