import { Theme, ThemeProvider } from '@mui/material'
import { useState } from 'react'

import { AppButton, AppButtonProps, RarimoPayDialog } from '@/components'
import { defaultTheme } from '@/theme'

interface Props extends AppButtonProps {
  muiTheme?: Theme
}

/**
 * @description A Buy button that starts a Rarimo transaction
 *
 * @param props.text The text for the button; the default is "Buy with Rarimo"
 * @param props.onClick The function to run when the user clicks; by default, the button opens the {@link RarimoPayDialog} component
 */
const RarimoPayButton = ({ muiTheme, ...props }: Props) => {
  const [isVisibleSupportedChains, setIsVisibleSupportedChains] =
    useState(false)

  return (
    <ThemeProvider theme={muiTheme || defaultTheme}>
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
