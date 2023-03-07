import {
  Avatar,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
} from '@mui/material'
import { ChainNames, PaymentToken } from '@rarimo/nft-checkout'
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
  const [isLoadFailed, setIsLoadFailed] = useState(false)
  const [tokens, setTokens] = useState<PaymentToken[]>([])

  useEffect(() => {
    const fetchPaymentTokens = async () => {
      try {
        setIsLoading(true)
        setIsLoadFailed(false)
        if (!selectedChain) {
          setTokens([])
        } else {
          const paymentTokens = await loadPaymentTokens?.(selectedChain)
          setTokens(paymentTokens?.filter(token => Number(token.balance)) || [])
        }
      } catch (error) {
        setIsLoadFailed(true)
        provider?.switchChain(ChainNames.Goerli)
      }
      setIsLoading(false)
    }

    fetchPaymentTokens()
  }, [loadPaymentTokens, selectedChain, provider])

  useEffect(() => {
    return () => {
      setSelectedPaymentToken(undefined)
    }
  }, [setSelectedPaymentToken])

  return (
    <>
      {isLoadFailed ? (
        <ErrorText text="An error occurred while loading tokens. Change network or try again later." />
      ) : (
        <>
          {isLoading ? (
            <LoadingIndicator text="Loading payment tokens" />
          ) : (
            <>
              {tokens.length ? (
                <List
                  sx={{
                    width: '100%',
                    bgcolor: 'background.paper',
                    position: 'relative',
                    overflow: 'auto',
                    maxHeight: 300,
                  }}
                >
                  {tokens.map(paymentToken => {
                    let tokenLogoUri = paymentToken.logoURI?.replace(
                      'ipfs://',
                      'https://ipfs.io/ipfs/',
                    )

                    if (paymentToken.symbol === 'WETH')
                      tokenLogoUri =
                        'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png'

                    return (
                      <ListItemButton
                        selected={
                          selectedPaymentToken?.symbol === paymentToken.symbol
                        }
                        key={paymentToken.symbol}
                        style={{
                          borderRadius: 8,
                          padding: 4,
                        }}
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
                <ErrorText text="No supported token found in user wallet. Please add supported tokens." />
              )}
            </>
          )}
        </>
      )}
    </>
  )
}

export default PaymentTokensList
