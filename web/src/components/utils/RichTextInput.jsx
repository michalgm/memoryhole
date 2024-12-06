import { useRef } from 'react'

import { Box, FormControl, InputLabel } from '@mui/material'
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
  const { content, onChange, editable = true, disabled = false } = props
  const rteRef = useRef(null)
  const Component = editable ? RichTextEditor : RichTextReadOnly
  return (
    <FormControl fullWidth disabled={disabled}>
      <InputLabel
        sx={{
          backgroundColor: 'white',
          zIndex: 10,
          px: 0.5,
        }}
        shrink
      >
        {props.label}
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
          editorProps={{
            attributes: {
              tabindex: props?.inputProps?.tabIndex,
            },
          }}
          // Optionally include `renderControls` for a menu-bar atop the editor:
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
    </FormControl>
  )
}

export default RichTextInput
