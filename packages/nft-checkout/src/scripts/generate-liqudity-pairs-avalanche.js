const sdk = require("@traderjoe-xyz/sdk");
const { Fetcher } = require("@distributedlab/fetcher");
const { Token: TJToken } = require("@traderjoe-xyz/sdk/dist");
const { ethers } = require("ethers");
const fs = require("fs");
const DEFAULT_FETCHER_CONFIG = {
  credentials: "omit",
  referrerPolicy: "no-referrer",
};
const FUJI_CHAIN = 43113;
const AVALANCHE_CHAIN = 43114;
const AVALANCHE_RPC_URL = "https://avalanche.public-rpc.com";
const FUJI_RPC_URL = "https://rpc.ankr.com/avalanche_fuji";

const response = async (rawUrl) => {
  const url = new URL(rawUrl);

  const fetcher = new Fetcher({
    baseUrl: url.origin,
    ...DEFAULT_FETCHER_CONFIG,
  });
  return fetcher.get(url.pathname);
};
const createPairForOneChain = async (tokenList) => {
  let result = [];

  for (const [index, tokenA] of tokenList.entries()) {
    for (const tokenB of tokenList) {
      if (tokenA.address !== tokenB.address) {
        const tokenOne = new TJToken(
          Number(tokenA.chainId),
          tokenA.address,
          tokenA.decimals,
          tokenA.symbol,
          tokenA.name,
        );

        const tokenTwo = new TJToken(
          Number(tokenB.chainId),
          tokenB.address,
          tokenB.decimals,
          tokenB.symbol,
          tokenB.name,
        );

        try {
          const pair = await sdk.Fetcher.fetchPairData(
            tokenOne,
            tokenTwo,
            getProvider(tokenA.chainId),
          );
          result.push(pair);
        } catch (e) {
          console.log(e, tokenA, tokenB);
        }
      } else tokenList.splice(index, 1);
    }
  }
  return result;
};
const getProvider = (chain) => new ethers.providers.JsonRpcProvider(chain === FUJI_CHAIN ? FUJI_RPC_URL : AVALANCHE_RPC_URL);
const generatePairs = async (tokenListUrls) => {
  let tokenLists = [];
  let resultArray = [];

  for (const url of tokenListUrls) {
    tokenLists = (await response(url)).data.tokens;

    tokenLists = tokenLists.filter((item, index) => {
      const currentIndex = tokenLists.findIndex((element) => element.address === item.address);
      return index === currentIndex;
    });
    const tokenListFuji = tokenLists.filter((item) => item.chainId === FUJI_CHAIN);
    resultArray = resultArray.concat(await createPairForOneChain(tokenListFuji));
    const tokenListAvalanche = tokenLists.filter((item) => item.chainId === AVALANCHE_CHAIN);
    resultArray = resultArray.concat(await createPairForOneChain(tokenListAvalanche));
  }
  const jsonData = JSON.stringify(resultArray, null, 2);
  fs.writeFileSync("liquidity-pairs-avalanche.json", jsonData);
};

generatePairs(["https://raw.githubusercontent.com/traderjoe-xyz/joe-tokenlists/main/mc.tokenlist.json"]);
