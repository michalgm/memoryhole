import React, { useEffect, useRef, useState } from 'react'

import {
  Box,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  Typography,
} from '@mui/material'
import { Stack } from '@mui/system'

import { useQuery } from '@cedarjs/web'

import RichTextInput from 'src/components/utils/RichTextInput'

const QUERY = gql`
  query EditSiteHelp {
    siteSetting: siteSetting(id: "siteHelp") {
      id
      value
    }
  }
`

const Toc = ({ contentRef, data }) => {
  const [toc, setToc] = useState([])
  useEffect(() => {
    if (contentRef.current) {
      const headings = contentRef.current.querySelectorAll(
        'h1, h2, h3, h4, h5, h6'
      )

      const tocToList = (children) => {
        if (!children || children.length === 0) return null
        const { id: listId, level: listLevel } = children[0]
        return (
          <List key={listId} dense sx={{ py: 0 }}>
            {children.map(({ id, textContent, children }) => (
              <React.Fragment key={id}>
                <ListItemButton
                  key={id}
                  component="a"
                  href={`#${id}`}
                  sx={{ pl: (listLevel - 1) * 2 }}
                  onClick={(e) => {
                    e.preventDefault()
                    document.querySelector(`#${id}`).scrollIntoView({
                      behavior: 'smooth',
                    })
                    window.history.replaceState({}, '', `#${id}`)
                  }}
                >
                  <ListItemText primary={textContent} />
                </ListItemButton>
                {children.length > 0 && tocToList(children)}
              </React.Fragment>
            ))}
          </List>
        )
      }
      const root = { children: [], level: 0, id: 'root', textContent: 'root' }

      let stack = [root]
      Array.from(headings).forEach((heading) => {
        const { textContent, tagName } = heading
        const id = textContent
          .toLowerCase()
          .replace(/[^a-z0-9-\s]/g, '-') // Remove any chars that aren't letters, numbers, hyphens
          .replace(/\s+/g, '-') // Replace spaces with hyphens
          .replace(/-+/g, '-') // Replace multiple consecutive hyphens with single hyphen
          .trim()
        const level = parseInt(tagName[1])
        if (level === 1) {
          return
        }
        const listItem = { id, textContent, level, children: [] }
        heading.id = id
        while (stack.length > 1 && stack[stack.length - 1].level >= level) {
          stack.pop()
        }
        stack[stack.length - 1].children.push(listItem)
        stack.push(listItem)
      })
      const tocData = tocToList(root.children)
      setToc(tocData)
    }
  }, [data, contentRef])
  return toc
}

const DocumentationPage = () => {
  const contentRef = useRef()
  const { data } = useQuery(QUERY)

  if (!data) return null
  const {
    siteSetting: { value },
  } = data

  return (
    <Stack
      direction="row"
      alignItems={'flex-start'}
      spacing={2}
      sx={{ mt: 2, position: 'relative', my: 2 }}
    >
      <Paper
        sx={{
          flex: 1,
          position: 'sticky',
          top: 16,
          minWidth: 200,
          minHeight: '10px',
          pb: 1,
        }}
      >
        <Typography variant="h6" p={2} pb={0}>
          Table of Contents
        </Typography>
        <Toc data={data} contentRef={contentRef} />
      </Paper>
      <Box position={'relative'} sx={{ flex: 3 }}>
        <Paper
          ref={contentRef}
          sx={(theme) => ({
            p: 3,
            ...[1, 2, 3, 4, 5, 6].reduce((acc, l) => {
              acc[`& h${l}`] = {
                ...theme.typography[`h${l}`],
                scrollMarginTop: 4,
                marginBlockStart: l == 1 ? 'inherit' : 'revert !important',
                marginBlockEnd: 'revert !important',
                letterSpacing: 'revert !important',
                lineHeight: 'revert !important',
                fontWeight: 'revert !important',
                fontSize: 'revert !important',
              }
              return acc
            }, {}),
          })}
        >
          <RichTextInput content={value} editable={false} />
        </Paper>
      </Box>
    </Stack>
  )
}

export default DocumentationPage
