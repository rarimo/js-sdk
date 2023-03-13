import createTheme from '@mui/material/styles/createTheme'

import { componentsTheme } from '@/theme/components.theme'
import { paletteTheme } from '@/theme/palette.theme'
import { typographyTheme } from '@/theme/typography.theme'

export const defaultTheme = createTheme({
  palette: paletteTheme,
  components: componentsTheme,
  typography: typographyTheme,
})
