import { BN } from '@distributedlab/tools'
import { Box, CircularProgress, Divider, Typography } from '@mui/material'
import { EstimatedPrice } from '@rarimo/nft-checkout'

import { useDappContext } from '@/hooks'

type Props = {
  isTransactionProcessing: boolean
  txHash: string
  estimatedPrice?: EstimatedPrice
}

const TransactionSummary = ({
  isTransactionProcessing,
  txHash,
  estimatedPrice,
}: Props) => {
  const { targetNft, checkoutOperation, provider } = useDappContext()

  return (
    <>
      <Typography fontWeight="bold" variant="h6">
        Transaction summary
      </Typography>
      {isTransactionProcessing && (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
          gap={1}
          marginTop={1.5}
        >
          <CircularProgress />
          <Typography>Transaction processing</Typography>
        </Box>
      )}
      {txHash && targetNft && estimatedPrice && (
        <Box
          display="flex"
          flexDirection="column"
          sx={{
            color: '#99a0c0',
          }}
          gap={2}
        >
          <Box display="flex" flexDirection="column" gap={3}>
            <Box
              display="flex"
              flexDirection="row"
              justifyContent="space-between"
              sx={{
                '>p': {
                  color: '#99a0c0',
                  fontWeight: 'bold',
                },
                border: '1px solid rgba(0, 0, 0, 0.12)',
                padding: 1.5,
                borderRadius: 1.5,
                background: '#f4f6fd',
                color: '#99a0c0',
              }}
            >
              <Typography>Spent:</Typography>
              <Typography>
                {`${BN.fromBigInt(
                  targetNft.price.value,
                  targetNft.price.decimals,
                )} ${
                  checkoutOperation?.chainFrom?.token.symbol
                } = ${BN.fromBigInt(
                  estimatedPrice.price.value,
                  estimatedPrice.price.decimals,
                )} ${estimatedPrice.price.symbol}`}
              </Typography>
            </Box>
          </Box>
          <Box>
            <Box
              display="flex"
              flexDirection="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="caption" sx={{ fontStyle: 'italic' }}>
                Transaction ID:
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: '#9ce680', fontWeight: 'bold' }}
              >
                Confirmed
              </Typography>
            </Box>
            <Divider />
            <Typography variant="caption" sx={{ fontStyle: 'italic' }}>
              {txHash}
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" sx={{ fontStyle: 'italic' }}>
              Receiving address:
            </Typography>
            <Divider />
            <Typography variant="caption" sx={{ fontStyle: 'italic' }}>
              {provider?.address}
            </Typography>
          </Box>
        </Box>
      )}
    </>
  )
}

export default TransactionSummary
