import { Box, Divider, Typography } from '@mui/material'
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
        estimatedPrice && (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              border: '1px solid rgba(0, 0, 0, 0.12)',
              padding: 1.5,
              borderRadius: 1.5,
              marginTop: 1,
              background: '#f4f6fd',
              color: '#99a0c0',
            }}
            gap={1}
          >
            <Box
              sx={{ display: 'flex', flexDirection: 'column' }}
              justifyContent="space-between"
              gap={1}
            >
              <Box
                display="flex"
                flexDirection="row"
                justifyContent="space-between"
                sx={{
                  '>p': {
                    color: '#99a0c0',
                    fontWeight: 'bold',
                  },
                }}
              >
                <Typography>Price conversion</Typography>
                <Typography>
                  {/* FIXME */}
                  {`${
                    Number(targetNft.price.value) /
                    10 ** targetNft.price.decimals
                  } ${checkoutOperation?.chainFrom?.token.symbol} = ${
                    Number(estimatedPrice.price.value) /
                    10 ** estimatedPrice.price.decimals
                  } ${estimatedPrice.price.symbol}`}
                </Typography>
              </Box>
              <Divider />
            </Box>
            {estimatedPrice.impact && (
              <Box display="flex" justifyContent="space-between">
                <Typography variant="caption" sx={{ fontStyle: 'italic' }}>
                  Price Impact
                </Typography>
                <Typography variant="caption" sx={{ fontStyle: 'italic' }}>
                  {`${estimatedPrice.impact}%`}
                </Typography>
              </Box>
            )}
            {estimatedPrice.gasPriceInUSD && (
              <Box display="flex" justifyContent="space-between">
                <Typography variant="caption" sx={{ fontStyle: 'italic' }}>
                  Network Fees
                </Typography>
                <Typography variant="caption" sx={{ fontStyle: 'italic' }}>
                  ${estimatedPrice.gasPriceInUSD}
                </Typography>
              </Box>
            )}
          </Box>
        )
      )}
    </>
  )
}

export default PriceConversion
