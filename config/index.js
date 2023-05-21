const ACCESS_TOKEN = 'b11dc877f55b9819906f7a57e9bba6bd'
const V_ORIGIN = ["https://www.cointools.io", "https://cointools.io", "http://localhost:3000", "http://3.99.83.65", "https://cointools-v2.netlify.app"]
const GRAPH_SERVER = {
  "pancakeswap": {
    "url": "https://bsc.streamingfast.io/subgraphs/name/pancakeswap/exchange-v2",
    "native": "BNB"
  },
  "biswap": {
    "url": "https://api.thegraph.com/subgraphs/name/biswapcom/exchange5",
    "native": "BNB"
  },
  "apeswap": {
    "url": "https://bnb.apeswapgraphs.com/subgraphs/name/ape-swap/apeswap-subgraph",
    "native": "ETH"
  }
}

const FAST_INTERVAL = 10000;

module.exports = {
  ACCESS_TOKEN,
  V_ORIGIN,
  GRAPH_SERVER,
  FAST_INTERVAL
}