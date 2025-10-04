import { useEffect, useMemo, useRef, useState } from 'react'

// import { useApolloClient } from '@apollo/client'
import { HocuspocusProvider } from '@hocuspocus/provider'
import { Toc } from '@mui/icons-material'
import {
  Avatar,
  Box,
  FormHelperText,
  Grid2,
  Tooltip,
  Typography,
} from '@mui/material'
import AvatarGroup from '@mui/material/AvatarGroup'
import { Stack } from '@mui/system'
import Collaboration from '@tiptap/extension-collaboration'
import CollaborationCaret from '@tiptap/extension-collaboration-caret'
// import Emoji, { gitHubEmojis } from '@tiptap/extension-emoji'
// import Mention from '@tiptap/extension-mention'
import Highlight from '@tiptap/extension-highlight'
import { TaskItem, TaskList } from '@tiptap/extension-list'
import {
  getHierarchicalIndexes,
  TableOfContents,
} from '@tiptap/extension-table-of-contents'
import TextAlign from '@tiptap/extension-text-align'
import StarterKit from '@tiptap/starter-kit'
import { merge } from 'lodash-es'
import {
  LinkBubbleMenu,
  LinkBubbleMenuHandler,
  MenuButton,
  MenuButtonBlockquote,
  MenuButtonBold,
  MenuButtonBulletedList,
  MenuButtonEditLink,
  MenuButtonHighlightColor,
  MenuButtonHighlightToggle,
  MenuButtonHorizontalRule,
  MenuButtonIndent,
  MenuButtonItalic,
  MenuButtonOrderedList,
  MenuButtonRedo,
  MenuButtonStrikethrough,
  MenuButtonTaskList,
  MenuButtonUnderline,
  MenuButtonUndo,
  MenuButtonUnindent,
  MenuControlsContainer,
  MenuDivider,
  MenuSelectHeading,
  MenuSelectTextAlign,
  RichTextEditor,
  slugify,
} from 'mui-tiptap'
import * as Y from 'yjs'

import { useAuth } from 'src/auth'
// import { createMentionSuggestionOptions } from 'src/components/CollabEditor/mentionSuggestionOptions'
import Show from 'src/components/utils/Show.jsx'

// import suggestion from './suggestion.jsx'
// import suggestions from './suggestions.jsx'
import { ToC } from './ToC.jsx'

const generateUserColor = (userId, email) => {
  const colors = [
    '#FF6B6B',
    '#4ECDC4',
    '#45B7D1',
    '#96CEB4',
    '#FECA57',
    '#FF9FF3',
    '#54A0FF',
    '#5F27CD',
    '#00D2D3',
    '#FF9F43',
    '#74B9FF',
    '#A29BFE',
    '#6C5CE7',
    '#FD79A8',
    '#00B894',
  ]

  const hash = (userId?.toString() || email || '').split('').reduce((a, b) => {
    a = (a << 5) - a + b.charCodeAt(0)
    return a & a
  }, 0)

  return colors[Math.abs(hash) % colors.length]
}

const ConnectedUsersDisplay = ({ users }) => {
  const sx = {
    width: 26,
    height: 26,
    fontSize: '1.1rem',
  }
  return (
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', flexGrow: 1 }}>
      <AvatarGroup
        max={2}
        slotProps={{
          surplus: { sx },
        }}
      >
        {users.map((user, idx) => (
          <Tooltip key={idx} title={user.name} arrow placement="top">
            <Avatar
              alt={user.name}
              key={idx}
              // size="large"
              sx={{ bgcolor: user.color, ...sx }}
            >
              {user.name ? user.name[0] : '?'}
            </Avatar>
          </Tooltip>
        ))}
      </AvatarGroup>
    </Box>
  )
}

const DEFAULT_SERVER_URL =
  process.env.NODE_ENV === 'production'
    ? `${window.location.origin.replace(/^http/, 'ws')}/collab`
    : 'ws://localhost:1234'

const MemorizedToC = React.memo(ToC)

