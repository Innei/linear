import { useVirtualizer } from '@tanstack/react-virtual'
import clsx from 'clsx'
import { formatDate } from 'date-fns'
import { useAtom, useAtomValue } from 'jotai'
import { m } from 'motion/react'
import { Fragment, memo, useMemo } from 'react'
import { Link } from 'react-router'

import PKG from '~/../package.json'
import { useShowContextMenu } from '~/atoms/context-menu'
import { useUser } from '~/atoms/user'
import { AvatarBase } from '~/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu/DropdownMenu'
import { useScrollViewElement } from '~/components/ui/scroll-area/hooks'
import type { DB_Repo } from '~/database'
import { browserDB } from '~/database'
import { ALL_REPO, useRouteParams, useRouter } from '~/hooks/biz/useRouter'
import { cx } from '~/lib/cn'
import { pluralizeWord } from '~/lib/i18n'
import {
  useIsSyncingNotifications,
  useNotificationSyncAt,
  useNotificationUpdatedAt,
} from '~/store/notification/hooks'
import { getRepoById } from '~/store/repo/getters'
import { useRepoList } from '~/store/repo/hooks'
import { getIsRepoPinned } from '~/store/repo-pin/getters'
import { usePinRepositories } from '~/store/repo-pin/hooks'
import { repoPinAction } from '~/store/repo-pin/store'

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
        <PinRepositories />
        <Repositories />
      </ScrollArea>

      <Footer />
      <SyncingIndicator />
    </>
  )
}

const PinRepositories = () => {
  const pinRepositories = usePinRepositories()

  const routeParams = useRouteParams()
  if (!routeParams.repoId || pinRepositories.length === 0) {
    return null
  }

  return (
    <div className="flex flex-col px-4 py-2 text-xs text-base-content/50">
      <span>
        Pin {pluralizeWord(pinRepositories.length, 'Repository')} (
        {pinRepositories.length})
      </span>

      <div className="flex relative mt-4 w-full flex-col gap-1">
        {pinRepositories.map((repoId) => {
          const repo = getRepoById(repoId)
          if (!repo) return null

          return (
            <div key={repo.id} className="w-full">
              <RepositoryItem
                itemStyle="text-and-avatar"
                className={undefined}
                repo={repo}
                isActive={routeParams.repoId === repo.id.toString()}
              />
            </div>
          )
        })}
      </div>
    </div>
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
  const { navigate } = useRouter()

  const user = useUser()

  return (
    <div className="flex items-center justify-between p-4 text-left text-lg font-bold">
      <a
        className="p-2"
        href="/"
        onClick={(e) => {
          e.preventDefault()
          navigate({
            repo: ALL_REPO,
          })
        }}
      >
        Linear
      </a>

      <DropdownMenu>
        <DropdownMenuTrigger>
          <AvatarBase
            avatarUrl={user?.avatarUrl ?? ''}
            login={user?.login ?? ''}
            className="size-8"
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem className="flex-row gap-2">
            <AvatarBase
              avatarUrl={user?.avatarUrl ?? ''}
              login={user?.login ?? ''}
              className="size-6"
            />
            <div className="flex flex-col">
              <span className="text-sm font-medium text-base-content">
                {user?.name}
              </span>
              <span className="text-xs text-base-content/50">
                @{user?.login}
              </span>
            </div>
          </DropdownMenuItem>

          <DropdownMenuSeparator />
          <DropdownMenuItem
            icon={<i className="i-mingcute-exit-line" />}
            onClick={() => {
              browserDB.clear()
              localStorage.clear()
              window.location.reload()
            }}
          >
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

const Repositories = () => {
  const repoList = useRepoList()
  const { repoId } = useRouteParams()
  const groupItems = useAtomValue(groupItemsAtom)
  const pinRepositories = usePinRepositories()

  const finalList = useMemo(() => {
    const filteredList = repoList.filter(
      (repo) => !pinRepositories.includes(repo.id),
    )
    if (!groupItems) {
      return filteredList
    }

    return [...filteredList].sort((a, b) =>
      a.owner.login.localeCompare(b.owner.login),
    )
  }, [groupItems, pinRepositories, repoList])

  const scrollViewElement = useScrollViewElement()

  const virtualizer = useVirtualizer({
    count: finalList.length,
    getScrollElement: () => scrollViewElement,
    estimateSize: () => 40,
    overscan: 5,
  })

  let prevRenderItem: DB_Repo | null = null

  return (
    <Fragment>
      <div className="flex items-center justify-between px-4 py-2 text-xs text-base-content/50">
        <span>
          {pluralizeWord(repoList.length, 'Repository')} ({repoList.length})
        </span>
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
                  className="flex mb-1 mt-3 items-center gap-2 text-xs text-base-content/50"
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
                itemStyle={groupItems ? 'text-only' : 'text-and-avatar'}
                className={groupItems ? 'pl-7' : undefined}
                repo={repo}
                isActive={repoId === repo.id.toString()}
              />
            </div>
          )
        })}
      </div>
    </Fragment>
  )
}

const ActionGroup = () => {
  const [groupItems, setGroupItems] = useAtom(groupItemsAtom)
  return (
    <div className="flex items-center gap-1">
      <Tooltip>
        <TooltipTrigger asChild>
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

type RepositoryItemStyle = 'text-only' | 'text-and-avatar'
const RepositoryItem = memo(
  ({
    repo,
    isActive,

    itemStyle,
    className,
  }: {
    repo: DB_Repo
    isActive: boolean

    itemStyle: RepositoryItemStyle
    className?: string
  }) => {
    const showContextMenu = useShowContextMenu()
    const hideAvatar = itemStyle === 'text-only'

    return (
      <Link
        onContextMenu={(e) => {
          if (!repo.id) return
          const isPinned = getIsRepoPinned(repo.id)
          showContextMenu(
            [
              {
                label: isPinned ? 'Unpin' : 'Pin',
                type: 'text',

                click: () => {
                  if (!isPinned) {
                    repoPinAction.pinRepo(repo.id)
                  } else {
                    repoPinAction.unPinRepo(repo.id)
                  }
                },
              },
              {
                label: 'Open in browser',
                click: () => {
                  window.open(
                    `https://github.com/${repo.owner.login}/${repo.name}`,
                    '_blank',
                  )
                },
                type: 'text',
              },
            ],
            e,
          )
        }}
        key={repo.id}
        to={`/notifications/${repo.id}`}
        className={cx(
          'flex min-w-0 truncate cursor-button items-center gap-2 overflow-hidden rounded-md py-1 duration-200',
          'hover:bg-zinc-200 dark:hover:bg-neutral-900',
          isActive && 'bg-zinc-200 dark:bg-neutral-900',
          'text-[14px]',
          !hideAvatar && 'pl-1.5',
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
            <span className="min-w-0 truncate text-base-content opacity-90 duration-200 hover:opacity-100">
              {itemStyle === 'text-only'
                ? repo.name
                : `${repo.owner.login}/${repo.name}`}
            </span>
          </TooltipTrigger>
        </Tooltip>
      </Link>
    )
  },
)
const Footer = () => {
  return (
    <div className="px-4 py-2 text-xs text-base-content/50">{PKG.version}</div>
  )
}
