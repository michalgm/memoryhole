import { useRef } from 'react'

import { Box } from '@mui/material'
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
  const { content, onChange, editable = true } = props
  const rteRef = useRef(null)
  const Component = editable ? RichTextEditor : RichTextReadOnly

  return (
    <Box
      sx={{
        '&& .MuiTiptap-RichTextContent-root  a': {
          color: 'secondary.main',
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
        // Optionally include `renderControls` for a menu-bar atop the editor:
        renderControls={() => (
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
        )}
      >
        {() => (
          <>
            <LinkBubbleMenu />
          </>
        )}
      </Component>
    </Box>
  )
}

export default RichTextInput
