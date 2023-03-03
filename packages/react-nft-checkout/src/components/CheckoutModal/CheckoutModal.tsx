import { Divider, Typography } from '@mui/material'
import { EstimatedPrice } from '@rarimo/nft-checkout'
import { useEffect, useMemo, useState } from 'react'

import {
  AppButton,
  ErrorText,
  PaymentTokensList,
  PriceConversion,
  TransactionSummary,
} from '@/components'
import { useDappContext } from '@/context'

import styles from './CheckoutModal.module.css'

const CheckoutModal = () => {
  const { selectedPaymentToken, checkout, estimatePrice } = useDappContext()

  const [isPriceLoading, setIsPriceLoading] = useState(true)
  const [estimatedPrice, setEstimatedPrice] = useState<
    EstimatedPrice | undefined
  >()
  const [isTransactionProcessing, setIsTransactionProcessing] = useState(false)
  const [txHash, setTxHash] = useState('')

  const isEnoughTokensForCheckout = useMemo(() => {
    /* FIXME */
    return (
      Number(selectedPaymentToken?.balance) >=
      Number(estimatedPrice?.price.value) /
        10 ** Number(estimatedPrice?.price.decimals)
    )
  }, [estimatedPrice, selectedPaymentToken])

  const onCheckoutHandler = async () => {
    if (!estimatedPrice) return

    setIsTransactionProcessing(true)

    const hash = await checkout({ price: estimatedPrice })
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

          <PaymentTokensList />

          {selectedPaymentToken && (
            <>
              <Divider />
              <PriceConversion
                isLoading={isPriceLoading}
                estimatedPrice={estimatedPrice}
              />
            </>
          )}

          {!isPriceLoading && selectedPaymentToken && (
            <>
              {isEnoughTokensForCheckout ? (
                <AppButton
                  className={styles.CheckoutButton}
                  text="Checkout"
                  disabled={!estimatedPrice}
                  onClick={onCheckoutHandler}
                />
              ) : (
                <ErrorText
                  text={`Not enough ${selectedPaymentToken?.symbol} tokens in wallet. Please select other token.`}
                />
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
