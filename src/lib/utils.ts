import { memoize } from 'es-toolkit'

export const sleep = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms))

type OS = 'macOS' | 'iOS' | 'Windows' | 'Linux' | 'Android'

export const getOS = memoize((): OS => {
  const { userAgent } = window.navigator,
    macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'],
    windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
    iosPlatforms = ['iPhone', 'iPad', 'iPod']
  const platform =
    // @ts-expect-error
    window.navigator.userAgentData?.platform || window.navigator.platform
  let os = platform

  if (macosPlatforms.includes(platform)) {
    os = 'macOS'
  } else if (iosPlatforms.includes(platform)) {
    os = 'iOS'
  } else if (windowsPlatforms.includes(platform)) {
    os = 'Windows'
  } else if (/Android/.test(userAgent)) {
    os = 'Android'
  } else if (!os && /Linux/.test(platform)) {
    os = 'Linux'
  }

  return os as OS
})
