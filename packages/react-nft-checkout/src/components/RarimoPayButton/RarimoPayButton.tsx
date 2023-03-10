import { Theme, ThemeProvider } from '@mui/material'
import { useState } from 'react'

import { AppButton, AppButtonProps, RarimoPayDialog } from '@/components'
import { defaultTheme } from '@/theme'

interface Props extends AppButtonProps {
  muiTheme?: Theme
}

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
