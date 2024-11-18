import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInSeconds,
  format,
  formatDistance,
} from 'date-fns'
import type { FC } from 'react'
import { useEffect, useRef, useState } from 'react'

import { stopPropagation } from '~/lib/dom'

import {
  Tooltip,
  TooltipContent,
  TooltipPortal,
  TooltipTrigger,
} from '../tooltip'

const formatTemplateString = 'MMM d, yyyy h:mm a'

const formatTime = (
  date: string | Date,
  relativeBeforeDay?: number,
  template = formatTemplateString,
) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date

  if (
    relativeBeforeDay &&
    Math.abs(differenceInDays(dateObj, new Date())) > relativeBeforeDay
  ) {
    return format(dateObj, template)
  }
  return formatDistance(dateObj, new Date(), { addSuffix: false })
}

const getUpdateInterval = (date: string | Date, relativeBeforeDay?: number) => {
  if (!relativeBeforeDay) return null
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const diffInSeconds = Math.abs(differenceInSeconds(dateObj, new Date()))
  if (diffInSeconds <= 60) {
    return 1000 // Update every second
  }
  const diffInMinutes = Math.abs(differenceInMinutes(dateObj, new Date()))
  if (diffInMinutes <= 60) {
    return 60000 // Update every minute
  }
  const diffInHours = Math.abs(differenceInHours(dateObj, new Date()))
  if (diffInHours <= 24) {
    return 3600000 // Update every hour
  }
  const diffInDays = Math.abs(differenceInDays(dateObj, new Date()))
  if (diffInDays <= relativeBeforeDay) {
    return 86400000 // Update every day
  }
  return null // No need to update
}

export const RelativeTime: FC<{
  date: string | Date
  displayAbsoluteTimeAfterDay?: number
  dateFormatTemplate?: string
}> = (props) => {
  const {
    displayAbsoluteTimeAfterDay = 29,
    dateFormatTemplate = formatTemplateString,
  } = props
  const [relative, setRelative] = useState<string>(() =>
    formatTime(props.date, displayAbsoluteTimeAfterDay, dateFormatTemplate),
  )

  const timerRef = useRef<any>(null)

  useEffect(() => {
    const updateRelativeTime = () => {
      setRelative(
        formatTime(props.date, displayAbsoluteTimeAfterDay, dateFormatTemplate),
      )
      const updateInterval = getUpdateInterval(
        props.date,
        displayAbsoluteTimeAfterDay,
      )

      if (updateInterval !== null) {
        timerRef.current = setTimeout(updateRelativeTime, updateInterval)
      }
    }

    updateRelativeTime()

    return () => {
      clearTimeout(timerRef.current)
    }
  }, [props.date, displayAbsoluteTimeAfterDay, dateFormatTemplate])
  const formated = format(props.date, dateFormatTemplate)

  if (formated === relative) {
    return <>{relative}</>
  }
  return (
    <Tooltip>
      {/* https://github.com/radix-ui/primitives/issues/2248#issuecomment-2147056904 */}
      <TooltipTrigger onFocusCapture={stopPropagation}>
        {relative} ago
      </TooltipTrigger>

      <TooltipPortal>
        <TooltipContent>{formated}</TooltipContent>
      </TooltipPortal>
    </Tooltip>
  )
}
