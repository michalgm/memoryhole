import ThemeTest from './ThemeTest'

export const Primary = {
  args: {
    size: 'x-small',
  },
}

export const Small = {
  args: {
    size: 'small',
  },
}

export const Large = {
  args: {
    size: 'large',
  },
}

export const WithDarkTheme = {
  parameters: {
    backgrounds: {
      default: 'dark',
    },
  },
}

const meta = {
  component: ThemeTest,
  tags: ['autodocs'],

  argTypes: {
    size: {
      options: ['x-small', 'small', 'medium', 'large'],
      control: { type: 'radio' },
    },
    color: {
      options: ['primary', 'secondary', 'info', 'warning', 'success', 'error'],
    },
  },
}

export default meta
