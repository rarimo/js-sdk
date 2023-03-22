import { Box, Card, CircularProgress, Divider, Typography } from '@mui/material'
import { EstimatedPrice } from '@rarimo/nft-checkout'

import { useDappContext } from '@/hooks'

type Props = {
  isTransactionProcessing: boolean
  txHash: string
  estimatedPrice?: EstimatedPrice
}

/**
 * @description Information about the completed transaction
 * @group Components
 *
 * @param props The properties for the component, including:
 * - `isTransactionProcessing`: True if the transaction is not yet complete
 * - `txHash`: The transaction hash
 * - `estimatedPrice`: An {@link @rarimo/nft-checkout!EstimatedPrice} object with information about the transaction price
 */
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
          gap={2}
          sx={{
            color: 'secondary.main',
          }}
        >
          <Box display="flex" flexDirection="column" gap={3}>
            <Card sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="subtitle1">Spent:</Typography>
              <Typography variant="subtitle1">
                {`${targetNft.price} ${checkoutOperation?.chainFrom?.token.symbol} = ${estimatedPrice.price} ${estimatedPrice.price.symbol}`}
              </Typography>
            </Card>
          </Box>
          <Box>
            <Box
              display="flex"
              flexDirection="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="caption">Transaction ID:</Typography>
              <Typography
                variant="caption"
                sx={{
                  color: 'success.main',
                  fontWeight: 'bold',
                  fontStyle: 'normal',
                }}
              >
                Confirmed
              </Typography>
            </Box>
            <Divider />
            <Typography variant="caption">{txHash}</Typography>
          </Box>
          <Box>
            <Typography variant="caption">Receiving address:</Typography>
            <Divider />
            <Typography variant="caption">{provider?.address}</Typography>
          </Box>
        </Box>
      )}
    </>
  )
}

export default TransactionSummary
