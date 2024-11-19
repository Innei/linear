import type { Hydratable } from '~/database/services/base'
import { MetaService } from '~/database/services/meta'
import { NotificationService } from '~/database/services/notification'
import { RepoService } from '~/database/services/repo'
import { appLog } from '~/lib/log'
import { sleep } from '~/lib/utils'

declare global {
  interface Window {
    __dbIsReady: boolean
  }
}
export const setHydrated = (v: boolean) => {
  window.__dbIsReady = v
}

export const hydrateDatabaseToStore = async () => {
  async function hydrate() {
    const now = Date.now()

    const hydrates: Hydratable[] = [
      NotificationService,
      RepoService,
      MetaService,
    ]
    await Promise.all(hydrates.map((h) => h.hydrate()))

    window.__dbIsReady = true
    const costTime = Date.now() - now

    return costTime
  }
  return Promise.race([hydrate(), sleep(1000).then(() => 'timeout')]).then(
    (result) => {
      if (result === 'timeout') {
        appLog('Hydrate data timeout')
      }
      return result
    },
  )
}
