import { Dialog, DialogContent } from '@mui/material'
import { Cancel } from 'iconoir-react'

import { PaymentWallets } from '@/components'

/**
 * @description A dialog box that prompts the user to select a wallet and token to pay with via the {@link PaymentWallets} component and then the {@link PaymentTokensList} component
 *
 * @param props.open Whether to show the dialog or not
 * @param props.handleCloseDialog A function that runs when the user clicks the cancel button
 */
const RarimoPayDialog = ({
  open,
  handleCloseDialog,
}: {
  open: boolean
  handleCloseDialog: () => void
}) => {
  return (
    <Dialog
      onClose={handleCloseDialog}
      fullWidth
      open={open}
      PaperProps={{
        style: { borderRadius: 25 },
      }}
    >
      <Cancel
        style={{ position: 'absolute', right: 24, cursor: 'pointer', top: 24 }}
        onClick={handleCloseDialog}
      />
      <DialogContent
        style={{
          padding: 48,
          display: 'flex',
          flexDirection: 'column',
          gridGap: 10,
        }}
      >
        <PaymentWallets />
      </DialogContent>
    </Dialog>
  )
}

export default RarimoPayDialog
