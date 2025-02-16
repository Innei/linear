import type { DB_Issue, DB_Notification } from '~/database'
import { issueService } from '~/database/services/issue'
import { octokit } from '~/lib/octokit'
import { queryClient } from '~/lib/query-client'

import { createZustandStore } from '../utils/helper'
import { AsyncQueue } from '../utils/queue'

interface IssueStoreState {
  issues: Record<string, DB_Issue>
}

export const useIssueStore = createZustandStore<IssueStoreState>('issue')(
  () => ({
    issues: {},
  }),
)

const set = useIssueStore.setState
const get = useIssueStore.getState

class IssueStoreActionStatic {
  upsertMany(data: DB_Issue[]) {
    const current = get().issues
    const newIssues = data.reduce(
      (acc, issue) => {
        acc[issue.id] = issue
        return acc
      },
      {} as Record<string, DB_Issue>,
    )

    set(() => {
      return {
        issues: { ...current, ...newIssues },
      }
    })
  }

  collect(notifications: DB_Notification[]) {
    const tasks = [] as {
      owner: string
      repo: string
      issue_number: number
    }[]

    for (const item of notifications) {
      const { type } = item.subject
      if (type !== 'Issue') continue

      const { url } = item.subject
      const { pathname } = new URL(url)
      const [, , owner, repo, , issue_number] = pathname.split('/')

      tasks.push({
        owner,
        repo,
        issue_number: +issue_number,
      })
    }

    issueRequest.batchFetch(tasks)
  }
}

export const issueAction = new IssueStoreActionStatic()

type FetchIssueParams = { owner: string; repo: string; issue_number: number }
class IssueRequestStatic {
  private q = new AsyncQueue(10)

  batchFetch(data: FetchIssueParams[]) {
    this.q.addMultiple(
      data.map(({ owner, repo, issue_number }) => async () => {
        const res = await queryClient.fetchQuery({
          queryKey: ['issues', owner, repo, issue_number],
          queryFn: () => octokit.rest.issues.get({ owner, repo, issue_number }),
          staleTime: 1000 * 60 * 10,
        })

        issueAction.upsertMany([res.data])
        issueService.upsertMany([res.data])
      }),
    )
  }

  async fetch(params: FetchIssueParams) {
    const res = await octokit.rest.issues.get(params)
    issueAction.upsertMany([res.data])
    issueService.upsertMany([res.data])
    return res.data
  }
}

export const issueRequest = new IssueRequestStatic()
