import { useState } from 'react'

import Button, { ButtonProps } from '@/components/Button'
import RarimoPayDialog from '@/components/RarimoPayDialog'

const RarimoPayButton = (props: ButtonProps) => {
  const [isVisibleSupportedChains, setIsVisibleSupportedChains] =
    useState(false)

  return (
    <>
      <Button
        {...props}
        label={props?.label || 'Buy with Rarimo'}
        onClick={() => setIsVisibleSupportedChains(true)}
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
