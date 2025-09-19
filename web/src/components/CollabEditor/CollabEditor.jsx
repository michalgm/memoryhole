import { useEffect, useMemo, useRef, useState } from 'react'

import { HocuspocusProvider } from '@hocuspocus/provider'
import {
  Avatar,
  Box,
  FormControl,
  FormHelperText,
  InputLabel,
  Tooltip,
} from '@mui/material'
import AvatarGroup from '@mui/material/AvatarGroup'
import Collaboration from '@tiptap/extension-collaboration'
import CollaborationCaret from '@tiptap/extension-collaboration-caret'
import { TaskItem, TaskList } from '@tiptap/extension-list'
import TextAlign from '@tiptap/extension-text-align'
import StarterKit from '@tiptap/starter-kit'
import { merge } from 'lodash-es'
import {
  LinkBubbleMenu,
  LinkBubbleMenuHandler,
  MenuButtonAlignCenter,
  MenuButtonAlignLeft,
  MenuButtonAlignRight,
  MenuButtonBold,
  MenuButtonBulletedList,
  MenuButtonEditLink,
  MenuButtonHorizontalRule,
  MenuButtonItalic,
  MenuButtonOrderedList,
  MenuButtonTaskList,
  MenuButtonUnderline,
  MenuControlsContainer,
  MenuDivider,
  MenuSelectHeading,
  RichTextEditor,
  RichTextReadOnly,
} from 'mui-tiptap'
import * as Y from 'yjs'

import { useAuth } from 'src/auth'

/**
 * Generate user colors based on user ID or email for consistent colors across sessions
 */
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
/**
 * CollabEditor Component
 * A collaborative rich text editor that extends RichTextInput with real-time collaboration
 */
const CollabEditor = (props) => {
  const {
    documentName, // Required: Document identifier for collaboration
    content = '',
    onChange,
    editable = true,
    disabled = false,
    required = false,
    error,
    helperText,
    color,
    focus = false,
    sx = {},
    serverUrl = 'ws://localhost:1234', // Hocuspocus server URL
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
      url: serverUrl,
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
  ])

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
  }, [provider, ydoc, enableHistory, enablePresence, userInfo])

  // Show error if no document name provided
  if (!documentName) {
    return (
      <Box sx={{ p: 2, border: '1px solid red', borderRadius: 1 }}>
        <strong>CollabEditor Error:</strong> documentName prop is required for
        collaboration
      </Box>
    )
  }

  // Render readonly version if not editable
  if (!editable) {
    return (
      <RichTextReadOnly
        content={content}
        extensions={extensions.filter(
          (ext) =>
            // Remove collaboration extensions for readonly mode
            ext.name !== 'collaboration' && ext.name !== 'collaborationCaret'
        )}
      />
    )
  }

  return (
    <FormControl
      fullWidth
      disabled={disabled}
      variant="outlined"
      size="small"
      margin="dense"
      required={required}
      error={Boolean(error || connectionError)}
      sx={() =>
        merge(
          {
            '&& .MuiTiptap-FieldContainer-notchedOutline': {
              // backgroundColor: 'background.paper',
              borderColor:
                error || connectionError ? 'error.main' : `${color}.main`,
            },
            '& .MuiTiptap-FieldContainer-root': {
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
      <InputLabel
        size="small"
        margin="dense"
        sx={{
          zIndex: 10,
          color: connectionError ? 'error.main' : undefined,
        }}
        shrink
        color={color}
        variant="outlined"
        htmlFor={`${props.name}`}
        id={`${props.name}-label`}
      >
        <span>
          {/* {label} */}
          {isConnected && isSynced && <span style={{ color: 'green' }}>●</span>}
          {isConnected && !isSynced && (
            <span style={{ color: 'orange' }}>⟳</span>
          )}
          {connectionError && <span style={{ color: 'red' }}>⚠</span>}
        </span>
      </InputLabel>

      <Box
        sx={{
          '&& .MuiTiptap-RichTextContent-root  a': {
            color: 'secondary.main',
          },
          '&& .ProseMirror': {
            minHeight: props.minRows * 24 || 100,
            overflowY: 'auto',
          },
          // Style collaborative cursors
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
          editable={!disabled && isConnected && isSynced}
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
            !disabled &&
            isConnected &&
            isSynced && (
              <MenuControlsContainer>
                <MenuSelectHeading />
                <MenuDivider />
                <MenuButtonBold />
                <MenuButtonItalic />
                <MenuButtonUnderline />
                <MenuDivider />
                <MenuButtonAlignLeft />
                <MenuButtonAlignCenter />
                <MenuButtonAlignRight />
                <MenuDivider />
                <MenuButtonEditLink />
                <MenuDivider />
                <MenuButtonBulletedList />
                <MenuButtonOrderedList />
                <MenuButtonTaskList />
                <MenuDivider />
                <MenuButtonHorizontalRule />
                <ConnectedUsersDisplay users={connectedUsers} />
              </MenuControlsContainer>
            )
          }
        >
          {() => (
            <>
              <LinkBubbleMenu />
            </>
          )}
        </RichTextEditor>
      </Box>

      {((error?.message && !disabled) || connectionError || helperText) && (
        <FormHelperText
          id={props.name}
          error={Boolean(error || connectionError)}
        >
          {connectionError || (error?.message && !disabled) || helperText}
        </FormHelperText>
      )}
    </FormControl>
  )
}

export default CollabEditor
