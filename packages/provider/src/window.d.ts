import Web3 from 'web3'

declare global {
  interface Window {
    Web3: typeof Web3
  }
}
