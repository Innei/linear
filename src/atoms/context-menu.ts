import { atom } from 'jotai'
import { useCallback } from 'react'

import { createAtomHooks } from '~/lib/jotai'

// Atom

type ContextMenuState =
  | { open: false }
  | {
      open: true
      position: { x: number; y: number }
      menuItems: FollowMenuItem[]
      // Just for abort callback
      // Also can be optimized by using the `atomWithListeners`
      abortController: AbortController
    }

export const [
  contextMenuAtom,
  useContextMenuState,
  useContextMenuValue,
  useSetContextMenu,
] = createAtomHooks(atom<ContextMenuState>({ open: false }))

const useShowWebContextMenu = () => {
  const setContextMenu = useSetContextMenu()

  const showWebContextMenu = useCallback(
    async (
      menuItems: Array<FollowMenuItem>,
      e: MouseEvent | React.MouseEvent,
    ) => {
      const abortController = new AbortController()
      const resolvers = Promise.withResolvers<void>()
      setContextMenu({
        open: true,
        position: { x: e.clientX, y: e.clientY },
        menuItems,
        abortController,
      })

      abortController.signal.addEventListener('abort', () => {
        resolvers.resolve()
      })
      return resolvers.promise
    },
    [setContextMenu],
  )

  return showWebContextMenu
}

// Menu

export type BaseMenuItemText = {
  type: 'text'
  label: string
  click?: () => void
  /** only work in web app */
  icon?: React.ReactNode
  shortcut?: string
  disabled?: boolean
  checked?: boolean
  supportMultipleSelection?: boolean
}

type BaseMenuItemSeparator = {
  type: 'separator'
  disabled?: boolean
}

type BaseMenuItem = BaseMenuItemText | BaseMenuItemSeparator

export type FollowMenuItem = BaseMenuItem & {
  submenu?: FollowMenuItem[]
}

export type MenuItemInput =
  | (BaseMenuItemText & { hide?: boolean; submenu?: MenuItemInput[] })
  | (BaseMenuItemSeparator & { hide?: boolean })
  | null
  | undefined
  | false
  | ''

function sortShortcutsString(shortcut: string) {
  const order = ['Shift', 'Ctrl', 'Meta', 'Alt']
  const nextShortcut = shortcut

  const arr = nextShortcut.split('+')

  const sortedModifiers = arr
    .filter((key) => order.includes(key))
    .sort((a, b) => order.indexOf(a) - order.indexOf(b))

  const otherKeys = arr.filter((key) => !order.includes(key))

  return [...sortedModifiers, ...otherKeys].join('+')
}

function normalizeMenuItems(items: MenuItemInput[]): FollowMenuItem[] {
  return items
    .filter(
      (item) =>
        item !== null && item !== undefined && item !== false && item !== '',
    )
    .filter((item) => !item.hide)
    .map((item) => {
      if (item.type === 'separator') {
        return item
      }

      return {
        ...item,
        shortcut: item.shortcut
          ? sortShortcutsString(item.shortcut)
          : undefined,
        submenu: item.submenu ? normalizeMenuItems(item.submenu) : undefined,
      }
    })
}

export const useShowContextMenu = () => {
  const showWebContextMenu = useShowWebContextMenu()

  const showContextMenu = useCallback(
    async (
      inputMenu: Array<MenuItemInput>,
      e: MouseEvent | React.MouseEvent,
    ) => {
      const menuItems = normalizeMenuItems(inputMenu)

      await showWebContextMenu(menuItems, e)
    },
    [showWebContextMenu],
  )

  return showContextMenu
}
