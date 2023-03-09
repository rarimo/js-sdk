import { useState } from 'react'

import { AppButton, AppButtonProps, RarimoPayDialog } from '@/components'

const RarimoPayButton = (props: AppButtonProps) => {
  const [isVisibleSupportedChains, setIsVisibleSupportedChains] =
    useState(false)

  return (
    <>
      <AppButton
        text="Buy with Rarimo"
        onClick={() => setIsVisibleSupportedChains(true)}
        {...props}
      />
      {isVisibleSupportedChains && (
        <RarimoPayDialog
          open={isVisibleSupportedChains}
          handleCloseDialog={() => setIsVisibleSupportedChains(false)}
        />
      )}
    </>
  )
}

export default RarimoPayButton
