import * as TabsPrimitive from '@radix-ui/react-tabs'
import { m } from 'framer-motion'
import * as React from 'react'
import type { VariantProps } from 'tailwind-variants'
import { tv } from 'tailwind-variants'

import { clsxm } from '~/lib/cn'

const TabsIdContext = React.createContext<string | null>(null)

const Tabs: typeof TabsPrimitive.Root = React.forwardRef((props, ref) => {
  const { children, ...rest } = props
  const id = React.useId()

  return (
    <TabsIdContext.Provider value={id}>
      <TabsPrimitive.Root {...rest} ref={ref}>
        {children}
      </TabsPrimitive.Root>
    </TabsIdContext.Provider>
  )
})

const tabsListVariants = tv({
  base: '',
  variants: {
    variant: {
      default: 'border-b',
      rounded: 'rounded-md bg-muted p-1',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})
export interface TabsListProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>,
    VariantProps<typeof tabsListVariants> {}
const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  TabsListProps
>(({ className, variant, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={clsxm(
      'text-muted-foreground inline-flex items-center justify-center',
      tabsListVariants({ variant }),
      className,
    )}
    {...props}
  />
))
TabsList.displayName = TabsPrimitive.List.displayName

const tabsTriggerVariants = tv({
  base: '',
  variants: {
    variant: {
      default:
        'py-1.5 border-b-2 border-transparent data-[state=active]:text-accent dark:data-[state=active]:text-theme-accent-500',
      rounded: '!py-1 !px-3 bg-transparent',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

export interface TabsTriggerProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>,
    VariantProps<typeof tabsTriggerVariants> {}
const TabsTrigger = React.forwardRef<HTMLDivElement, TabsTriggerProps>(
  ({ className, variant, children, ...props }, ref) => {
    const triggerRef = React.useRef<HTMLDivElement>(null)
    React.useImperativeHandle(ref, () => triggerRef.current!, [])

    const [isSelect, setIsSelect] = React.useState(false)
    const id = React.useContext(TabsIdContext)
    const layoutId = `tab-selected-underline-${id}`
    React.useLayoutEffect(() => {
      if (!triggerRef.current) return

      const trigger = triggerRef.current as HTMLElement

      const isSelect = trigger.dataset.state === 'active'
      setIsSelect(isSelect)
      const ob = new MutationObserver(() => {
        const isSelect = trigger.dataset.state === 'active'
        setIsSelect(isSelect)
      })
      ob.observe(trigger, {
        attributes: true,
        attributeFilter: ['data-state'],
      })

      return () => {
        ob.disconnect()
      }
    }, [])

    return (
      <TabsPrimitive.Trigger
        ref={triggerRef as any}
        className={clsxm(
          'ring-offset-background data-[state=active]:text-theme-foreground inline-flex items-center justify-center whitespace-nowrap px-3 text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50',
          'group relative z-[1]',
          tabsTriggerVariants({ variant }),
          // !isSelect &&
          //   "hover:before:bg-theme-item-hover before:content-[''] before:pointer-events-none before:absolute before:inset-y-0 before:inset-x-1 before:duration-200 before:opacity-60 before:rounded-lg",
          // className,
        )}
        {...props}
      >
        {children}
        {isSelect && (
          <m.span
            layoutId={layoutId}
            style={{
              originY: '0px',
            }}
            className={clsxm(
              'absolute',
              variant === 'rounded'
                ? 'bg-[var(--header-tab-link-bg)] group-hover:bg-theme-item-hover inset-0 z-[-1] rounded-lg duration-200'
                : '-bottom-1 h-0.5 w-[calc(100%-16px)] rounded bg-accent',
            )}
          />
        )}
      </TabsPrimitive.Trigger>
    )
  },
)
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={clsxm(
      'ring-offset-background mt-2 focus-visible:outline-none',
      className,
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsContent, TabsList, TabsTrigger }
