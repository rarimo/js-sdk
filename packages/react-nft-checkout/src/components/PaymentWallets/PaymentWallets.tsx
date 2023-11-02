import {
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material'
import type { ProviderProxyConstructor } from '@rarimo/provider'
import { CoinbaseProvider, MetamaskProvider } from '@rarimo/providers-evm'
import { useCallback } from 'react'

import { CheckoutModal, ErrorText } from '@/components'
import { useDappContext } from '@/hooks'

import styles from '../../styles/PaymentWallets.module.css'

const PROVIDERS_DATA = [
  {
    proxy: MetamaskProvider,
    name: 'MetaMask',
    icon: 'https://raw.githubusercontent.com/rarimo/js-sdk/main/assets/logos/metamask.png',
  },
  {
    proxy: CoinbaseProvider,
    name: 'Coinbase',
    icon: 'https://raw.githubusercontent.com/rarimo/js-sdk/main/assets/logos/coinbase.png',
  },
]

/**
 * @description A list of the wallets detected in the user's browser
 * @group Components
 */
const PaymentWallets = () => {
  const { provider, setSelectedProviderProxy, createProviderError } =
    useDappContext()

  const connectProvider = useCallback(
    (proxy: ProviderProxyConstructor) => {
      setSelectedProviderProxy(() => proxy)
    },
    [setSelectedProviderProxy],
  )

  return (
    <>
      {provider?.address ? (
        <CheckoutModal />
      ) : (
        <>
          <Typography fontWeight="bold" variant="h6">
            Choose your payment wallet
          </Typography>

          <Divider />

          <List>
            {PROVIDERS_DATA.map(providerData => (
              <ListItemButton
                key={providerData.name}
                onClick={() => connectProvider(providerData.proxy)}
              >
                <ListItemIcon>
                  <img
                    className={styles.ListItemIcon}
                    src={providerData.icon}
                    width={38}
                    height={38}
                    alt={`${providerData.name} icon`}
                  />
                </ListItemIcon>
                <ListItemText primary={providerData.name} />
              </ListItemButton>
            ))}
          </List>

          {createProviderError && <ErrorText text={createProviderError} />}
        </>
      )}
    </>
  )
}

export default PaymentWallets
