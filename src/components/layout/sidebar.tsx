import { clsxm } from '~/lib/cn'
import { useIsSyncingNotifications } from '~/store/notification/hooks'

import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'

export const Sidebar = () => {
  const isSyncingNotifications = useIsSyncingNotifications()
  return (
    <div
      className={clsxm(
        'relative flex h-full flex-col space-y-3 pt-2.5 border-r',
      )}
    >
      {isSyncingNotifications ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex absolute bottom-2 right-2 cursor-auto select-none items-center gap-1 rounded-full border px-2 py-1 text-xs text-base-content/50">
              <i className="i-mingcute-loading-3-line animate-spin" /> Syncing
            </div>
          </TooltipTrigger>
          <TooltipContent>Syncing notifications...</TooltipContent>
        </Tooltip>
      ) : null}
    </div>
  )
}
