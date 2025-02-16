import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu'
import * as React from 'react'

import { cn } from '~/lib/cn'

import { RootPortal } from '../portal'

const DropdownMenu: typeof DropdownMenuPrimitive.Root = (props) => {
  return <DropdownMenuPrimitive.Root {...props} />
}

const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger

const DropdownMenuGroup = DropdownMenuPrimitive.Group

const DropdownMenuPortal = DropdownMenuPrimitive.Portal

const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup

const DropdownMenuContent = ({
  ref,
  className,
  sideOffset = 4,
  ...props
}: React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content> & {
  ref?: React.RefObject<React.ElementRef<
    typeof DropdownMenuPrimitive.Content
  > | null>
}) => {
  return (
    <RootPortal>
      <DropdownMenuPrimitive.Content
        ref={ref}
        sideOffset={sideOffset}
        className={cn(
          'shadow-context-menu z-50 min-w-32 overflow-hidden rounded-md border bg-base-100 p-1 text-base-content',
          'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
          '!outline-none !ring-0',
          className,
        )}
        {...props}
      />
    </RootPortal>
  )
}
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName

const DropdownMenuItem = ({
  ref,
  className,
  inset,
  icon,
  active,
  ...props
}: React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
  inset?: boolean
  icon?: React.ReactNode | ((props?: { isActive?: boolean }) => React.ReactNode)
  active?: boolean
} & {
  ref?: React.RefObject<React.ElementRef<
    typeof DropdownMenuPrimitive.Item
  > | null>
}) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(
      'flex relative cursor-menu select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors',
      'hover:bg-base-200 data-[state=open]:bg-base-200 dark:hover:bg-neutral-700 dark:data-[state=active]:bg-neutral-700',
      'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      'focus-within:!outline-transparent',
      'focus-within:!ring-0',
      inset && 'pl-8',
      className,
    )}
    {...props}
  >
    {!!icon && (
      <span className="mr-1.5 inline-flex size-4 items-center justify-center">
        {typeof icon === 'function' ? icon({ isActive: active }) : icon}
      </span>
    )}
    {props.children}
    {/* Justify Fill */}
    {!!icon && <span className="ml-1.5 size-4" />}
  </DropdownMenuPrimitive.Item>
)
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName

const DropdownMenuCheckboxItem = ({
  ref,
  className,
  children,
  checked,
  ...props
}: React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem> & {
  ref?: React.RefObject<React.ElementRef<
    typeof DropdownMenuPrimitive.CheckboxItem
  > | null>
}) => (
  <DropdownMenuPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      'flex relative cursor-menu select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors',
      'hover:bg-base-200 data-[state=open]:bg-base-200 dark:hover:bg-neutral-700 dark:data-[state=open]:bg-neutral-700',
      'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      className,
    )}
    checked={checked}
    {...props}
  >
    <span className="flex absolute left-2 size-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <i className="i-mingcute-checkbox-line size-4" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.CheckboxItem>
)
DropdownMenuCheckboxItem.displayName =
  DropdownMenuPrimitive.CheckboxItem.displayName

const DropdownMenuLabel = ({
  ref,
  className,
  inset,
  ...props
}: React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & {
  inset?: boolean
} & {
  ref?: React.RefObject<React.ElementRef<
    typeof DropdownMenuPrimitive.Label
  > | null>
}) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    className={cn(
      'px-2 py-1.5 text-sm font-semibold',
      inset && 'pl-8',
      className,
    )}
    {...props}
  />
)
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName

const DropdownMenuSeparator = ({
  ref,
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator> & {
  ref?: React.RefObject<React.ElementRef<
    typeof DropdownMenuPrimitive.Separator
  > | null>
}) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    className={cn('-mx-1 my-1 h-px bg-border', className)}
    {...props}
  />
)
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName

const DropdownMenuShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => (
  <span
    className={cn('ml-auto text-xs tracking-widest opacity-60', className)}
    {...props}
  />
)
DropdownMenuShortcut.displayName = 'DropdownMenuShortcut'

export {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
}
