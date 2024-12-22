import dayjs from 'dayjs'

// Define your own mock data here:
const custom_fields = {
  custody_status: 'In',
  disposition: 'Unresolved',
  release_type: 'Bond',
}

const defaults = {
  jurisdiction: 'Alameda',
  date: dayjs().format('YYYY-MM-DD'),
}
export const standard = (/* vars, { ctx, req } */) => ({
  arrests: [
    {
      id: 42,
      custom_fields,
      ...defaults,
      arrestee: { display_field: 'A' },
    },
    { id: 43, custom_fields, ...defaults, arrestee: { display_field: 'B' } },
    { id: 44, custom_fields, ...defaults, arrestee: { display_field: 'C' } },
  ],
})
