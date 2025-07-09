import { validate, validateWithSync } from '@redwoodjs/api'
import { ForbiddenError } from '@redwoodjs/graphql-server'

import { db } from 'src/lib/db'
import { getSetting } from 'src/lib/settingsCache'
import { prepareJsonUpdate } from 'src/lib/utils'

import dayjs from '../../lib/day'
import { updateDisplayField as updateArresteeDisplayField } from '../arrestees/arrestees'

export const checkArrestAccess = (arrest) => {
  const settings = getSetting('restriction_settings')
  const {
    action_ids = [],
    arrest_date_min,
    arrest_date_max,
    arrest_date_threshold,
  } = context.currentUser

  if (
    settings.arrest_date_min &&
    arrest_date_min &&
    arrest.date < arrest_date_min
  ) {
    throw new ForbiddenError(
      `Arrest date ${arrest.date} is before your minimum access date ${arrest_date_min}`
    )
  }
  if (
    settings.arrest_date_max &&
    arrest_date_max &&
    arrest.date > dayjs(arrest_date_max).endOf('day')
  ) {
    throw new ForbiddenError(
      `Arrest date ${arrest.date} is after your maximum access date ${arrest_date_max}`
    )
  }
  if (
    settings.arrest_date_threshold &&
    arrest_date_threshold &&
    arrest.date < dayjs().subtract(arrest_date_threshold, 'day').startOf('day')
  ) {
    throw new ForbiddenError(
      `Arrest date ${arrest.date} is older than your access date threshold of ${arrest_date_threshold} days`
    )
  }

  if (action_ids.length === 0) return true

  if (!arrest.action_id || !action_ids.includes(arrest.action_id)) {
    throw new ForbiddenError(`You don't have access to arrest id ${arrest.id}`)
  }
}

const checkArrestsAccess = async (ids, tx) => {
  const arrests = await (tx || db).arrest.findMany({
    where: { id: { in: ids } },
    select: {
      id: true,
      action_id: true,
      date: true,
      custom_fields: true,
      arrestee: {
        select: {
          id: true,
          custom_fields: true,
        },
      },
    },
  })

  arrests.forEach((arrest) => {
    checkArrestAccess(arrest)
  })
  return arrests
}

export const filterArrestAccess = (baseWhere = {}) => {
  const settings = getSetting('restriction_settings')
  const {
    action_ids = [],
    arrest_date_min,
    arrest_date_max,
    arrest_date_threshold,
  } = context.currentUser
  const where = { ...baseWhere }

  const dateConstraints = []

  if (where.date) {
    dateConstraints.push(where.date)
  }
  if (arrest_date_min && settings.arrest_date_min) {
    dateConstraints.push({ gte: arrest_date_min })
  }
  if (arrest_date_max && settings.arrest_date_max) {
    dateConstraints.push({ lte: arrest_date_max })
  }
  if (arrest_date_threshold && settings.arrest_date_threshold) {
    dateConstraints.push({
      gte: dayjs().subtract(arrest_date_threshold, 'day').startOf('day'),
    })
  }
  if (dateConstraints.length > 0) {
    where.AND = dateConstraints.map((c) => ({ date: c }))
  }

  if (action_ids.length > 0) {
    where.action_id = {
      ...where.action_id,
      in: action_ids,
    }
  }

  return where
}

export const arrests = () => {
  return db.arrest.findMany({
    where: filterArrestAccess({}),
  })
}

export const filterArrests = async ({ filters = [] }) => {
  // await new Promise((resolve) => setTimeout(resolve, 5000))
  const where = {}
  filters.forEach((filter) => {
    let { field, operator, value } = filter
    let query = {
      [operator]: value,
    }
    const parts = field.split('.')
    const dbField = parts[0]
    if (parts.length > 1) {
      if (parts[0] === 'custom_fields') {
        query = { path: [parts[1]], ...query }
      } else {
        query = {
          [parts[1]]: {
            ...query,
            mode: 'insensitive',
          },
        }
      }
    }
    where[dbField] = query
  })

  return db.arrest.findMany({
    where: filterArrestAccess(where),
    orderBy: {
      date: 'desc',
    },
  })
}

export const arrest = async ({ id }) => {
  const arrest = await db.arrest.findUnique({
    where: { id },
  })
  checkArrestAccess(arrest)
  return arrest
}

export const searchArrests = ({ search = '', action_id }) => {
  const where = {
    OR: search.split(/\s+/).map((term) => ({
      OR: [
        {
          arrestee: {
            first_name: {
              contains: term,
              mode: 'insensitive',
            },
          },
        },
        {
          arrestee: {
            last_name: {
              contains: term,
              mode: 'insensitive',
            },
          },
        },
        {
          arrestee: {
            email: {
              contains: term,
              mode: 'insensitive',
            },
          },
        },
        {
          arrestee: {
            preferred_name: {
              contains: term,
              mode: 'insensitive',
            },
          },
        },
      ],
    })),
  }
  if (action_id) {
    where.action_id = action_id
  }
  return db.arrest.findMany({
    where: filterArrestAccess(where),
    take: 10,
    orderBy: {
      date: 'desc',
    },
  })
}

export const docketSheetSearch = async ({
  date: dateRaw,
  days,
  report_type,
  jurisdiction,
  // include_contact,
}) => {
  const date = dayjs(dateRaw)
  const dateLimit = date.add(days, 'day').toDate()
  const where = {
    jurisdiction,
  }

  if (report_type === 'arrest_date') {
    where.date = {
      gte: date,
      lt: dateLimit,
    }
  } else {
    where.date = {
      lte: dateLimit,
    }
  }

  const records = await db.arrest.findMany({
    where,
  })
  return records.filter(({ custom_fields }) => {
    if (report_type === 'arrest_date') {
      return true
    }
    if (custom_fields.next_court_date) {
      const court_date = new Date(custom_fields.next_court_date)
      return court_date >= date && court_date < dateLimit
    }
  })
}

