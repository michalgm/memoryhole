import { computePosition, flip, shift } from '@floating-ui/dom'
import type { Editor } from '@tiptap/core'
import type { MentionOptions } from '@tiptap/extension-mention'
import { ReactRenderer, posToDOMRect } from '@tiptap/react'

import { QUERY } from 'src/components/User/UsersCell/UsersCell'

import SuggestionList, { type SuggestionListRef } from './SuggestionList'

export type MentionSuggestion = {
  id: string
  mentionLabel: string
}

export type User = {
  id: string
  name: string
  email: string
}

const updatePosition = (editor: Editor, element: Element) => {
  if (!(element instanceof HTMLElement)) {
    // Defensive, to appease TypeScript
    return
  }
  const virtualElement = {
    getBoundingClientRect: () =>
      posToDOMRect(
        editor.view,
        editor.state.selection.from,
        editor.state.selection.to
      ),
  }

  void computePosition(virtualElement, element, {
    placement: 'bottom-start',
    strategy: 'absolute',
    middleware: [shift(), flip()],
  }).then(({ x, y, strategy }) => {
    element.style.width = 'max-content'
    element.style.position = strategy
    element.style.left = `${x.toFixed(0)}px`
    element.style.top = `${y.toFixed(0)}px`
  })
}

// Create a function that takes a client parameter so it can be used with Apollo client
export const createMentionSuggestionOptions = (apolloClient?: {
  query: (options: unknown) => Promise<{ data: unknown }>
}): MentionOptions['suggestion'] => ({
  decorationTag: 'a',
  decorationContent: (item: MentionSuggestion) => `@${item.mentionLabel}fooo`,
  items: async ({ query }): Promise<MentionSuggestion[]> => {
    try {
      // Call your UsersQuery using Apollo client
      const { data } = await apolloClient.query({
        query: QUERY,
        fetchPolicy: 'cache-first', // Use cache if available for better performance
      })

      const typedData = data as { users?: User[] }
      if (!typedData?.users) {
        return []
      }

      // Transform users data to MentionSuggestion format
      return typedData.users
        .filter(
          (user: User) =>
            user.name?.toLowerCase().includes(query.toLowerCase()) ||
            user.email?.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 5)
        .map((user: User) => ({
          id: user.id,
          mentionLabel: user.name || user.email,
        }))
    } catch (error) {
      console.error('Error fetching users for mentions:', error)
      return []
    }
  },

  render: () => {
    let reactRenderer: ReactRenderer<SuggestionListRef> | undefined

    return {
      onStart: (props) => {
        if (!props.clientRect) {
          return
        }

        reactRenderer = new ReactRenderer(SuggestionList, {
          props,
          editor: props.editor,
        })

        if (!(reactRenderer.element instanceof HTMLElement)) {
          // Defensive, to appease TypeScript
          return
        }
        reactRenderer.element.style.position = 'absolute'
        document.body.appendChild(reactRenderer.element)
        updatePosition(props.editor, reactRenderer.element)
      },

      onUpdate(props) {
        reactRenderer?.updateProps(props)

        if (!props.clientRect || !reactRenderer) {
          return
        }

        updatePosition(props.editor, reactRenderer.element)
      },

      onKeyDown(props) {
        if (props.event.key === 'Escape') {
          reactRenderer?.destroy()
          reactRenderer?.element.remove()
          return true
        }

        return reactRenderer?.ref?.onKeyDown(props) ?? false
      },

      onExit() {
        reactRenderer?.destroy()
        reactRenderer?.element.remove()
        // Remove references to the old reactRenderer upon destruction/exit.
        // (This should prevent memory leaks and redundant calls to `destroy()`,
        // since based on original testing with Tiptap v2, the `suggestion`
        // plugin seems to call `onExit` both when a suggestion menu is closed
        // after a user chooses an option, *and* when the editor itself is
        // destroyed.)
        reactRenderer = undefined
      },
    }
  },
})

// Backward compatible export using the old hardcoded data
export const mentionSuggestionOptions = createMentionSuggestionOptions()
