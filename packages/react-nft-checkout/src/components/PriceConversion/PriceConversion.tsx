import { Box, Card, Divider, Typography } from '@mui/material'
import { EstimatedPrice } from '@rarimo/nft-checkout'

import { LoadingIndicator } from '@/components'
import { useDappContext } from '@/hooks'

type Props = {
  isLoading: boolean
  estimatedPrice?: EstimatedPrice
}

const PriceConversion = ({ isLoading, estimatedPrice }: Props) => {
  const { targetNft, checkoutOperation } = useDappContext()

  return (
    <>
      {isLoading ? (
        <LoadingIndicator text="Fetching best price" />
      ) : (
        estimatedPrice &&
        targetNft && (
          <Card
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
              mt: 1,
            }}
          >
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="space-between"
            >
              <Box
                display="flex"
                flexDirection="row"
                justifyContent="space-between"
              >
                <Typography variant="subtitle1">Price conversion</Typography>
                <Typography variant="subtitle1">
                  {`${targetNft.price} ${checkoutOperation?.chainFrom?.token.symbol} = ${estimatedPrice.price} ${estimatedPrice.price.symbol}`}
                </Typography>
              </Box>
            </Box>
            <Divider />
            {estimatedPrice.impact && (
              <Box display="flex" justifyContent="space-between">
                <Typography variant="caption">Price Impact</Typography>
                <Typography variant="caption">
                  {`${estimatedPrice.impact}%`}
                </Typography>
              </Box>
            )}
            {estimatedPrice.gasPriceInUSD && (
              <Box display="flex" justifyContent="space-between">
                <Typography variant="caption">Network Fees</Typography>
                <Typography variant="caption">
                  ${estimatedPrice.gasPriceInUSD}
                </Typography>
              </Box>
            )}
          </Card>
        )
      )}
    </>
  )
}

export default PriceConversion
