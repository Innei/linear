export const appLog = (...args: any[]) => {
  console.info(
    `%c ${APP_NAME} %c`,
    'color: #fff; margin: 0; padding: 5px 0; background: #090909; border-radius: 3px;',
    ...args.reduce((acc, cur) => {
      acc.push('', cur)
      return acc
    }, []),
  )
}
