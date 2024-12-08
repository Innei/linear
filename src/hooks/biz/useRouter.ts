import { useCallback } from 'react'

import {
  getReadonlyRoute,
  getStableRouterNavigate,
  useReadonlyRouteSelector,
} from '~/atoms/route'

const ALL_REPO = 'all'
export type NotificationType = 'all' | 'unread'
export const useRouteParams = () => {
  const search = useReadonlyRouteSelector((state) => {
    return {
      type: state.searchParams.get('type') as NotificationType,
    }
  })
  const params = useReadonlyRouteSelector((state) => {
    return { repo: state.params.repo || ALL_REPO }
  })
  return { ...search, ...params }
}

const routerParamsKey = ['repo']
const routerSearchParamsKey = ['type']

type RouterParams = {
  repo?: string
}
// type RouterSearchParams = {
//   type?: NotificationType
// }
export const useRouter = () => {
  return {
    navigate: useCallback(
      (params: { type?: NotificationType; repo?: string }) => {
        const currentRouter = getReadonlyRoute()

        const filteredParams = routerParamsKey
          .filter((key) => params[key])
          .reduce(
            (acc, key) => {
              acc[key] = params[key]
              return acc
            },
            {} as Record<string, string>,
          )

        const nextParams = {
          ...currentRouter.params,
          ...filteredParams,
        } as RouterParams
        const filteredSearchParams = routerSearchParamsKey.filter(
          (key) => params[key],
        )

        const nextSearchParams = new URLSearchParams(currentRouter.searchParams)
        filteredSearchParams.forEach((key) => {
          if (params[key] === undefined) {
            nextSearchParams.delete(key)
          } else {
            nextSearchParams.set(key, params[key])
          }
        })

        const finalPath = `/notifications/${nextParams.repo || ALL_REPO}?${nextSearchParams.toString()}`
        const currentPath =
          currentRouter.location.pathname +
          currentRouter.searchParams.toString()
        if (finalPath === currentPath) return
        getStableRouterNavigate()?.(finalPath)
      },
      [],
    ),
  }
}
