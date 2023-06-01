const fetcher = require('@traderjoe-xyz/sdk')
const { Fetcher } = require('@distributedlab/fetcher')
const { Token: TJToken } = require("@traderjoe-xyz/sdk/dist");
const { ethers } = require("ethers")
const fs = require('fs');
const DEFAULT_FETCHER_CONFIG = {
  credentials: 'omit',
  referrerPolicy: 'no-referrer',
}
const FUJI_CHAIN = 43113
const AVALANCHE_CHAIN = 43114
const AVALANCHE_RPC_URL = 'https://avalanche.public-rpc.com'
const FUJI_RPC_URL = 'https://rpc.ankr.com/avalanche_fuji'

const getProvider = (chain) => chain === FUJI_CHAIN ? new ethers.providers.JsonRpcProvider(FUJI_RPC_URL) :
  new ethers.providers.JsonRpcProvider(AVALANCHE_RPC_URL)
const generatePairs = async (tokenListUrls) => {
  let tokenLists= []

  for (const url of tokenListUrls) {
    try {
      const response = async (rawUrl) => {
        const url = new URL(rawUrl)

        const fetcher = new Fetcher({
          baseUrl: url.origin,
          ...DEFAULT_FETCHER_CONFIG,
        })
        return fetcher.get(url.pathname)
      }
      let tokenList = (await response(url)).data
      tokenLists = [...tokenLists, ...tokenList.tokens]
    } catch (error) {
      throw new Error(error)
    }
  }
    tokenLists = Array.from(new Map(tokenLists.map(item => [item.address, item])).values());
  let resultArray =[]
    for(const tokenA of tokenLists){
      for(const tokenB of tokenLists){
        if(tokenA.address !== tokenB.address && tokenA.chainId === tokenB.chainId && (tokenA.chainId === AVALANCHE_CHAIN || tokenA.chainId === FUJI_CHAIN)){
          const tokenOne = new TJToken(
            Number(tokenA.chainId),
            tokenA.address,
            tokenA.decimals,
            tokenA.symbol,
            tokenA.name,
          )

          const tokenTwo = new TJToken(
            Number(tokenB.chainId),
            tokenB.address,
            tokenB.decimals,
            tokenB.symbol,
            tokenB.name,
          )

          try {
            const pair = await fetcher.Fetcher.fetchPairData(
              tokenOne,
              tokenTwo,
              getProvider(tokenA.chainId)
            )
            resultArray.push(pair)

          }
         catch (e){
           console.log(e, tokenA, tokenB);
         }
        }
        }
      }
  const jsonData = JSON.stringify(resultArray);
  fs.writeFileSync('liquidity-pairs-avalanche.json', jsonData);
}
generatePairs(['https://raw.githubusercontent.com/traderjoe-xyz/joe-tokenlists/main/mc.tokenlist.json'])
