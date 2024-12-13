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
  } = props
  const rteRef = useRef(null)

  // console.log('Editor state:', {
  //   content,
  //   isInitialized,
  //   editorContent: editor?.getHTML(),
  // })
  // // console.log('Editor:', editor)

  // useEffect(() => {
  //   console.log('Content changed:', content)
  //   // console.log('Editor instance:', rteRef.current)
  // }, [content])

  // // console.log('Editor instance:', rteRef.current)
  // console.log('WORKING CONTEXT:', {
  //   content,
  //   editor,
  //   // formValues: form.getValues(), // if using RHF
  //   // editorInstance: rteRef.current,
  // })

  const Component = editable ? RichTextEditor : RichTextReadOnly
  const labelRef = useRef(null)
  const [labelWidth, setLabelWidth] = useState(0)
  useEffect(() => {
    if (labelRef.current) {
      setLabelWidth(labelRef.current.getBoundingClientRect().width)
    }
  }, [label])

  return (
    <FormControl
      fullWidth
      disabled={disabled}
      variant="outlined"
      size="small"
      margin="dense"
      required={required}
      error={Boolean(error)}
      sx={{
        '&& .MuiTiptap-FieldContainer-notchedOutline': {
          borderColor: error ? 'error.main' : '',
        },
        '& .MuiTiptap-FieldContainer-root': {
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '0px',
            left: '8px',
            right: 0,
            height: '10px',
            backgroundColor: (theme) =>
              theme.palette.mode === 'light' ? 'background.paper' : '#2e2e2e',
            width: `${labelWidth + 12}px`,
            zIndex: 5,
            borderRadius: '0 0 2px 2px',
            border: (theme) =>
              theme.palette.mode === 'light' ? 'none' : '1px solid',
            borderColor: 'action.disabled',
            borderTop: 'none',
          },
          "[data-theme='light'] &::before": {
            border: 'none',
            backgroundColor: 'white',
          },
        },
      }}
    >
      <InputLabel
        size="small"
        margin="dense"
        sx={{
          zIndex: 10,
        }}
        shrink
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
        <Component
          innerRef={rteRef}
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
          editable={!disabled}
          editorProps={
            props?.inputProps?.tabIndex
              ? {
                  attributes: {
                    tabindex: props?.inputProps?.tabIndex,
                  },
                }
              : null
          }
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
        </Component>
      </Box>
      {((error?.message && !disabled) || helperText) && (
        <FormHelperText error={Boolean(error)}>
          {error?.message && !disabled ? error.message : helperText}
        </FormHelperText>
      )}
    </FormControl>
  )
}

export default RichTextInput
