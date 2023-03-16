import { Dialog, DialogContent } from '@mui/material'
import { Cancel } from 'iconoir-react'

import { PaymentWallets } from '@/components'

import styles from './RarimoPayDialog.module.css'

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
