import createTheme from '@mui/material/styles/createTheme'

import { componentsTheme } from '@/theme/components.theme'

export const defaultTheme = createTheme({
  components: componentsTheme,
  typography: {
    caption: {
      fontStyle: 'italic',
    },
  },
})
