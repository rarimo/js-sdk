import { Dialog, DialogContent } from '@mui/material'
import { Cancel } from 'iconoir-react'

import PaymentWallets from '@/components/PaymentWallets'

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
