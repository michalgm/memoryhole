import dayjs from 'dayjs'
import calendar from 'dayjs/plugin/calendar.js'
import customParseFormat from 'dayjs/plugin/customParseFormat.js'
import localizedFormat from 'dayjs/plugin/localizedFormat.js'
import relativeTime from 'dayjs/plugin/relativeTime.js'
import timezone from 'dayjs/plugin/timezone.js'
import utc from 'dayjs/plugin/utc.js'

dayjs.extend(calendar)
dayjs.extend(customParseFormat)
dayjs.extend(relativeTime)
dayjs.extend(localizedFormat)
dayjs.extend(utc)
dayjs.extend(timezone)

export default dayjs
