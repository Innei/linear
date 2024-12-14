import * as Avatar from '@radix-ui/react-avatar'
import { useVirtualizer } from '@tanstack/react-virtual'
import clsx from 'clsx'
import { formatDate } from 'date-fns'
import { m } from 'framer-motion'
import { useAtom, useAtomValue } from 'jotai'
import { memo, useMemo } from 'react'
import { Link } from 'react-router'

import { useScrollViewElement } from '~/components/ui/scroll-area/hooks'
import type { DB_Repo } from '~/database'
import { ALL_REPO, useRouteParams, useRouter } from '~/hooks/biz/useRouter'
import { cx } from '~/lib/cn'
import {
  useIsSyncingNotifications,
  useNotificationSyncAt,
  useNotificationUpdatedAt,
} from '~/store/notification/hooks'
import { useRepoList } from '~/store/repo/hooks'

import { ScrollArea } from '../../ui/scroll-area/ScrollArea'
import {
  Tooltip,
  TooltipContent,
  TooltipPortal,
  TooltipTrigger,
} from '../../ui/tooltip'
import { groupItemsAtom } from './atoms'

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
  const { navigate } = useRouter()
  return (
    <button
      onClick={() => {
        navigate({
          repo: ALL_REPO,
        })
      }}
      type="button"
      className="px-8 py-6 text-left text-lg font-bold"
    >
      Linear
    </button>
  )
}

const Repositories = () => {
  const repoList = useRepoList()
  const { repoId } = useRouteParams()
  const groupItems = useAtomValue(groupItemsAtom)

  const finalList = useMemo(() => {
    if (!groupItems) {
      return repoList
    }
    return [...repoList].sort((a, b) =>
      a.owner.login.localeCompare(b.owner.login),
    )
  }, [groupItems, repoList])

  const scrollViewElement = useScrollViewElement()

  const virtualizer = useVirtualizer({
    count: finalList.length,
    getScrollElement: () => scrollViewElement,
    estimateSize: () => 40,
    overscan: 5,
  })

  let prevRenderItem: DB_Repo | null = null

  return (
    <div>
      <div className="flex items-center justify-between px-4 py-2 text-xs text-base-content/50">
        <span>Repositories ({repoList.length})</span>
        <ActionGroup />
      </div>

      <div
        className="flex relative w-full flex-col"
        style={{
          height: `${virtualizer.getTotalSize()}px`,
        }}
      >
        {virtualizer.getVirtualItems().map((virtualRow) => {
          const repo = finalList[virtualRow.index]
          const prevRenderItemRepo = prevRenderItem
          prevRenderItem = repo

          let prevRenderItemOwner = ''
          if (prevRenderItemRepo) {
            prevRenderItemOwner = prevRenderItemRepo.owner.login
          }
          const currentOwner = repo.owner.login
          const isEq = prevRenderItemOwner === currentOwner

          return (
            <div
              className="absolute left-0 top-0 w-full px-4"
              key={virtualRow.key}
              data-index={virtualRow.index}
              ref={virtualizer.measureElement}
              style={{
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              {!isEq && groupItems && (
                <a
                  className="flex mb-1 mt-3 items-center gap-1.5 text-xs text-base-content/50"
                  href={`https://github.com/${repo.owner.login}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <AvatarBase
                    avatarUrl={repo.owner.avatar_url}
                    login={repo.owner.login}
                  />
                  {currentOwner}
                </a>
              )}
              <RepositoryItem
                hideAvatar={groupItems}
                className={groupItems ? 'pl-7' : undefined}
                repo={repo}
                isActive={repoId === repo.id.toString()}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}

const AvatarBase = ({
  avatarUrl,
  login,
}: {
  avatarUrl: string
  login: string
}) => {
  return (
    <Avatar.Root className="inline-block size-5 shrink-0">
      <Avatar.Image className="rounded-full" src={avatarUrl} />
      <Avatar.Fallback
        delayMs={100}
        className="center inline-flex rounded-full border text-xs text-base-content/50"
      >
        {login.slice(0, 2)}
      </Avatar.Fallback>
    </Avatar.Root>
  )
}
const ActionGroup = () => {
  const [groupItems, setGroupItems] = useAtom(groupItemsAtom)
  return (
    <div className="flex items-center gap-1">
      <Tooltip>
        <TooltipTrigger>
          <button
            type="button"
            className={clsx(
              'size-5 rounded duration-200 hover:bg-zinc-200 dark:hover:bg-neutral-900',
              groupItems && 'bg-zinc-200 dark:bg-neutral-900',
              'center',
            )}
            onClick={() => {
              setGroupItems(!groupItems)
            }}
          >
            <i className="i-mingcute-directory-line" />
          </button>
        </TooltipTrigger>
        <TooltipPortal>
          <TooltipContent>
            {!groupItems ? 'Group by owner' : 'Un-group'}
          </TooltipContent>
        </TooltipPortal>
      </Tooltip>
    </div>
  )
}

const RepositoryItem = memo(
  ({
    repo,
    isActive,
    hideAvatar,
    className,
  }: {
    repo: DB_Repo
    isActive: boolean
    hideAvatar: boolean
    className?: string
  }) => {
    return (
      <Link
        key={repo.id}
        to={`/notifications/${repo.id}`}
        className={cx(
          'flex min-w-0 truncate cursor-button items-center gap-2 overflow-hidden rounded-md py-1 duration-200',
          'hover:bg-zinc-200 dark:hover:bg-neutral-900',
          isActive && 'bg-zinc-200 dark:bg-neutral-900',
          className,
        )}
      >
        {!hideAvatar && (
          <AvatarBase
            avatarUrl={repo.owner.avatar_url}
            login={repo.owner.login}
          />
        )}
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
      </Link>
    )
  },
)

const Footer = () => {
  return <div className="px-4 py-2 text-xs text-base-content/50">Footer</div>
}
