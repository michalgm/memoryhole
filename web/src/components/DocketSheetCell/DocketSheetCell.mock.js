// Define your own mock data here:
export const standard = (/* vars, { ctx, req } */) => ({
  docketSheet: [
    {
      id: 42,
      jurisdiction: 'City',
      citation_number: '123456',
      charges: 'Charges',
      date: '2023-11-10T12:00:00Z',
      custom_fields: {
        'Custom Field 1': 'Value 1',
      },
      arrestee: {
        display_field: 'B',
        email: 'foo@bar.com',
        first_name: 'John',
        last_name: 'Doe',
        __typename: 'Arrestee',
      },
      __typename: 'DocketSheet',
    },
  ],
})
