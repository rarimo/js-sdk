import { nftCheckoutContext } from '@/context'

export * from '@/types'
export * from '@/enums'

export const purchaseWithAnyToken = nftCheckoutContext.purchaseWithAnyToken
export const getEstimatedPrice =
  nftCheckoutContext.userWalletTokenBalances?.getEstimatedPrice
export const checkout = nftCheckoutContext.userWalletTokenBalances?.checkout
