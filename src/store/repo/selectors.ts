import { createSelectorHelper } from '../utils/helper'
import type { useRepoStore } from './store'

type StoreState = ReturnType<typeof useRepoStore.getState>

const defineSelector = createSelectorHelper<StoreState>()

export const selectRepo = (id: number) =>
  defineSelector((state) => state.repos[id])
