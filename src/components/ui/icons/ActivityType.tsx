export const ActivityType = ({ type }: { type: string }) => {
  switch (type) {
    case 'Issue': {
      return <i className="i-mingcute-question-line text-blue-500" />
    }
    case 'PullRequest': {
      return <i className="i-mingcute-git-merge-line text-green-500" />
    }
    case 'Discussion': {
      return <i className="i-mingcute-comment-line text-yellow-500" />
    }
    default: {
      return null
    }
  }
}
