import { createSelectorHelper } from '../utils/helper'
import type { useNotificationStore } from './store'

type StoreState = ReturnType<typeof useNotificationStore.getState>

const defineSelector = createSelectorHelper<StoreState>()

export const selectNotificationLength = defineSelector(
  (state) => Object.keys(state.notifications).length,
)
