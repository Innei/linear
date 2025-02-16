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

export const dbSchemaV3: SchemaType = {
  repoPin: '&id, createdAt, order',
}

export const dbSchemaV4: SchemaType = {
  user: '&id',
}

export const dbSchemaV5: SchemaType = {
  user: '&id, login, isMe',
}
