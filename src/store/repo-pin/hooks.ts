import { getIsRepoPinned } from './getters'
import { useRepoPinStore } from './store'

export const useIsRepoPinned = (repoId: number) => {
  return useRepoPinStore(() => getIsRepoPinned(repoId))
}
