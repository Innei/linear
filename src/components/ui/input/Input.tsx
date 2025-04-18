import type { DetailedHTMLProps, InputHTMLAttributes } from 'react'

import { useInputComposition } from '~/hooks/common/useInputComposition'
import { clsxm } from '~/lib/cn'

// This composition handler is not perfect
// @see https://foxact.skk.moe/use-composition-input
export const Input = ({
  ref,
  className,
  ...props
}: Omit<
  DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
  'ref'
> & { ref?: React.RefObject<HTMLInputElement | null> }) => {
  const inputProps = useInputComposition(props)
  return (
    <input
      ref={ref}
      className={clsxm(
        'min-w-0 flex-auto appearance-none rounded-lg border ring-accent/20 duration-200 sm:text-sm lg:text-base',
        'bg-base-100 px-3 py-[calc(theme(spacing.2)-1px)] placeholder:text-zinc-400 focus:outline-none focus:ring-2 dark:bg-zinc-700/[0.15]',
        'border-border',
        'focus:!border-accent/80 focus:!bg-accent/5 dark:text-zinc-200 dark:placeholder:text-zinc-500',
        props.type === 'password'
          ? 'font-mono placeholder:font-sans'
          : 'font-sans',
        className,
      )}
      {...props}
      {...inputProps}
    />
  )
}
Input.displayName = 'Input'
