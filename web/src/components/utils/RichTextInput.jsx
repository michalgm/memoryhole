import { useEffect, useRef, useState } from 'react'

import { Box, FormControl, FormHelperText, InputLabel } from '@mui/material'
import Link from '@tiptap/extension-link'
import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import StarterKit from '@tiptap/starter-kit'
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

const RichTextInput = (props) => {
  const {
    content = '',
    onChange,
    editable = true,
    disabled = false,
    required = false,
    label,
    error,
    helperText,
    color,
    focus = false,
  } = props
  const rteRef = useRef(null)

  const labelRef = useRef(null)
  const [labelWidth, setLabelWidth] = useState(0)
  useEffect(() => {
    if (labelRef.current) {
      setLabelWidth(labelRef.current.getBoundingClientRect().width)
    }
  }, [label])

  if (editable) {
    return (
      <FormControl
        fullWidth
        disabled={disabled}
        variant="outlined"
        size="small"
        margin="dense"
        required={required}
        error={Boolean(error)}
        sx={(theme) => ({
          '&& .MuiTiptap-FieldContainer-notchedOutline': {
            borderColor: error ? 'error.main' : `${color}.main`,
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
              width: `${labelWidth + 12}px`,
              zIndex: 5,
              borderRadius: '0 0 2px 2px',
              border: 'none',
              borderColor: 'action.disabled',
              borderTop: 'none',
              ...theme.applyStyles('dark', {
                backgroundColor: '#2e2e2e',
                border: '1px solid',
              }),
            },
            "[data-theme='light'] &::before": {
              border: 'none',
              backgroundColor: 'white',
            },
          },
        })}
      >
        <InputLabel
          size="small"
          margin="dense"
          sx={{
            zIndex: 10,
          }}
          shrink
          color={color}
          variant="outlined"
          htmlFor={props.name}
        >
          <span ref={labelRef}>{label}</span>
        </InputLabel>
        <Box
          sx={{
            '&& .MuiTiptap-RichTextContent-root  a': {
              color: 'secondary.main',
            },
            '&& .ProseMirror': {
              minHeight: props.minRows * 24,
              overflowY: 'auto',
            },
          }}
        >
          <RichTextEditor
            ref={rteRef}
            extensions={[
              StarterKit,
              LinkBubbleMenuHandler,
              Link,
              Underline,
              TextAlign,
              TaskList,
              TaskItem,
            ]} // Or any Tiptap extensions you wish!
            content={content} // Initial content for the editor
            onUpdate={({ editor }) => {
              onChange(editor.getHTML())
            }}
            onCreate={({ editor }) => {
              if (focus) {
                editor.commands.focus('end')
              }
            }}
            // autofocus={focus}
            editable={!disabled}
            editorProps={{
              autofocus: focus ? 'end' : false,
              attributes: {
                class: 'ProseMirror',
                tabindex: props?.inputProps?.tabIndex || 0,
              },
            }}
            renderControls={() =>
              !disabled && (
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
        {((error?.message && !disabled) || helperText) && (
          <FormHelperText error={Boolean(error)}>
            {error?.message && !disabled ? error.message : helperText}
          </FormHelperText>
        )}
      </FormControl>
    )
  } else {
    return <RichTextReadOnly content={content} extensions={[StarterKit]} />
  }
}

export default RichTextInput
