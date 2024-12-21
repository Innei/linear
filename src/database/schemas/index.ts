import type { components } from '@octokit/openapi-types'

export * from './base'

export type DB_PullRequest = components['schemas']['pull-request']
export type DB_Repo = components['schemas']['minimal-repository']
export type DB_Issue = components['schemas']['issue']

export type DB_Notification = Omit<
  components['schemas']['thread'],
  'repository'
> & {
  repositoryId: DB_Repo['id']
}

export type DB_Meta = {
  name: string
  value: any
}
