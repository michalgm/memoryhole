import { graphql } from 'msw'

export default {
  title: 'GraphQL/Actions',
}

const mockAction = {
  id: 1,
  name: 'Demo Action',
  description: 'Test action for storybook',
  start_date: '2023-01-01',
  end_date: '2023-12-31',
  jurisdiction: 'Test City',
  city: 'Test City',
  custom_fields: {},
}

export const SingleAction = {
  parameters: {
    msw: {
      handlers: [
        graphql.query('action', (req, res, ctx) => {
          return res(ctx.data({ action: mockAction }))
        }),
      ],
    },
  },
}

export const ActionsList = {
  parameters: {
    msw: {
      handlers: [
        graphql.query('actions', (req, res, ctx) => {
          return res(ctx.data({ actions: [mockAction] }))
        }),
      ],
    },
  },
}
