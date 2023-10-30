// Pass props to your component by passing an `args` object to your story
//
// ```jsx
// export const Primary = {
//  args: {
//    propName: propValue
//  }
// }
// ```
//
// See https://storybook.js.org/docs/react/writing-stories/args.

import ArresteeArrest from './ArresteeArrest'

export default { component: ArresteeArrest }

export const  generated = () => {
  return <ArresteeArrest
    arresteeArrest={{
      id: 1,
      date: '2020-01-01T12:34:45Z',
      location: 'downtown',
      arrestee: {
        first_name: 'First',
        last_name: 'Last'
      },
      createdAt: '2020-01-01T12:34:45Z',
      updatedAt: '2020-01-01T12:34:45Z',
      updatedBy: {
        name: 'TheUser'
      }
    }}
    />
}
