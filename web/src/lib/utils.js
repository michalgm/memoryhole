import { Person } from '@mui/icons-material'
import { Chip, Tooltip, Typography } from '@mui/material'
import { Box } from '@mui/system'
import dayjs from 'dayjs'
import { renderToStaticMarkup } from 'react-dom/server'

export const asyncDebounce = (fn, wait) => {
  let pending = null
  return (...args) => {
    if (!pending) {
      pending = new Promise((resolve) => {
        setTimeout(async () => {
          const result = await fn(...args)
          pending = null
          resolve(result)
        }, wait)
      })
    }
    return pending
  }
}

export const convertSvgToDataUrl = (Icon, color = 'white') => {
  return `url('data:image/svg+xml,${renderToStaticMarkup(
    <Icon style={{ fill: color }} />
  ).replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" ')}')`
}

export const displayItemProps = ({ item = {}, type = 'arrest' }) => {
  let title = ''
  let subtitle = ''
  let icon = ''

  if (type === 'arrest') {
    const { date, arrest_city } = item || {}
    title = item?.arrestee?.search_display_field || 'Unknown'
    const separator = date && arrest_city ? ' | ' : ''
    subtitle = `${date ? dayjs(date).format('L') : ''}${separator}${arrest_city ? arrest_city : ''}`
    icon = <Person />
  }

  return { title, subtitle, icon }
}

export const displayItem = ({
  item = {},
  type = 'arrest',
  showIcon = true,
  titleProps = {},
  subtitleProps = {},
  ...props
}) => {
  const { title, subtitle, icon } = displayItemProps({ item, type })
  return (
    <Tooltip title={subtitle} {...subtitleProps}>
      <Chip
        {...props}
        size="small"
        component={'span'}
        icon={showIcon && icon ? icon : null}
        label={
          <Box component="span">
            <Typography
              component="span"
              variant="body2"
              sx={{ fontWeight: 'medium' }}
              {...titleProps}
            >
              {title}
            </Typography>
          </Box>
        }
      />
    </Tooltip>
  )
}
