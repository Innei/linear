import type { Transaction } from 'dexie'
import Dexie from 'dexie'

import { LOCAL_DB_NAME } from './constants'
import { dbSchemaV1 } from './db_schema'
import type { DB_Notification, DB_Repo } from './schemas'

export interface LocalDBSchemaMap {
  repos: DB_Repo
  notifications: DB_Notification
}

// Define a local DB
class BrowserDB extends Dexie {
  public repos: BrowserDBTable<'repos'>
  public notifications: BrowserDBTable<'notifications'>
  constructor() {
    super(LOCAL_DB_NAME)
    this.version(1).stores(dbSchemaV1)

    this.repos = this.table('repos')
    this.notifications = this.table('notifications')
  }
}

export const browserDB = new BrowserDB()

// ================================================ //
// ================================================ //
// ================================================ //
// ================================================ //
// ================================================ //

// types helper
export type BrowserDBSchema = {
  [t in keyof LocalDBSchemaMap]: {
    model: LocalDBSchemaMap[t]
    table: Dexie.Table<LocalDBSchemaMap[t], string>
  }
}
export type BrowserDBTable<T extends keyof LocalDBSchemaMap> =
  BrowserDBSchema[T]['table']
