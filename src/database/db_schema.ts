import type { LocalDBSchemaMap } from './db'

type SchemaType = Partial<Record<keyof LocalDBSchemaMap, string>>
export const dbSchemaV1: SchemaType = {
  notifications: '&id, updated_at, unread, last_read_at, repositoryId',
  repos: '&id',
  meta: '&name, value',
}

export const dbSchemaV2: SchemaType = {
  issues: '&id',
  pullRequests: '&id',
}
