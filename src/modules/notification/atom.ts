import { atom } from 'jotai'

import { createAtomHooks } from '~/lib/jotai'

export type SelectedIssue = {
  type: 'issue'
  owner: string
  repo: string
  issue_number: number
}
export type SelectedPullRequest = {
  type: 'pull_request'
  owner: string
  repo: string
  pull_request_number: number
}
export type SelectedNotification = SelectedIssue | SelectedPullRequest

export const [, , useSelectedNotification, , , setSelectedNotification] =
  createAtomHooks(atom<SelectedNotification | null>(null))
