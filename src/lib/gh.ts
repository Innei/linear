export const resolveHtmlUrl = (
  type: string,
  htmlUrl: string,
  subjectUrl: string,
) => {
  switch (type) {
    case 'PullRequest': {
      return `${htmlUrl}/pull/${subjectUrl.split('/').pop()}`
    }

    case 'Issue': {
      return `${htmlUrl}/issues/${subjectUrl.split('/').pop()}`
    }

    case 'Commit': {
      return `${htmlUrl}/commit/${subjectUrl.split('/').pop()}`
    }

    case 'Release': {
      return `${htmlUrl}/releases/tag/${subjectUrl.split('/').pop()}`
    }
    default: {
      break
    }
  }
}
