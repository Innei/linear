import { useRouteParams } from '~/hooks/biz/useRouter'
import { NotificationList } from '~/modules/notification/list'

export const Component = () => {
  const { repoId } = useRouteParams()
  return <NotificationList repoId={repoId} />
}
