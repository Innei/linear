
import { createSettingAtom } from '../helper/setting'

export interface UISettings {
  // Sidebar
  sidebarColWidth: number
}

export const createDefaultSettings = (): UISettings => ({
  sidebarColWidth: 256,
})

export const {
  useSettingKey: useUISettingKey,
  useSettingSelector: useUISettingSelector,
  useSettingKeys: useUISettingKeys,
  setSetting: setUISetting,
  clearSettings: clearUISettings,
  initializeDefaultSettings: initializeDefaultUISettings,
  getSettings: getUISettings,
  useSettingValue: useUISettingValue,
  settingAtom: __uiSettingAtom,
} = createSettingAtom('ui', createDefaultSettings)

export const uiServerSyncWhiteListKeys: (keyof UISettings)[] = []
