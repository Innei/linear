import clsx from 'clsx'

export const ActivityType = ({
  type,
  state,
}: {
  type: string
  state?: string
}) => {
  switch (type) {
    case 'Issue': {
      return (
        <i
          className={clsx(
            'i-mingcute-question-line',
            !state && 'text-green-500',
            state === 'open' && 'text-green-500',
          )}
        />
      )
    }
    case 'PullRequest': {
      return (
        <i
          className={clsx(
            'i-mingcute-git-pull-request-line',
            !state && 'text-green-500',
            state === 'open' && 'text-green-500',
            state === 'merged' && 'i-mingcute-git-merge-line text-purple-500',
            state === 'closed' &&
              'i-mingcute-git-pull-request-close-line text-red-500',
          )}
        />
      )
    }
    case 'Discussion': {
      return <i className="i-mingcute-comment-line text-yellow-500" />
    }
    case 'CheckSuite': {
      return <i className="i-mingcute-close-line text-red-500" />
    }
    case 'Release': {
      return <i className="i-mingcute-tag-2-line text-green-500" />
    }
    default: {
      return null
    }
  }
}
