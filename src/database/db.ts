import Dexie from 'dexie'
import { exportDB, importDB } from 'dexie-export-import'

import { LOCAL_DB_NAME } from './constants'
import { dbSchemaV1, dbSchemaV2, dbSchemaV3 } from './db_schema'
import type {
  DB_Issue,
  DB_Meta,
  DB_Notification,
  DB_PullRequest,
  DB_Repo,
  DB_RepoPin,
} from './schemas'

export interface LocalDBSchemaMap {
  repos: DB_Repo
  notifications: DB_Notification
  meta: DB_Meta
  issues: DB_Issue
  pullRequests: DB_PullRequest
  repoPin: DB_RepoPin
}

// Define a local DB
class BrowserDB extends Dexie {
  public repos: BrowserDBTable<'repos'>
  public notifications: BrowserDBTable<'notifications'>
  public meta: BrowserDBTable<'meta'>
  public issues: BrowserDBTable<'issues'>
  public pullRequests: BrowserDBTable<'pullRequests'>
  public repoPin: BrowserDBTable<'repoPin'>

  constructor() {
    super(LOCAL_DB_NAME)
    this.version(1).stores(dbSchemaV1)
    this.version(2).stores(dbSchemaV2)
    this.version(3).stores(dbSchemaV3)

    this.repos = this.table('repos')
    this.notifications = this.table('notifications')
    this.meta = this.table('meta')
    this.issues = this.table('issues')
    this.pullRequests = this.table('pullRequests')
    this.repoPin = this.table('repoPin')
  }

  export() {
    return exportDB(this)
  }

  importDb(data: Blob) {
    return importDB(data, this)
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