const updateDisplayField = (arrest) => {
  if (arrest.date) {
    arrest.display_field = dayjs(arrest.date).format('L')
  } else {
    delete arrest.date
  }
}

const validateAndPrepareData = (
  { id: _id, action_id, arrestee, ...arrest },
  current = {}
) => {
  const data = {
    ...arrest,
    updated_by: {
      connect: { id: context.currentUser.id },
    },
  }

  if (arrestee) {
    validateWithSync(() => {
      if (arrestee.email) {
        validate(arrestee.email, 'Email', { email: true })
      }
    })
    updateArresteeDisplayField(arrestee, current.arrestee)

    data.arrestee = {
      update: {
        data: arrestee,
      },
    }
  }
  if (arrest.custom_fields) {
    if (arrest.custom_fields.next_court_date) {
      validateWithSync(() => {
        validate(arrest.custom_fields.next_court_date, 'Next Court Date', {
          custom: {
            with: (value) => {
              if (!dayjs(value).isValid()) {
                throw new Error('Invalid date')
              }
            },
          },
        })
      })
    }
  }
  updateDisplayField(arrest)
  if (action_id) {
    data.action = { connect: { id: action_id } }
  }

  return data
}

export const createArrest = ({ input: { arrestee, action_id, ...arrest } }) => {
  checkArrestAccess({ ...arrest, action_id })
  const data = validateAndPrepareData({
    action_id,
    arrestee,
    ...arrest,
  })
  if (data.arrestee) {
    data.arrestee.create = data.arrestee.update.data
    delete data.arrestee.update
  }
  return db.arrest.create({
    data: {
      ...data,
      created_by: {
        connect: { id: context.currentUser.id },
      },
    },
  })
}

export const updateArrest = async ({ id, input: { action_id, ...input } }) => {
  await checkArrestsAccess([id])
  const current = await db.arrest.findUnique({
    where: { id },
    include: {
      arrestee: true,
    },
  })

  const mergedInput = await prepareJsonUpdate(
    'Arrest',
    { action_id, ...input },
    { current }
  )

  if (input.arrestee) {
    mergedInput.arrestee = await prepareJsonUpdate(
      'Arrestee',
      mergedInput.arrestee,
      { current: current.arrestee }
    )
  }

  const data = validateAndPrepareData(
    {
      id,
      action_id,
      ...mergedInput,
    },
    current
  )
  // console.log('UPDATE DATA', data)

  return db.arrest.update({
    data,
    where: { id },
  })
}

export const bulkUpdateArrests = async ({ ids, input }) => {
  const update = async (tx) => {
    const arrests = await checkArrestsAccess(ids, tx)
    const updates = arrests.map(async ({ id, ...arrest }) => {
      const mergedInput = await prepareJsonUpdate(
        'Arrest',
        { ...input, id },
        { tx, current: arrest }
      )
      if (input.arrestee) {
        mergedInput.arrestee = await prepareJsonUpdate(
          'Arrestee',
          mergedInput.arrestee,
          { current: arrest.arrestee, tx }
        )
      }
      const data = await validateAndPrepareData(
        {
          id,
          ...mergedInput,
        },
        arrest
      )

      return tx.arrest.update({
        data,
        where: { id },
      })
    })
    const results = await Promise.all(updates)
    return { count: results.length }
  }

  if (process.env.NODE_ENV === 'test') {
    return update(db)
  } else {
    return db.$transaction(update)
  }
}

export const deleteArrest = async ({ id }) => {
  await arrest({ id })
  return db.$transaction(async (tx) => {
    const [arrestRecord] = await checkArrestsAccess([id], tx)

    const res = await tx.arrest.delete({
      where: { id },
    })

    if (arrestRecord?.arrestee?.id) {
      await tx.arrestee.delete({
        where: { id: arrestRecord.arrestee.id },
      })
    }
    return res
  })
}

export const bulkDeleteArrests = async ({ ids }) => {
  return db.$transaction(async (tx) => {
    const arrests = await checkArrestsAccess(ids, tx)

    // Delete arrests first
    await tx.arrest.deleteMany({
      where: { id: { in: ids } },
    })

    // Then delete associated arrestees
    const arresteeIds = arrests
      .filter((arrest) => arrest.arrestee?.id)
      .map((arrest) => arrest.arrestee.id)

    if (arresteeIds.length > 0) {
      await tx.arrestee.deleteMany({
        where: { id: { in: arresteeIds } },
      })
    }
    return { count: ids.length }
  })
}

export const Arrest = {
  arrestee: (_obj, { root }) => {
    return db.arrest.findUnique({ where: { id: root?.id } }).arrestee()
  },
  action: (_obj, { root }) => {
    return db.arrest.findUnique({ where: { id: root?.id } }).action()
  },
  created_by: (_obj, { root }) => {
    return db.arrest.findUnique({ where: { id: root?.id } }).created_by()
  },
  updated_by: (_obj, { root }) => {
    return db.arrest.findUnique({ where: { id: root?.id } }).updated_by()
  },
  // display_field: (_obj, { root }) => {
  //   if (root.date) {
  //     return dayjs(root.date).format('L')
  //   }
  // },
}
