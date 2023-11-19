import dayjs from 'dayjs'
import calendar from 'dayjs/plugin/calendar'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import relativeTime from 'dayjs/plugin/relativeTime'
import utc from 'dayjs/plugin/utc'

dayjs.extend(calendar)
dayjs.extend(customParseFormat)
dayjs.extend(relativeTime)
dayjs.extend(localizedFormat)
dayjs.extend(utc)

export default dayjs
