import * as ContextMenuPrimitive from '@radix-ui/react-context-menu'
import * as React from 'react'

import { cn } from '~/lib/cn'

import { RootPortal } from '../portal'

const ContextMenu = ContextMenuPrimitive.Root

const ContextMenuTrigger = ContextMenuPrimitive.Trigger

const ContextMenuGroup = ContextMenuPrimitive.Group

const ContextMenuSub = ContextMenuPrimitive.Sub

const ContextMenuRadioGroup = ContextMenuPrimitive.RadioGroup

const ContextMenuSubTrigger = ({
  ref,
  className,
  inset,
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.SubTrigger> & {
  inset?: boolean
} & {
  ref?: React.RefObject<React.ElementRef<
    typeof ContextMenuPrimitive.SubTrigger
  > | null>
}) => (
  <ContextMenuPrimitive.SubTrigger
    ref={ref}
    className={cn(
      'flex cursor-menu select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-neutral/40 focus:text-base-content data-[state=open]:bg-neutral/40 data-[state=open]:text-base-content',
      inset && 'pl-8',
      'center gap-2',
      className,
      props.disabled && 'cursor-not-allowed opacity-30',
    )}
    {...props}
  >
    {children}
    <i className="i-mingcute-right-line -mr-1 ml-auto size-3.5" />
  </ContextMenuPrimitive.SubTrigger>
)
ContextMenuSubTrigger.displayName = ContextMenuPrimitive.SubTrigger.displayName

const ContextMenuSubContent = ({
  ref,
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.SubContent> & {
  ref?: React.RefObject<React.ElementRef<
    typeof ContextMenuPrimitive.SubContent
  > | null>
}) => (
  <RootPortal>
    <ContextMenuPrimitive.SubContent
      ref={ref}
      className={cn(
        'min-w-32 overflow-hidden rounded-md border bg-base-100 p-1 text-base-content/90 shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 dark:shadow-zinc-800/60',
        'z-[61]',
        className,
      )}
      {...props}
    />
  </RootPortal>
)
ContextMenuSubContent.displayName = ContextMenuPrimitive.SubContent.displayName

const ContextMenuContent = ({
  ref,
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Content> & {
  ref?: React.RefObject<React.ElementRef<
    typeof ContextMenuPrimitive.Content
  > | null>
}) => (
  <RootPortal>
    <ContextMenuPrimitive.Content
      ref={ref}
      className={cn(
        'z-[60] min-w-32 overflow-hidden rounded-md border border-border bg-base-100 p-1 text-base-content/90 shadow-lg dark:shadow-zinc-800/60',
        'text-xs motion-scale-in-75 motion-duration-150 lg:animate-none',
        className,
      )}
      {...props}
    />
  </RootPortal>
)
ContextMenuContent.displayName = ContextMenuPrimitive.Content.displayName

const ContextMenuItem = ({
  ref,
  className,
  inset,
  ...props
}: React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Item> & {
  inset?: boolean
} & {
  ref?: React.RefObject<React.ElementRef<
    typeof ContextMenuPrimitive.Item
  > | null>
}) => (
  <ContextMenuPrimitive.Item
    ref={ref}
    className={cn(
      'flex relative cursor-menu select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-neutral/40 focus:text-base-content data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      'focus-within:outline-transparent data-[highlighted]:bg-neutral/40 dark:data-[highlighted]:bg-neutral-800',
      inset && 'pl-8',
      className,
    )}
    {...props}
  />
)
ContextMenuItem.displayName = ContextMenuPrimitive.Item.displayName

const ContextMenuCheckboxItem = ({
  ref,
  className,
  children,
  checked,
  ...props
}: React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.CheckboxItem> & {
  ref?: React.RefObject<React.ElementRef<
    typeof ContextMenuPrimitive.CheckboxItem
  > | null>
}) => (
  <ContextMenuPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      'flex relative cursor-checkbox select-none items-center rounded-sm px-8 py-1.5 text-sm outline-none focus:bg-neutral/40 focus:text-base-content data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      'focus-within:outline-transparent',
      className,
    )}
    checked={checked}
    {...props}
  >
    <span className="flex absolute left-2 items-center justify-center">
      <ContextMenuPrimitive.ItemIndicator asChild>
        <i className="i-mingcute-check-fill size-3" />
      </ContextMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </ContextMenuPrimitive.CheckboxItem>
)
ContextMenuCheckboxItem.displayName =
  ContextMenuPrimitive.CheckboxItem.displayName

const ContextMenuLabel = ({
  ref,
  className,
  inset,
  ...props
}: React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Label> & {
  inset?: boolean
} & {
  ref?: React.RefObject<React.ElementRef<
    typeof ContextMenuPrimitive.Label
  > | null>
}) => (
  <ContextMenuPrimitive.Label
    ref={ref}
    className={cn(
      'px-2 py-1.5 text-sm font-semibold text-base-content',
      inset && 'pl-8',
      className,
    )}
    {...props}
  />
)
ContextMenuLabel.displayName = ContextMenuPrimitive.Label.displayName

const ContextMenuSeparator = ({
  ref,
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Separator> & {
  ref?: React.RefObject<React.ElementRef<
    typeof ContextMenuPrimitive.Separator
  > | null>
}) => (
  <ContextMenuPrimitive.Separator
    ref={ref}
    className={cn('-mx-1 my-1 h-px scale-x-90 bg-border', className)}
    {...props}
  />
)
ContextMenuSeparator.displayName = ContextMenuPrimitive.Separator.displayName

export {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
}
