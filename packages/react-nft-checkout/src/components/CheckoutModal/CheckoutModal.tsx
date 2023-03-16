import { BN } from '@distributedlab/tools'
import { Divider, Typography } from '@mui/material'
import { EstimatedPrice } from '@rarimo/nft-checkout'
import { useEffect, useMemo, useState } from 'react'

import {
  AppButton,
  BridgeChainSelect,
  ErrorText,
  PaymentTokensList,
  PriceConversion,
  TransactionSummary,
} from '@/components'
import { useDappContext } from '@/hooks'

const CheckoutModal = () => {
  const {
    isInitialized,
    selectedPaymentToken,
    checkout,
    estimatePrice,
    checkoutTxBundle,
  } = useDappContext()

  const [isPriceLoading, setIsPriceLoading] = useState(true)
  const [estimatedPrice, setEstimatedPrice] = useState<
    EstimatedPrice | undefined
  >()
  const [isTransactionProcessing, setIsTransactionProcessing] = useState(false)
  const [txHash, setTxHash] = useState('')

  const isEnoughTokensForCheckout = useMemo(() => {
    if (!selectedPaymentToken || !estimatedPrice) return false

    return BN.fromBigInt(
      selectedPaymentToken.balance,
      1,
    ).isGreaterThanOrEqualTo(
      BN.fromBigInt(estimatedPrice.price.value, estimatedPrice.price.decimals),
    )
  }, [estimatedPrice, selectedPaymentToken])

  const onCheckoutHandler = async () => {
    if (!estimatedPrice || !checkoutTxBundle) return

    setIsTransactionProcessing(true)

    const hash = await checkout?.(estimatedPrice, { bundle: checkoutTxBundle })
    if (hash) {
      setTxHash(hash)
    }
    setIsTransactionProcessing(false)
  }

  useEffect(() => {
    if (!selectedPaymentToken || !estimatePrice) return

    const fetchPrice = async () => {
      setIsPriceLoading(true)
      const price = await estimatePrice(selectedPaymentToken)
      setEstimatedPrice(price)
      setIsPriceLoading(false)
    }

    fetchPrice()
  }, [estimatePrice, selectedPaymentToken])

  return (
    <>
      {!isTransactionProcessing && !txHash && (
        <>
          <Typography fontWeight="bold" variant="h6">
            Choose your payment token
          </Typography>
          <Divider />

          <BridgeChainSelect />

          {isInitialized && <PaymentTokensList />}

          {selectedPaymentToken && (
            <>
              <Divider />
              <PriceConversion
                isLoading={isPriceLoading}
                estimatedPrice={estimatedPrice}
              />
              {!isPriceLoading && (
                <>
                  {isEnoughTokensForCheckout ? (
                    <AppButton
                      sx={{ mt: '1rem' }}
                      disabled={!estimatedPrice}
                      onClick={onCheckoutHandler}
                    >
                      Checkout
                    </AppButton>
                  ) : (
                    <ErrorText
                      text={`Not enough ${selectedPaymentToken?.symbol} tokens in the wallet balance. Please select other token.`}
                    />
                  )}
                </>
              )}
            </>
          )}
        </>
      )}

      {(isTransactionProcessing || txHash) && (
        <TransactionSummary
          isTransactionProcessing={isTransactionProcessing}
          txHash={txHash}
          estimatedPrice={estimatedPrice}
        />
      )}
    </>
  )
}

export default CheckoutModal
