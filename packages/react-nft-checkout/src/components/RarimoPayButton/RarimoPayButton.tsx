import { ThemeOptions, ThemeProvider } from '@mui/material'
import createTheme from '@mui/material/styles/createTheme'
import { useState } from 'react'

import { AppButton, AppButtonProps, RarimoPayDialog } from '@/components'
import { componentsTheme, paletteTheme, typographyTheme } from '@/theme'

interface Props extends AppButtonProps {
  theme?: ThemeOptions
}

// Typedoc does not appear to render these props correctly because of the destructured parameter, so I made them a bulleted list.
// See https://typedoc.org/tags/param/#destructured-parameters

/**
 * @description A Buy button that starts a Rarimo transaction
 * @group Components
 *
 * @param props The properties for the component, including:
 * - `text`: The text for the button
 * - `onClick`: The function to run when the user clicks; by default, the button opens the {@link RarimoPayDialog} component
 * - `muiTheme`: The Material UI theme to apply
 */
const RarimoPayButton = ({ theme, ...props }: Props) => {
  const [isVisibleSupportedChains, setIsVisibleSupportedChains] =
    useState(false)

  theme ||= {}

  const muiTheme = createTheme({
    ...theme,
    palette: {
      ...paletteTheme,
      ...(theme?.palette ?? {}),
    },
    components: {
      ...componentsTheme,
      ...(theme?.components ?? {}),
    },
    typography: {
      ...typographyTheme,
      ...(theme?.typography ?? {}),
    },
  })

  return (
    <ThemeProvider theme={muiTheme}>
      <AppButton onClick={() => setIsVisibleSupportedChains(true)} {...props}>
        Buy with Rarimo
      </AppButton>

      {isVisibleSupportedChains && (
        <RarimoPayDialog
          open={isVisibleSupportedChains}
          handleCloseDialog={() => setIsVisibleSupportedChains(false)}
        />
      )}
    </ThemeProvider>
  )
}

export default RarimoPayButton
