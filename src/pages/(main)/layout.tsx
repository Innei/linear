import { throttle } from 'es-toolkit'
import type { PropsWithChildren } from 'react'
import * as React from 'react'
import { forwardRef, useCallback, useEffect, useRef, useState } from 'react'
import { useResizable } from 'react-resizable-layout'
import { Outlet } from 'react-router-dom'

import { setRootContainerElement } from '~/atoms/dom'
import {
  getUISettings,
  setUISetting,
  useUISettingKey,
} from '~/atoms/settings/ui'
import {
  getSidebarColumnTempShow,
  setSidebarColumnShow,
  setSidebarColumnTempShow,
  useSidebarColumnShow,
  useSidebarColumnTempShow,
} from '~/atoms/sidebar'
import { PanelSplitter } from '~/components/ui/divider'
import { Kbd } from '~/components/ui/kbd/Kbd'
import { clsxm } from '~/lib/cn'
import { preventDefault } from '~/lib/dom'

export const Component = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  return (
    <RootContainer>
      <SidebarResponsiveResizerContainer containerRef={containerRef}>
        <div
          className={clsxm('relative flex h-full flex-col space-y-3 pt-2.5')}
        >
          1
        </div>
      </SidebarResponsiveResizerContainer>
      <Outlet />
    </RootContainer>
  )
}

const SidebarResponsiveResizerContainer = ({
  containerRef,
  children,
}: {
  containerRef: React.RefObject<HTMLDivElement>
} & PropsWithChildren) => {
  const { isDragging, position, separatorProps, separatorCursor } =
    useResizable({
      axis: 'x',
      min: 256,
      max: 300,
      initial: getUISettings().sidebarColWidth,
      containerRef,

      onResizeEnd({ position }) {
        setUISetting('sidebarColWidth', position)
      },
    })

  const sidebarColumnShow = useSidebarColumnShow()
  const sidebarColumnTempShow = useSidebarColumnTempShow()

  useEffect(() => {
    if (sidebarColumnShow) {
      setSidebarColumnTempShow(false)
      return
    }
    const handler = throttle((e: MouseEvent) => {
      const mouseX = e.clientX
      const mouseY = e.clientY

      const uiSettings = getUISettings()
      const feedColumnTempShow = getSidebarColumnTempShow()

      if (mouseY < 200) return
      const threshold = feedColumnTempShow ? uiSettings.sidebarColWidth : 100

      if (mouseX < threshold) {
        setSidebarColumnTempShow(true)
      } else {
        setSidebarColumnTempShow(false)
      }
    }, 300)

    document.addEventListener('mousemove', handler)
    return () => {
      document.removeEventListener('mousemove', handler)
    }
  }, [sidebarColumnShow])

  const [delayShowSplitter, setDelayShowSplitter] = useState(sidebarColumnShow)

  useEffect(() => {
    let timer: any
    if (sidebarColumnShow) {
      timer = setTimeout(() => {
        setDelayShowSplitter(true)
      }, 200)
    } else {
      setDelayShowSplitter(false)
    }

    return () => {
      timer = clearTimeout(timer)
    }
  }, [sidebarColumnShow])

  return (
    <>
      <div
        data-hide-in-print
        className={clsxm(
          'shrink-0 overflow-hidden bg-sidebar',
          'absolute inset-y-0 z-[2]',
          sidebarColumnTempShow &&
            !sidebarColumnShow &&
            'shadow-drawer-to-right z-[12]',
          !sidebarColumnShow && !sidebarColumnTempShow
            ? '-translate-x-full delay-200'
            : '',
          !isDragging ? 'duration-200' : '',
        )}
        style={{
          width: `${position}px`,
          // @ts-expect-error
          '--app-sidebar-col-w': `${position}px`,
        }}
      >
        {children}
      </div>

      <div
        data-hide-in-print
        className={!isDragging ? 'duration-200' : ''}
        style={{
          width: sidebarColumnShow ? `${position}px` : 0,
          flexShrink: 0,
        }}
      />

      {delayShowSplitter && (
        <PanelSplitter
          isDragging={isDragging}
          cursor={separatorCursor}
          {...separatorProps}
          onDoubleClick={() => {
            setSidebarColumnShow(false)
          }}
          tooltip={
            !isDragging && (
              <>
                <div>
                  <b>Drag</b> to resize
                </div>
                <div className="center">
                  <Kbd className="ml-1">{'['}</Kbd>
                </div>
              </>
            )
          }
        />
      )}
    </>
  )
}

const RootContainer = forwardRef<HTMLDivElement, PropsWithChildren>(
  ({ children }, ref) => {
    const feedColWidth = useUISettingKey('sidebarColWidth')
    const [elementRef, _setElementRef] = useState<HTMLDivElement | null>(null)
    const setElementRef = useCallback((el: HTMLDivElement | null) => {
      _setElementRef(el)
      setRootContainerElement(el)
    }, [])
    React.useImperativeHandle(ref, () => elementRef!)
    return (
      <div
        ref={setElementRef}
        style={
          {
            '--app-sidebar-col-w': `${feedColWidth}px`,
          } as any
        }
        className="flex relative z-0 h-screen overflow-hidden print:h-auto print:overflow-auto"
        onContextMenu={preventDefault}
      >
        {children}
      </div>
    )
  },
)
