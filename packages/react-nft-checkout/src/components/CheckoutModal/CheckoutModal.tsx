import { BN } from '@distributedlab/tools'
import { Divider, Typography } from '@mui/material'
import type { EstimatedPrice } from '@rarimo/nft-checkout'
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

/**
 * @description A window that shows the transaction details and allows the user to confirm the transaction
 * @group Components
 */
const CheckoutModal = () => {
  const {
    isInitialized,
    selectedPaymentToken,
    selectedSwapToken,
    checkout,
    provider,
    estimatePrice,
    createCheckoutTransactionBundleCb,
  } = useDappContext()

  const [isPriceLoading, setIsPriceLoading] = useState(true)
  const [estimatedPrice, setEstimatedPrice] = useState<
    EstimatedPrice | undefined
  >()
  const [isTransactionProcessing, setIsTransactionProcessing] = useState(false)
  const [txHash, setTxHash] = useState('')

  const isEnoughTokensForCheckout = useMemo(() => {
    if (!selectedPaymentToken || !estimatedPrice) return false

    return BN.fromRaw(
      selectedPaymentToken.isNative
        ? selectedPaymentToken.balance
        : selectedPaymentToken.balanceRaw.value,
      selectedPaymentToken.decimals,
    ).isGreaterThanOrEqualTo(
      BN.fromBigInt(estimatedPrice.price.value, estimatedPrice.price.decimals),
    )
  }, [estimatedPrice, selectedPaymentToken])

  const onCheckoutHandler = async () => {
    const bundle = createCheckoutTransactionBundleCb?.(provider?.address ?? '')
    if (!estimatedPrice || !bundle) return

    setIsTransactionProcessing(true)

    const hash = await checkout?.(estimatedPrice, { bundle })
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

          {isInitialized && selectedSwapToken && <PaymentTokensList />}

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
