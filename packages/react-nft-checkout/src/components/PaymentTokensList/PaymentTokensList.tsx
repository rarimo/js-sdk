import {
  Avatar,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
} from '@mui/material'
import { PaymentToken } from '@rarimo/nft-checkout'
import { EthProviderRpcError } from '@rarimo/provider'
import { useEffect, useState } from 'react'

import { ErrorText, LoadingIndicator } from '@/components'
import { useDappContext } from '@/hooks'

const PaymentTokensList = () => {
  const {
    selectedChain,
    loadPaymentTokens,
    selectedPaymentToken,
    setSelectedPaymentToken,
    provider,
  } = useDappContext()

  const [isLoading, setIsLoading] = useState(true)
  const [loadingErrorText, setLoadingErrorText] = useState('')
  const [tokens, setTokens] = useState<PaymentToken[]>([])

  useEffect(() => {
    const fetchPaymentTokens = async () => {
      try {
        setIsLoading(true)
        setLoadingErrorText('')

        const paymentTokens = selectedChain
          ? (await loadPaymentTokens?.(selectedChain)) ?? []
          : []
        setTokens(paymentTokens)
      } catch (error) {
        setLoadingErrorText(
          (error as unknown as EthProviderRpcError)?.message ||
            'An error occurred while loading tokens. Change the network or try again later.',
        )
      }
      setIsLoading(false)
    }

    fetchPaymentTokens()
  }, [loadPaymentTokens, selectedChain, provider])

  useEffect(() => {
    setSelectedPaymentToken(undefined)

    return () => {
      setSelectedPaymentToken(undefined)
    }
  }, [selectedChain, setSelectedPaymentToken])

  return (
    <>
      {loadingErrorText ? (
        <ErrorText text={loadingErrorText} />
      ) : (
        <>
          {isLoading ? (
            <LoadingIndicator text="Loading payment tokens" />
          ) : (
            <>
              {tokens.length ? (
                <List>
                  {tokens.map(paymentToken => {
                    const tokenLogoUri = paymentToken.logoURI?.replace(
                      'ipfs://',
                      'https://ipfs.io/ipfs/',
                    )

                    return (
                      <ListItemButton
                        selected={
                          selectedPaymentToken?.symbol === paymentToken.symbol
                        }
                        key={paymentToken.symbol}
                        onClick={() => setSelectedPaymentToken(paymentToken)}
                      >
                        <ListItemAvatar>
                          <Avatar>
                            <img src={tokenLogoUri} width={40} alt="" />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={paymentToken.name}
                          secondary={paymentToken.symbol}
                          primaryTypographyProps={{
                            sx: {
                              fontWeight: 600,
                            },
                          }}
                          secondaryTypographyProps={{
                            sx: {
                              color: 'rgba(0, 0, 0, 0.3)',
                            },
                          }}
                        />
                        {paymentToken.balance}
                      </ListItemButton>
                    )
                  })}
                </List>
              ) : (
                <ErrorText text="No supported token was found in the user's wallet. Please add supported tokens." />
              )}
            </>
          )}
        </>
      )}
    </>
  )
}

export default PaymentTokensList
