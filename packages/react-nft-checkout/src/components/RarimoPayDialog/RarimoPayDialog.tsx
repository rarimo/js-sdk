import { Dialog, DialogContent } from '@mui/material'
import { Cancel } from 'iconoir-react'

import { PaymentWallets } from '@/components'
import styles from '@/styles/RarimoPayDialog.module.css'

/**
 * @description A dialog box that prompts the user to select a wallet and token to pay with via the {@link PaymentWallets} component and then the {@link PaymentTokensList} component
 * @group Components
 *
 * @param props The properties for the component, including:
 * - `open`: Whether to show the dialog or not
 * - `handleCloseDialog`: A function that runs when the user clicks the cancel button
 */
const RarimoPayDialog = ({
  open,
  handleCloseDialog,
}: {
  open: boolean
  handleCloseDialog: () => void
}) => {
  return (
    <Dialog onClose={handleCloseDialog} fullWidth open={open}>
      <Cancel className={styles.CloseButton} onClick={handleCloseDialog} />
      <DialogContent>
        <PaymentWallets />
      </DialogContent>
    </Dialog>
  )
}

export default RarimoPayDialog
