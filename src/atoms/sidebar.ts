import { atom } from 'jotai'

import { createAtomHooks } from '~/lib/jotai'

const [
  ,
  ,
  internal_useSidebarColumnShow,
  ,
  internal_getSidebarColumnShow,
  setSidebarColumnShow,
] = createAtomHooks(atom(true))

export { setSidebarColumnShow }
export const getSidebarColumnShow = internal_getSidebarColumnShow

export const useSidebarColumnShow = internal_useSidebarColumnShow

export const [
  ,
  ,
  useSidebarColumnTempShow,
  ,
  getSidebarColumnTempShow,
  setSidebarColumnTempShow,
] = createAtomHooks(atom(false))
