import axios from 'axios'

export const useNFT = async () => {
  const { data } = await axios.get(
    'https://api.demo.rarimo.com/marketplace/nft',
  )

  let nftInfo: {
    price: number
    name: string
    image: string
    priceInUsd: number
  }

  nftInfo = {
    image: '',
    name: '',
    price: 0,
    priceInUsd: 0,
  }
  if (data) {
    nftInfo = {
      image: data.image,
      name: data.name,
      price: parseFloat(data?.original_price?.price),
      priceInUsd: parseFloat(data?.usd_price),
    }
  }

  return {
    nftInfo,
    // isLoading: !error && !data,
    // isError: error,
  }
}
