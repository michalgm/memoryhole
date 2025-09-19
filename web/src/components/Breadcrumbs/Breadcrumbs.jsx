import { useLayoutEffect, useMemo } from 'react'

import { NavigateNext } from '@mui/icons-material'
import { Box, Breadcrumbs as MUIBreadcrumbs, Typography } from '@mui/material'
import { pick, startCase } from 'lodash-es'

import {
  routes,
  useLocation,
  useParams,
  useRouteName,
  useRoutePaths,
} from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'

import Link from 'src/components/utils/Link'
import { useApp } from 'src/lib/AppContext'

const paramRegex = /\{([^:}]+)/g

const analyzeRoutes = (paths) => {
  const routeMap = new Map()

  // Parse the routes object to build parent-child relationships
  Object.entries(paths).forEach(([routeName, path]) => {
    try {
      routeMap.set(routeName, {
        name: routeName,
        path,
        label: startCase(routeName),
        // Extract potential parent from path structure
        getParent: () => {
          const segments = path.split('/').filter(Boolean)

          // Try removing segments one by one until we find a match
          for (let i = segments.length - 1; i > 0; i--) {
            const parentPath = '/' + segments.slice(0, i).join('/')

            for (const [name, route] of routeMap.entries()) {
              if (route.path === parentPath) {
                return name
              }
            }
          }

          // Check for root path
          // for (const [name, route] of routeMap.entries()) {
          //   if (route.path === '/') {
          //     return name
          //   }
          // }

          return null
        },
      })
    } catch (e) {
      console.error('Error analyzing routes:', e)
      // Skip routes that require parameters
    }
  })

  return routeMap
}

const Breadcrumbs = ({ title, titleTo }) => {
  const { pathname } = useLocation()
  const routeName = useRouteName()
  const routePaths = useRoutePaths()

  const { pageTitle, currentAction, setPageTitle } = useApp()
  let endCrumb = ''
  const routeParams = useParams()
  const routeMap = useMemo(() => analyzeRoutes(routePaths), [routePaths])
  const params = useParams()

  useLayoutEffect(() => {
    if (params?.id) {
      setPageTitle((prev) => ({ ...prev, [routeName]: 'Loading...' }))
    }
  }, [params?.id, routeName, setPageTitle])

  const crumbs = []
  if (pathname.startsWith('/admin')) {
    crumbs.push(<Link to={routes.admin()}>Admin</Link>)
  }

  if (titleTo) {
    crumbs.push(<Link to={routes[titleTo]()}>{title}</Link>)
  }
  if (endCrumb) {
    crumbs.push(endCrumb)
  }

  const buildBreadcrumbChain = () => {
    const breadcrumbs = []

    const addBreadcrumb = (currentRouteName) => {
      if (!currentRouteName) {
        return
      }

      const route = routeMap.get(currentRouteName)
      if (!route) {
        console.warn('No route found for', currentRouteName)
        return
      }

      // Recursively add parent breadcrumbs
      const parentRouteName = route.getParent()
      if (parentRouteName) {
        addBreadcrumb(parentRouteName)
      }

      const paramMatches = Array.from(route.path.matchAll(paramRegex)).map(
        (match) => match[1]
      )

      // Add current breadcrumb
      let path = route.path

      const label = route.path.match(/\}$/)
        ? pageTitle[currentRouteName] || route.label
        : route.label || currentRouteName

      breadcrumbs.push({
        label,
        path,
        routeName: currentRouteName,
        params: pick(routeParams, paramMatches),
      })
    }

    addBreadcrumb(routeName)
    return breadcrumbs
  }
  const breadcrumbs = buildBreadcrumbChain()

  const metaTitle = [
    ...breadcrumbs.map((b) => b.label),
    ...(currentAction?.id !== -1 ? [currentAction.name] : []),
  ].join(' | ')

  return (
    <>
      <Metadata title={metaTitle} />
      <Box>
        <MUIBreadcrumbs separator={<NavigateNext fontSize="small" />}>
          {breadcrumbs.map((crumb, i) => (
            <Typography
              variant="h5"
              fontWeight={i === breadcrumbs.length - 1 ? 800 : 'inherit'}
              key={i}
            >
              {i === breadcrumbs.length - 1 ? (
                crumb.label
              ) : (
                <Link to={routes[crumb.routeName](crumb.params)}>
                  {crumb.label}
                </Link>
              )}
            </Typography>
          ))}
        </MUIBreadcrumbs>
      </Box>
    </>
  )
}

export default Breadcrumbs
