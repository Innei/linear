if (import.meta.env.DEV) {
  import('react-scan').then(({ scan }) => scan({}))
}
