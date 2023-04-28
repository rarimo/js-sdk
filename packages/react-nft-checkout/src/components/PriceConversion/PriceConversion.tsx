import { Box, Card, Divider, Typography } from '@mui/material'
import type { EstimatedPrice } from '@rarimo/nft-checkout'

import { LoadingIndicator } from '@/components'
import { useDappContext } from '@/hooks'

type Props = {
  isLoading: boolean
  estimatedPrice?: EstimatedPrice
}

/**
 * @description Information about the fees for converting tokens
 * @group Components
 *
 * @param props The properties for the component, including:
 * - `isLoading`: True if the component is loading and false if it is ready
 * - `estimatedPrice`: An {@link @rarimo/nft-checkout!EstimatedPrice} object with information about the transaction price
 */
const PriceConversion = ({ isLoading, estimatedPrice }: Props) => {
  const { targetNft } = useDappContext()

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
                  {`${targetNft.price} ${estimatedPrice.to?.symbol} = ${estimatedPrice.price} ${estimatedPrice.price.symbol}`}
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
