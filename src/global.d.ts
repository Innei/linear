declare global {
  export type Component<P = object> = FC<ComponentType & P>

  export type ComponentType<P = object> = {
    className?: string
  } & PropsWithChildren &
    P
  export type Nullable<T> = T | null | undefined

  export const APP_DEV_CWD: string
  export const APP_NAME: string

  /**
   * This function is a macro, will replace in the build stage.
   */
  export function tw(strings: TemplateStringsArray, ...values: any[]): string
}

declare interface ImportMetaEnv {
  VITE_GH_TOKEN: string
}
export {}
