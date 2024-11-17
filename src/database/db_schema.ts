import type { BrowserDBTable, LocalDBSchemaMap } from './db'

export const dbSchemaV1: Record<keyof LocalDBSchemaMap, string> = {
  notifications: '&id, updated_at, unread, last_read_at, repositoryId',
  repos: '&id',
  meta: '&name, value',
}
