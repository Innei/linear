import { getIsRepoPinned, getPinRepositories } from './getters'
import { useRepoPinStore } from './store'

export const useIsRepoPinned = (repoId: number) => {
  return useRepoPinStore(() => getIsRepoPinned(repoId))
}

export const usePinRepositories = () => {
  return useRepoPinStore(() => getPinRepositories())
}
