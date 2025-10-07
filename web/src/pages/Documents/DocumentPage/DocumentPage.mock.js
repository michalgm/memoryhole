export const standard = {
  'doc-1': {
    document: {
      __typename: 'Document',
      id: 'doc-1',
      name: 'document:project-documentation',
      title: 'Project Documentation',
      type: 'document',
      access_role: 'Restricted',
      edit_role: 'Operator',
      created_at: '2024-10-01T10:00:00.000Z',
      updated_at: '2024-10-05T15:30:00.000Z',
      created_by: {
        __typename: 'User',
        id: 1,
        name: 'Admin User',
        email: 'admin@example.com',
      },
      updated_by: {
        __typename: 'User',
        id: 1,
        name: 'Admin User',
        email: 'admin@example.com',
      },
    },
  },
  'doc-2': {
    document: {
      __typename: 'Document',
      id: 'doc-2',
      name: 'document:meeting-notes',
      title: 'Meeting Notes',
      type: 'document',
      access_role: 'Operator',
      edit_role: 'Coordinator',
      created_at: '2024-09-15T09:00:00.000Z',
      updated_at: '2024-09-20T11:00:00.000Z',
      created_by: {
        __typename: 'User',
        id: 2,
        name: 'Regular User',
        email: 'regular@example.com',
      },
      updated_by: {
        __typename: 'User',
        id: 2,
        name: 'Regular User',
        email: 'regular@example.com',
      },
    },
  },
}
