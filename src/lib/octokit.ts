import { Octokit } from 'octokit'

import { getGHToken } from '~/atoms/app'

// const fetch = createFetch({
//   defaults: {
//     onResponseError: (error) => {
//       if (error.response.status === 401) {
//         clearGHToken()
//         window.location.reload()
//       }
//     },
//   },
// })
export const octokit = new Octokit({
  auth: getGHToken(),
  request: {
    // fetch: fetch.raw,
  },
})
