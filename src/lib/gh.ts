import type { DB_Notification, DB_Repo } from '~/database'

// @see https://github.com/raycast/extensions/blob/23735edc3350276a33bf48dd717f335128bfc2ee/extensions/github/src/helpers/notifications.ts#L17
function generateNotificationReferrerId(
  notificationId: string,
  userId: string,
) {
  const text = `018:NotificationThread${notificationId}:${userId}`
  const encoder = new TextEncoder()
  const bytes = encoder.encode(text)
  // eslint-disable-next-line unicorn/prefer-code-point
  return `notification_referrer_id=${btoa(String.fromCharCode(...bytes))}`
}

export function generateGitHubUrl(
  url: string,
  notificationId: string,
  userId?: string,
  comment = '',
) {
  let newUrl: string = url.replace('api.github.com/repos', 'github.com')

  if (newUrl.includes('/pulls/')) {
    newUrl = newUrl.replace('/pulls/', '/pull/')
  }

  if (newUrl.includes('/releases/')) {
    newUrl = newUrl.replace('/repos', '')
    newUrl = newUrl.slice(0, Math.max(0, newUrl.lastIndexOf('/')))
  }

  if (userId) {
    const notificationReferrerId = generateNotificationReferrerId(
      notificationId,
      userId,
    )

    return `${newUrl}?${notificationReferrerId}${comment}`
  }

  return newUrl
}

const getCommentId = (url?: string) =>
  url ? /comments\/(?<id>\d+)/.exec(url)?.groups?.id : undefined

export function getGitHubURL(
  notification: DB_Notification,
  repository: DB_Repo,
  userId?: string,
) {
  if (notification.subject.url) {
    const latestCommentId = getCommentId(
      notification.subject.latest_comment_url,
    )
    return generateGitHubUrl(
      notification.subject.url,
      notification.id,
      userId,
      latestCommentId ? `#issuecomment-${latestCommentId}` : undefined,
    )
  } else if (notification.subject.type === 'CheckSuite') {
    return generateGitHubUrl(
      `${repository.html_url}/actions`,
      notification.id,
      userId,
    )
  } else if (notification.subject.type === 'Discussion') {
    // Get the discussion number via GraphQL
    // See: https://github.com/orgs/community/discussions/62728#discussioncomment-9034908
    const discussionNumber: number | null = null
    try {
      //TODO
      // discussionNumber = await getGitHubDiscussionNumber(notification)
    } catch (error) {
      console.error('Failed to get discussion number', error)
    }

    return generateGitHubUrl(
      `${repository.html_url}/discussions/${discussionNumber ?? ''}`,
      notification.id,
      userId,
    )
  }

  return notification.url
}

// export async function getGitHubDiscussionNumber(notification: Notification) {
//   const { github } = getGitHubClient();
//   const repo = notification.repository.full_name;
//   const updated = notification.updated_at.split("T")[0];
//   const title = notification.subject.title;

//   const result = await github.getGitHubDiscussionNumber({
//     filter: `repo:${repo} updated:>=${updated} in:title ${title}`,
//   });

//   const data = result?.search?.nodes?.[0] as Discussion | null;

//   return data?.number ?? null;
// }
