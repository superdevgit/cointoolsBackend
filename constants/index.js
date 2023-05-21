const swaps = [
  {
    name: "pancakeswap",
    title: "PancakeSwap",
    chainId: "56",
    // url: "https://api.thegraph.com/subgraphs/name/ookvic/pancakeswap-v2",
    url: "https://bsc.streamingfast.io/subgraphs/name/pancakeswap/exchange-v2",
    native: "BNB",
    volume: "tradeVolumeUSD",
    tokenList: "https://tokens.pancakeswap.finance/pancakeswap-extended.json",
    logo: "https://pancakeswap.finance/favicon.ico"
  },
  {
    name: "biswap",
    title: "Biswap",
    chainId: "56",
    url: "https://api.thegraph.com/subgraphs/name/biswapcom/exchange5",
    native: "BNB",
    volume: "tradeVolumeUSD",
    logo: "https://biswap.org/favicon.ico"
  },
  {
    name: "uniswap",
    title: "Uniswap",
    chainId: "1",
    url: "https://api.thegraph.com/subgraphs/name/ianlapham/uniswapv2",
    native: "ETH",
    volume: "tradeVolumeUSD",
    tokenList: "https://tokens.coingecko.com/uniswap/all.json",
    logo: "https://uniswap.org/favicon.ico"
  },
  {
    name: "sushiswap",
    title: "Sushi Swap",
    chainId: "1",
    url: "https://api.thegraph.com/subgraphs/name/sushiswap/exchange",
    native: "ETH",
    volume: "volumeUSD",
    tokenList: "https://token-list.sushi.com",
    logo: "https://www.sushi.com/favicon.ico"
  },
  {
    name: "binance",
    title: "Binance",
    logo: "https://bin.bnbstatic.com/static/images/common/favicon.ico"
  },
  {
    name: "kucoin",
    title: "Kucoin",
    logo: "https://assets.staticimg.com/cms/media/7AV75b9jzr9S8H3eNuOuoqj8PwdUjaDQGKGczGqTS.png"
  },
  {
    name: "gate",
    title: "Gate.io",
    logo: "https://www.gate.io/favicon.ico"
  }
]

const cointoosContract = '0xe7AFA3e3976268dF764a75D69Cc2e8eFc154a668'
module.exports = {
  swaps,
  cointoosContract
}