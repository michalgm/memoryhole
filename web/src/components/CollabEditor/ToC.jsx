import { List, ListItem } from '@mui/material'
import { TextSelection } from '@tiptap/pm/state'

import Link from 'src/components/utils/Link'

export const ToCItem = ({ item }) => {
  return (
    <ListItem sx={{ pl: 2 * (item.level - 1) }}>
      <Link
        href={`#${item.id}`}
        sx={{ textDecoration: 'none', color: 'inherit' }}
        underline="hover"
        variant="body2"
      >
        {item.textContent}
      </Link>
    </ListItem>
  )
}

export const ToCEmptyState = () => {
  return <div className="empty-state"></div>
}

export const ToC = ({ items = [], editor }) => {
  if (items.length === 0) {
    return <ToCEmptyState />
  }

  const onItemClick = (e, id) => {
    e.preventDefault()

    if (editor) {
      const element = editor.view.dom.querySelector(`[data-toc-id="${id}"`)
      const pos = editor.view.posAtDOM(element, 0)

      // set focus
      const tr = editor.view.state.tr

      tr.setSelection(new TextSelection(tr.doc.resolve(pos)))

      editor.view.dispatch(tr)

      editor.view.focus()

      // // eslint-disable-next-line
      // if (history.pushState) {
      //   // eslint-disable-next-line
      //   history.pushState(null, null, `#${id}`)
      // }

      window.scrollTo({
        top: element.getBoundingClientRect().top + window.scrollY,
        behavior: 'smooth',
      })
    }
  }

  return (
    <List dense>
      {items.map((item, i) => (
        <ToCItem
          onItemClick={onItemClick}
          key={item.id}
          item={item}
          index={i + 1}
        />
      ))}
    </List>
  )
}
