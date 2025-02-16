import * as Avatar from '@radix-ui/react-avatar'

import { cn } from '~/lib/cn'

export const AvatarBase = ({
  avatarUrl,
  login,
  className,
}: {
  avatarUrl: string
  login: string
  className?: string
}) => {
  return (
    <Avatar.Root className={cn('inline-block size-5 shrink-0', className)}>
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
