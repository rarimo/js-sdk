import {
  FormControl,
  InputLabel,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material'
import { TARGET_TOKEN_SYMBOLS, Token } from '@rarimo/nft-checkout'
import { Network } from 'iconoir-react'
import { useEffect, useMemo, useState } from 'react'

import { ErrorText, LoadingIndicator } from '@/components'
import { useDappContext } from '@/hooks'
import styles from '@/styles/BridgeChainSelect.module.css'

const SwapTokensSelect = () => {
  const {
    getSupportedTokens,
    provider,
    selectedChain,
    setSelectedSwapToken,
    setSelectedPaymentToken,
    selectedSwapToken,
  } = useDappContext()

  const isDisabled = (token?: Token) => {
    if (token?.isNative) return true
    return Object.values(TARGET_TOKEN_SYMBOLS).some(i => i === token?.symbol)
  }
  const handleChange = (event: SelectChangeEvent) => {
    const selectedToken = tokens.find(
      token => token.symbol === event.target.value,
    )
    setSelectedPaymentToken(null)
    setSelectedSwapToken(selectedToken)
  }

  const value = useMemo(
    () => (selectedSwapToken ? String(selectedSwapToken.symbol) : ''),
    [selectedSwapToken],
  )

  const [isLoading, setIsLoading] = useState(true)
  const [loadingErrorText, setLoadingErrorText] = useState('')
  const [tokens, setTokens] = useState<Token[]>([])

  useEffect(() => {
    const fetchSupportedTokens = async () => {
      setLoadingErrorText('')
      setIsLoading(true)
      try {
        const supportedTokens = selectedChain
          ? (await getSupportedTokens?.(selectedChain)) ?? []
          : []
        setTokens(supportedTokens)
      } catch (error) {
        setLoadingErrorText(
          (error as Error)?.message ||
            'An error occurred while loading tokens. Change the network or try again later.',
        )
      }
      setIsLoading(false)
    }

    fetchSupportedTokens()
  }, [selectedChain, provider, getSupportedTokens])

  useEffect(() => {
    setSelectedSwapToken(undefined)

    return () => {
      setSelectedSwapToken(undefined)
    }
  }, [selectedChain, setSelectedSwapToken])

  return (
    <>
      {loadingErrorText ? (
        <ErrorText text={loadingErrorText} />
      ) : (
        <>
          {isLoading ? (
            <LoadingIndicator text="Loading supported tokens" />
          ) : (
            <>
              {tokens.length ? (
                <FormControl fullWidth sx={{ mt: 1 }}>
                  <InputLabel id="token-select-lbl">Select a token</InputLabel>
                  <Select
                    fullWidth
                    labelId="token-select-lbl"
                    value={value}
                    label="Select a token"
                    onChange={handleChange}
                  >
                    {tokens.map(swapToken => {
                      const tokenLogoUri = swapToken.logoURI?.replace(
                        'ipfs://',
                        'https://ipfs.io/ipfs/',
                      )

                      return (
                        <MenuItem
                          key={swapToken.symbol}
                          value={swapToken.symbol}
                          disabled={isDisabled(swapToken)}
                        >
                          <ListItemIcon
                            sx={{
                              minWidth: 40,
                            }}
                          >
                            {swapToken.logoURI ? (
                              <img
                                className={styles.ListItemIcon}
                                src={tokenLogoUri}
                                width={28}
                                height={28}
                                alt={`${swapToken.name} icon`}
                              />
                            ) : (
                              <Network className={styles.DefaultIcon} />
                            )}
                          </ListItemIcon>
                          <ListItemText
                            primary={swapToken.name}
                            sx={{
                              m: 0,
                            }}
                          />
                        </MenuItem>
                      )
                    })}
                  </Select>
                </FormControl>
              ) : (
                <ErrorText text="No supported token." />
              )}
            </>
          )}
        </>
      )}
    </>
  )
}

export default SwapTokensSelect
