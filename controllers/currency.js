const CurrencyService = require('../services/currency')

const getCurrencies = async (req, res, next) => {
  const { size = '100', page, search = '', allowed } = req.query
  try {
    const { currencies, length } = await CurrencyService.getCurrencies(Number(page), Number(size), search, allowed)
    res.status(200).json({ success: true, data: currencies, length, msg: "Get currency list success" })
  } catch (error) {
    res.status(502).json({ success: false, data: null, msg: error })
  }
}

const getCurrency = async (req, res, next) => {
  const { id } = req.params
  try {
    const currency = await CurrencyService.getCurrency(id)
    res.status(200).json({ success: true, data: currency, msg: "Get currency success" })
  } catch (error) {
    console.log('Error getting a currency:', error)
    res.status(502).json({ success: false, data: null, msg: error })
  }
}

const getAllCurrencies = async (req, res, next) => {
  try {
    let { data, length } = await CurrencyService.getAllCurrencies()
    data = (await CurrencyService.getAnalytics(data, true)).filter(currency => !!currency).sort((a, b) => (Number(b.marketCap || '0') - Number(a.marketCap || '0')))
    res.status(200).json({ success: true, data, length, msg: "Get currency list success" })
  } catch (error) {
    console.log('error:', error)
    res.status(502).json({ success: false, data: null, msg: error })
  }
}

const getCurrencyHistory = async (req, res, next) => {
  const { id } = req.query
  if (!id) {
    return res.status(404).json({ success: false, data: null, msg: "Bad Request" })
  }
  try {
    const history = await CurrencyService.getCurrencyById(id)
    if (!history) {
      return res.status(404).json({ success: false, data: null, msg: "Id does not exist" })
    }
    res.status(200).json({ success: true, data: history, msg: "Get history success" })
  } catch (error) {
    res.status(502).json({ success: false, data: null, msg: error })
  }
}

const getCurrencyPrices = async (req, res, next) => {
  const { tokens } = req.query
  try {
    const client = new GraphQLClient("https://bsc.streamingfast.io/subgraphs/name/pancakeswap/exchange-v2")
    const response = await client.request(FETCH_PRICE, { tokens })
    res.status(200).json({ success: true, data: response, msg: "Get currency price success!" })
  } catch (error) {
    res.status(200).json({ success: false, data: null, msg: error })
  }
}

const getHotTokens = async (req, res, next) => {
  try {
    const hotTokens = await CurrencyService.getHotTokens()
    res.status(200).json({ success: true, data: hotTokens, msg: "Get hot token list success" })
  } catch (error) {
    console.log('setting reward ref:', error)
    res.status(200).json({ success: false, data: null, msg: error })
  }
}

const getBullishTokens = async (req, res, next) => {
  try {
    const bullTokens = await CurrencyService.getBullTokens()
    res.status(200).json({ success: true, data: bullTokens, msg: "Get hot token list success" })
  } catch (error) {
    console.log('setting reward ref:', error)
    res.status(200).json({ success: false, data: null, msg: error })
  }
}

const getMostSearched = async (req, res, next) => {
  try {
    const mostSearched = await CurrencyService.getMostSearched()
    res.status(200).json({ success: true, data: mostSearched, msg: "Get hot token list success" })
  } catch (error) {
    console.log('getting most searched err:', error)
    res.status(200).json({ success: false, data: null, msg: error })
  }
}

const addCurrencies = async (req, res, next) => {
  const { tokens } = req.body
  try {
    console.log("tokens", tokens)
    const result = await CurrencyService.addCurrencies(tokens)
    res.status(200).json({ success: true, data: result, msg: 'Insert currencies success' })
  } catch (err) {
    console.log("error adding currencies:", error)
    res.status(502).json({ success: false, data: null, msg: error })
  }
}

const getTopMarketCap = async (req, res, next) => {
  let data = await CurrencyService.getTopMarketCap()
  res.status(200).json({ success: true, data, msg: "Get top market cap success" })
}

const getTopDailyPriceGrowth = async (req, res, next) => {
  let data = await CurrencyService.getTopDailyPriceGrowth()
  res.status(200).json({ success: true, data, msg: "Get top daily price growth success" })
}

const getTopDailyVolumeGrowth = async (req, res, next) => {
  let data = await CurrencyService.getTopDailyVolumeGrowth()
  res.status(200).json({ success: true, data, msg: "Get top daily volume growth success" })
}

const getGainers = async (req, res, next) => {
  let data = await CurrencyService.getGainers()
  res.status(200).json({ success: true, data, msg: "Get top gainers success" })
}

const getLosers = async (req, res, next) => {
  let data = await CurrencyService.getLosers()
  res.status(200).json({ success: true, data, msg: "Get top losers success" })
}

const getRecentlyAdded = async (req, res, next) => {
  let data = await CurrencyService.getRecentlyAdded()
  res.status(200).json({ success: true, data, msg: "Get top recently added success" })
}

const getTrending = async (req, res, next) => {
  let data = await CurrencyService.getTrending()
  res.status(200).json({ success: true, data, msg: "Get trending success" })
}

const banCurrencies = async (req, res, next) => {
  const { banlist } = req.body
  const result = await CurrencyService.banCurrencies(banlist)
  res.status(200).json({ success: true, data: result, msg: "Ban currency success" })
}

const updateAllowed = async(req, res, next) => {
  try{
    const { id, allowed } = req.body   
    const result = await CurrencyService.updateAllowed(id, allowed);
    res.status(200).json({ success: true, data: result, msg: "Update currency allowed" })
  }
  catch(err){
    res.status(404).json({ success: false, msg: err })
  }
}

const updateAllAllowed = async(req, res, next) => {
  try{
     const result = await CurrencyService.updateAllAllowed();
     res.status(200).json({ success: true, data: result, msg: "Update currency allowed" })
  }
  catch(err){
    res.status(404).json({ success: false, msg: err })
  } 
}

const updateSocials = async (req, res, next) => {
  const { id } = req.params
  const { socials } = req.body
  try {
    const result = await CurrencyService.updateSocials(id, socials)
    res.status(200).json({ success: true, data: result, msg: "Update currency socials success" })
    return result
  } catch (err) {
    res.status(404).json({ success: false, msg: err })
  }
}

module.exports = {
  getCurrencies,
  getAllCurrencies,
  getCurrency,
  getCurrencyHistory,
  getCurrencyPrices,
  getHotTokens,
  getBullishTokens,
  getMostSearched,
  getTopDailyPriceGrowth,
  getTopDailyVolumeGrowth,
  getTopMarketCap,
  getGainers,
  getLosers,
  getRecentlyAdded,
  getTrending,
  addCurrencies,
  banCurrencies,
  updateAllAllowed,
  updateAllowed,
  updateSocials
}