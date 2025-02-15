import { Fragment, memo, useCallback, useEffect, useRef } from 'react'

import type { FollowMenuItem } from '~/atoms/context-menu'
import { useContextMenuState } from '~/atoms/context-menu'
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from '~/components/ui/context-menu'
import { RootPortal } from '~/components/ui/portal'
import { cn } from '~/lib/cn'
import { nextFrame, preventDefault } from '~/lib/dom'

export const ContextMenuProvider: Component = ({ children }) => (
  <>
    {children}
    <Handler />
  </>
)

const Handler = () => {
  const ref = useRef<HTMLSpanElement>(null)
  const [contextMenuState, setContextMenuState] = useContextMenuState()

  useEffect(() => {
    if (!contextMenuState.open) return
    const triggerElement = ref.current
    if (!triggerElement) return
    // [ContextMenu] Add ability to control
    // https://github.com/radix-ui/primitives/issues/1307#issuecomment-1689754796
    triggerElement.dispatchEvent(
      new MouseEvent('contextmenu', {
        bubbles: true,
        cancelable: true,
        clientX: contextMenuState.position.x,
        clientY: contextMenuState.position.y,
      }),
    )
  }, [contextMenuState])

  const handleOpenChange = useCallback(
    (state: boolean) => {
      if (state) return
      if (!contextMenuState.open) return
      setContextMenuState({ open: false })
      contextMenuState.abortController.abort()
    },
    [contextMenuState, setContextMenuState],
  )

  return (
    <ContextMenu onOpenChange={handleOpenChange}>
      <ContextMenuTrigger className="hidden" ref={ref} />
      <ContextMenuContent onContextMenu={preventDefault}>
        {contextMenuState.open &&
          contextMenuState.menuItems.map((item, index) => (
            <Item key={index} item={item} />
          ))}
      </ContextMenuContent>
    </ContextMenu>
  )
}

const Item = memo(({ item }: { item: FollowMenuItem }) => {
  const onClick = useCallback(() => {
    if ('click' in item) {
      // Here we need to delay one frame,
      // so it's two raf's, in order to have `point-event: none` recorded by RadixOverlay after modal is invoked in a certain scenario,
      // and the page freezes after modal is turned off.
      nextFrame(() => {
        item.click?.()
      })
    }
  }, [item])
  const itemRef = useRef<HTMLDivElement>(null)

  switch (item.type) {
    case 'separator': {
      return <ContextMenuSeparator />
    }
    case 'text': {
      const Wrapper = item.submenu
        ? ContextMenuSubTrigger
        : typeof item.checked === 'boolean'
          ? ContextMenuCheckboxItem
          : ContextMenuItem

      const Sub = item.submenu ? ContextMenuSub : Fragment

      return (
        <Sub>
          <Wrapper
            ref={itemRef}
            disabled={
              item.disabled || (item.click === undefined && !item.submenu)
            }
            onClick={onClick}
            className="flex items-center gap-2"
            checked={item.checked}
          >
            {!!item.icon && (
              <span className="flex absolute left-2 items-center justify-center">
                {item.icon}
              </span>
            )}
            <span className={cn(item.icon && 'pl-6')}>{item.label}</span>

            <div className="ml-auto pl-4" />
          </Wrapper>
          {item.submenu && (
            <RootPortal>
              <ContextMenuSubContent>
                {item.submenu.map((subItem, index) => (
                  <Item key={index} item={subItem} />
                ))}
              </ContextMenuSubContent>
            </RootPortal>
          )}
        </Sub>
      )
    }
    default: {
      return null
    }
  }
})
