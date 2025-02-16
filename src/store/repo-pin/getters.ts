import { useRepoPinStore } from './store'

export const getIsRepoPinned = (repoId: number) => {
  const state = useRepoPinStore.getState()
  return state.order.includes(repoId)
}

export const getPinRepositories = () => {
  const state = useRepoPinStore.getState()
  return state.order
}
