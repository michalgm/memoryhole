import { useCallback } from 'react'

import { closestCenter, DndContext } from '@dnd-kit/core'
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Delete, DragHandle, Lock, Undo } from '@mui/icons-material'
import { IconButton, List, ListItem, Tooltip } from '@mui/material'
import { Stack } from '@mui/system'
import { useFormContext } from 'react-hook-form'

import { Field } from 'src/components/utils/Field'

const SortableOption = React.memo(({ value, index, onDelete, listeners }) => {
  const {
    formState: { touchedFields },
    setValue,
  } = useFormContext()

  let title = 'Delete Value'
  let Icon = Delete
  if (value.is_static) {
    title = 'This value cannot be modified or deleted'
    Icon = Lock
  } else if (value.deleted) {
    title = 'Restore Value'
    Icon = Undo
  }
  const onChange = useCallback(
    (updated) => {
      // Auto-fill value field from label if empty
      if (
        !value.id &&
        !touchedFields?.values?.[index]?.value &&
        updated &&
        updated.trim() !== ''
      ) {
        setValue(`values.${index}.value`, updated)
      }
    },
    [index, setValue, touchedFields, value]
  )

  const onClick = useCallback(() => {
    if (!value.is_static) {
      onDelete(index, value.deleted)
    }
  }, [index, onDelete, value.deleted, value.is_static])

  return (
    <ListItem
      key={value.fieldId}
      disableGutters
      secondaryAction={
        <Tooltip title={title}>
          <span>
            <IconButton
              aria-label={title.toLowerCase()}
              disabled={value.is_static}
              size="small"
              onClick={onClick}
            >
              <Icon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
      }
    >
      <Tooltip title="Drag to reorder">
        <IconButton
          size="small"
          edge="start"
          {...listeners}
          style={{ cursor: 'grab', marginRight: 8 }}
          aria-label="drag"
        >
          <DragHandle />
        </IconButton>
      </Tooltip>
      <Stack spacing={2} direction="row" alignItems="center">
        <Field
          name={`values.${index}.label`}
          required
          size="small"
          disabled={value.is_static}
          onChange={onChange}
        />
        <Field
          name={`values.${index}.value`}
          required
          size="small"
          disabled={value.is_static || !!value.id}
        />
      </Stack>
    </ListItem>
  )
})

function SortableListItem(props) {
  const { value } = props
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: value.fieldId })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    background: isDragging ? '#f0f0f0' : value.isStatic ? '#eee' : 'inherit',
    opacity: value.deleted ? 0.5 : 1,
    display: 'flex',
    alignItems: 'center',
  }
  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <SortableOption {...props} listeners={listeners} />
    </div>
  )
}

const OptionSetValuesList = ({ fields, remove, move, update }) => {
  const handleDragEnd = useCallback(
    (event) => {
      const { active, over } = event
      if (active.id !== over?.id) {
        const oldIndex = fields.findIndex((v) => v.fieldId === active.id)
        const newIndex = fields.findIndex((v) => v.fieldId === over.id)
        move(oldIndex, newIndex)
      }
    },
    [fields, move]
  )

  const handleDelete = useCallback(
    (index, deleted) => {
      const value = fields[index]
      if (!value?.id) {
        remove(index)
      } else {
        update(index, { ...value, deleted: !deleted })
      }
    },
    [fields, remove, update]
  )

  return (
    <>
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={fields.map((v) => v.fieldId)}
          strategy={verticalListSortingStrategy}
        >
          <List dense>
            {fields.map((value, index) => (
              <SortableListItem
                key={value.fieldId}
                value={value}
                index={index}
                onDelete={handleDelete}
              />
            ))}
          </List>
        </SortableContext>
      </DndContext>
    </>
  )
}

export default OptionSetValuesList
