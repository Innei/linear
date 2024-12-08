import * as Avatar from '@radix-ui/react-avatar'
import { formatDate } from 'date-fns'
import { m } from 'framer-motion'

import { cx } from '~/lib/cn'
import {
  useIsSyncingNotifications,
  useNotificationSyncAt,
  useNotificationUpdatedAt,
} from '~/store/notification/hooks'
import { useRepoList } from '~/store/repo/hooks'

import { ScrollArea } from '../ui/scroll-area/ScrollArea'
import {
  Tooltip,
  TooltipContent,
  TooltipPortal,
  TooltipTrigger,
} from '../ui/tooltip'

export const Sidebar = () => {
  return (
    <>
      <Logo />

      <ScrollArea flex rootClassName="h-0 grow overflow-auto">
        <Repositories />
      </ScrollArea>

      <Footer />
      <SyncingIndicator />
    </>
  )
}

const SyncingIndicator = () => {
  const isSyncingNotifications = useIsSyncingNotifications()
  const syncAt = useNotificationSyncAt()
  const updatedAt = useNotificationUpdatedAt()
  return (
    <>
      {isSyncingNotifications ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <m.div className="flex absolute bottom-2 right-2 cursor-auto select-none items-center gap-1 rounded-full border px-2 py-1 text-xs text-base-content/50">
              <i className="i-mingcute-loading-3-line animate-spin" /> Syncing
            </m.div>
          </TooltipTrigger>
          <TooltipContent>Syncing notifications...</TooltipContent>
        </Tooltip>
      ) : (
        <Tooltip>
          <TooltipTrigger asChild>
            <m.div className="center flex absolute bottom-2 right-2 size-6 cursor-auto select-none rounded-full border text-xs text-base-content/50">
              <i className="i-mingcute-time-duration-line" />
            </m.div>
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
    </>
  )
}

const Logo = () => {
  // TODO: add logo
  return <div className="px-8 py-6 text-lg font-bold">Linear</div>
}

const Repositories = () => {
  const repoList = useRepoList()
  return (
    <ul className="flex flex-col px-4">
      {repoList.map((repo) => (
        <li
          key={repo.id}
          className={cx(
            'flex min-w-0 truncate cursor-button items-center gap-2 overflow-hidden rounded-md py-1 duration-200',
            'hover:bg-zinc-200 dark:hover:bg-neutral-900',
          )}
        >
          <Avatar.Root className="size-5 shrink-0">
            <Avatar.Image
              className="rounded-full"
              src={repo.owner.avatar_url}
            />
            <Avatar.Fallback
              delayMs={100}
              className="center inline-flex rounded-full border text-xs text-base-content/50"
            >
              {repo.owner.login.slice(0, 2)}
            </Avatar.Fallback>
          </Avatar.Root>
          <Tooltip>
            <TooltipPortal>
              <TooltipContent>
                {repo.owner.login}/{repo.name}
              </TooltipContent>
            </TooltipPortal>

            <TooltipTrigger asChild>
              <span className="min-w-0 truncate opacity-90 duration-200 hover:opacity-100">
                {repo.name}
              </span>
            </TooltipTrigger>
          </Tooltip>
        </li>
      ))}
    </ul>
  )
}

const Footer = () => {
  return <div className="px-4 py-2 text-xs text-base-content/50">Footer</div>
}