const CollabEditor = (props) => {
  // const apolloClient = useApolloClient()
  const {
    type = 'document',
    title,
    content = '',
    onChange,
    editable = true,
    disabled = false,
    error,
    helperText,
    color,
    focus = false,
    sx = {},
    serverUrl = DEFAULT_SERVER_URL,
    onConnect,
    onDisconnect,
    onSynced,
    onAuthFailed,
    textFieldProps = {},
    // Additional collaboration options
    enablePresence = true, // Show other users' cursors
    enableHistory = true, // Enable collaborative history
  } = props

  const { currentUser } = useAuth()
  const rteRef = useRef(null)
  const [isConnected, setIsConnected] = useState(false)
  const [isSynced, setIsSynced] = useState(false)
  const [connectionError, setConnectionError] = useState(null)
  const [connectedUsers, setConnectedUsers] = useState([])
  const [tocItems, setTocItems] = useState([])
  const [showTOC, setShowTOC] = useState(true)

  let documentName = props.documentName
  if (!documentName && title && type) {
    documentName = `${type}:${slugify(title)}`
  }

  // Label width calculation (reused from RichTextInput)

  // Create Yjs document and provider with authentication
  const ydoc = useMemo(() => new Y.Doc(), [])
  // Debug: Monitor Yjs document changes
  useEffect(() => {
    if (!ydoc) return

    const handleUpdate = () => {
      // Also check what fragments exist after each update
      const fragments = []
      ydoc.share.forEach((value, key) => {
        fragments.push({
          key,
          type: value.constructor.name,
          length: value.length || 'N/A',
        })
      })
    }

    ydoc.on('update', handleUpdate)

    return () => {
      ydoc.off('update', handleUpdate)
    }
  }, [ydoc, documentName])

  const provider = useMemo(() => {
    if (!documentName) return null

    const providerInstance = new HocuspocusProvider({
      url: `${serverUrl}?title=${encodeURIComponent(title || documentName)}`,
      name: documentName,
      document: ydoc,
      // token, // JWT token for authentication

      onConnect: () => {
        setIsConnected(true)
        setConnectionError(null)
        onConnect?.()
      },

      onDisconnect: () => {
        setIsConnected(false)
        onDisconnect?.()
      },

      onSynced: () => {
        // Check if document has content after sync
        // Also check what fragments exist
        const allFragments = []
        ydoc.share.forEach((value, key) => {
          allFragments.push({ key, type: value.constructor.name })
        })

        setIsSynced(true)
        onSynced?.()
      },

      onAuthenticationFailed: (data) => {
        const errorMessage = data.reason || 'Authentication failed'
        setConnectionError(errorMessage)
        onAuthFailed?.(errorMessage)
      },

      // Monitor document changes
    })

    return providerInstance
  }, [
    documentName,
    onAuthFailed,
    onConnect,
    onDisconnect,
    onSynced,
    serverUrl,
    ydoc,
    title,
  ])

  useEffect(() => {
    if (isSynced) {
      const anchorId = window.location.hash?.replace('#', '')
      if (anchorId) {
        // Use a small delay to ensure DOM is updated
        requestAnimationFrame(() => {
          const el = document.getElementById(anchorId)
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' })
          }
        })
      }
    }
  }, [isSynced])

  // Clean up provider on unmount
  useEffect(() => {
    const updateUsers = () => {
      const states = Array.from(provider.awareness.getStates().values())
      setConnectedUsers(states.map((s) => s.user).filter(Boolean))
    }
    provider.awareness.on('update', updateUsers)
    updateUsers()
    return () => {
      if (provider) {
        provider.destroy()
      }
    }
  }, [provider])

  const userInfo = useMemo(() => {
    if (!currentUser) {
      return { name: 'Anonymous', color: '#999999' }
    }

    return {
      name: currentUser.name || currentUser.email || `User ${currentUser.id}`,
      color: generateUserColor(currentUser.id, currentUser.email),
    }
  }, [currentUser])

  useEffect(() => {
    if (!rteRef.current?.editor) return

    const editor = rteRef.current.editor

    const updateToc = () => {
      const tocContent = editor.storage.tableOfContents?.content || []
      setTocItems(tocContent)
    }

    editor.on('update', updateToc)
    editor.on('selectionUpdate', updateToc)

    // Initial update
    updateToc()

    return () => {
      editor.off('update', updateToc)
      editor.off('selectionUpdate', updateToc)
    }
  }, [rteRef.current?.editor])

  useEffect(() => {
    if (!editable) {
      setShowTOC(true)
    }
  }, [editable])

  // Configure TipTap extensions with collaboration
  const extensions = useMemo(() => {
    const baseExtensions = [
      StarterKit.configure({
        link: {
          openOnClick: false,
          enableClickSelection: true,
        },
        undoRedo: !enableHistory,
      }),
      LinkBubbleMenuHandler,
      TaskList,
      TaskItem,
      TextAlign.configure({
        types: [
          'paragraph',
          'blockquote',
          'bulletList',
          'codeBlock',
          'doc',
          'hardBreak',
          'heading',
          'horizontalRule',
          'listItem',
          'orderedList',
          'taskList',
          'taskItem',
        ],
      }),
      Highlight.configure({ multicolor: true }),
      // Emoji.configure({
      //   emojis: gitHubEmojis,
      //   enableEmoticons: true,
      //   suggestion,
      // }),
      TableOfContents.configure({
        getIndex: getHierarchicalIndexes,
      }),
      // Mention.configure({
      //   suggestion: createMentionSuggestionOptions(apolloClient),
      //   renderHTML({ options, node }) {
      //     console.log('renderHTML', options)
      //     return [
      //       'a',
      //       mergeAttributes({ href: '' }, options.HTMLAttributes),
      //       `@${node.attrs.label}`,
      //     ]
      //   },
      // }),
    ]
    // Add collaboration extensions only if provider is available
    if (provider) {
      baseExtensions.push(
        Collaboration.configure({
          document: ydoc,
          // Use the default fragment for collaborative editing
          field: 'default',
        })
      )

      // Add collaborative cursors if presence is enabled
      if (enablePresence) {
        baseExtensions.push(
          CollaborationCaret.configure({
            provider,
            user: userInfo,
          })
        )
      }
    }

    return baseExtensions
  }, [enableHistory, provider, ydoc, enablePresence, userInfo])

  // Show error if no document name provided
  if (!documentName) {
    return (
      <Box sx={{ p: 2, border: '1px solid red', borderRadius: 1 }}>
        <strong>CollabEditor Error:</strong> documentName prop is required for
        collaboration
      </Box>
    )
  }

  return (
    <Box
      variant="outlined"
      size="small"
      margin="dense"
      sx={() =>
        merge(
          {
            mt: 0,
            height: '100%',
            '&& .editorPane .MuiBox-root': {
              height: '100%',
            },
            '&& .MuiTiptap-RichTextContent-root': {
              flexGrow: 1,
              minHeight: 0,
              height: '100%',
              // height: 'calc(100% - 48px)',
              // backgroundColor: 'blue',
            },
            '&& .MuiTiptap-FieldContainer-notchedOutline': {
              // backgroundColor: 'background.paper',
              border: 'none',
              borderColor:
                error || connectionError ? 'error.main' : `${color}.main`,
            },
            '& .MuiTiptap-MenuBar-root': {
              width: showTOC ? 'calc(100% + 250px)' : '100%',
            },
            '& .MuiTiptap-FieldContainer-root': {
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: color
                ? `rgba(var(--mui-palette-${color}-lightChannel) / 0.1)`
                : undefined,
              '&::before': {
                content: '""',
                position: 'absolute',
                top: '0px',
                left: '8px',
                right: 0,
                height: '10px',
                backgroundColor: 'background.paper',
                width: 0,
                zIndex: 5,
                borderRadius: '0 0 2px 2px',
                border: 'none',
                borderColor: 'action.disabled',
                borderTop: 'none',
              },
              "[data-theme='light'] &::before": {
                border: 'none',
                backgroundColor: 'white',
              },
              "[data-theme='dark'] &::before": {
                border: 'none',
                backgroundColor: 'red',
              },
            },
          },
          sx
        )
      }
    >
      <Box
        sx={{
          height: '100%',
          border: '1px solid',
          borderColor: 'divider',
          // position: 'relative',
          '&& .MuiTiptap-RichTextContent-root': {
            // paddingRight: showTOC ? 0 : undefined,
            a: {
              color: 'secondary.main',
            },
            overflowY: 'auto',
            scrollBehavior: 'smooth',
            height: '100%',
          },
          '&& .ProseMirror': {
            minHeight: props.minRows * 24 || 100,
            'h1, h2, h3, h4, h5, h6': {
              marginBottom: '0.5em',
              marginTop: '0.25em',
            },
          },
          '& .collaboration-cursor__caret': {
            position: 'relative',
            marginLeft: '-1px',
            marginRight: '-1px',
            borderLeft: '1px solid',
            borderRight: '1px solid',
            wordBreak: 'normal',
            pointerEvents: 'none',
          },
          '& .collaboration-cursor__label': {
            position: 'absolute',
            top: '-1.4em',
            left: '-1px',
            fontSize: '12px',
            fontStyle: 'normal',
            fontWeight: 600,
            lineHeight: 'normal',
            userSelect: 'none',
            color: 'white',
            padding: '0.1rem 0.3rem',
            borderRadius: '3px 3px 3px 0px',
            whiteSpace: 'nowrap',
          },
        }}
      >
        {editable && !disabled && (
          <span style={{ position: 'absolute', top: -12, left: 0, zIndex: 10 }}>
            {/* {label} */}
            {isConnected && isSynced && (
              <span style={{ color: 'green' }}>●</span>
            )}
            {isConnected && !isSynced && (
              <span style={{ color: 'orange' }}>⟳</span>
            )}
            {connectionError && <span style={{ color: 'red' }}>⚠</span>}
          </span>
        )}
        <Grid2
          container
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ height: '100%' }}
        >
          <Grid2 className="editorPane" size={'grow'} sx={{ height: '100%' }}>
            <RichTextEditor
              ref={rteRef}
              extensions={extensions}
              // Don't pass content when using collaboration - Yjs manages the content
              content={provider ? undefined : content}
              onUpdate={({ editor }) => {
                const htmlContent = editor.getHTML()
                onChange?.(htmlContent === '<p></p>' ? '' : htmlContent)
              }}
              onCreate={({ editor }) => {
                if (focus) {
                  editor.commands.focus('end')
                }
              }}
              autofocus={focus ? 'end' : false}
              editable={editable && !disabled && isConnected && isSynced}
              editorProps={{
                attributes: {
                  id: props.name,
                  'aria-labelledby': `${props.name}-label`,
                  class: 'ProseMirror',
                  tabindex: props?.inputProps?.tabIndex || 0,
                  ...textFieldProps,
                },
              }}
              renderControls={() =>
                editable &&
                !disabled &&
                isConnected &&
                isSynced && (
                  <MenuControlsContainer>
                    <MenuSelectHeading />
                    <MenuDivider />
                    <MenuButtonUndo />
                    <MenuButtonRedo />
                    <MenuDivider />
                    <MenuButtonBold />
                    <MenuButtonItalic />
                    <MenuButtonUnderline />
                    <MenuButtonStrikethrough />
                    <MenuDivider />
                    <MenuSelectTextAlign />
                    <MenuDivider />
                    <MenuButtonEditLink />
                    <MenuDivider />
                    <MenuButtonBulletedList />
                    <MenuButtonOrderedList />
                    <MenuButtonTaskList />
                    <MenuDivider />
                    <MenuButtonBlockquote />
                    <MenuButtonIndent />
                    <MenuButtonUnindent />
                    <MenuDivider />
                    <MenuButtonHighlightToggle />
                    <MenuButtonHighlightColor />
                    <MenuDivider />
                    <MenuButtonHorizontalRule />
                    <MenuDivider />
                    <MenuButton
                      IconComponent={Toc}
                      onClick={() => setShowTOC(!showTOC)}
                      value={showTOC}
                      tooltipLabel="Toggle Table of Contents"
                      selected={showTOC}
                    />
                    <ConnectedUsersDisplay users={connectedUsers} />
                  </MenuControlsContainer>
                )
              }
            >
              {() => <>{<LinkBubbleMenu />}</>}
            </RichTextEditor>
          </Grid2>
          <Show when={showTOC}>
            <Grid2
              sx={{
                width: 250,
                borderLeftColor: 'divider',
                borderLeftWidth: '1px',
                borderLeftStyle: 'solid',
                height: '100%',
                p: 1,
                pt: editable ? '54px' : 1,
              }}
            >
              <Stack
                sx={{
                  height: '100%',
                }}
              >
                <Typography variant="overline" sx={{ fontWeight: 600 }}>
                  Table of contents
                </Typography>
                <Box sx={{ overflowY: 'auto', height: '100%' }}>
                  <MemorizedToC items={tocItems} />
                </Box>
              </Stack>
            </Grid2>
          </Show>
        </Grid2>
      </Box>

      {((error?.message && !disabled) || connectionError || helperText) && (
        <FormHelperText
          id={props.name}
          error={Boolean(error || connectionError)}
        >
          {connectionError || (error?.message && !disabled) || helperText}
        </FormHelperText>
      )}
    </Box>
  )
}

export default CollabEditor
