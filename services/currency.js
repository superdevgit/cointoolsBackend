const dotenv = require('dotenv')
const BigNumber = require('bignumber.js')
const Promise = require('bluebird')
const Currency = require('../models/currency')
const Banlist = require('../models/banlist')
const Pair = require('../models/pair')
const getPriceChart = require('../utils/getPriceChart')
const currency = require('../models/currency')

dotenv.config()

const getCurrencies = async (page, size, search, allowed) => {
  let sufficientVolumeSearchCondition = allowed === 'true' ? {
    currentPrice: { $exists: true, $gt: 0 }, marketCap: { $exists: true, $gt: 0 }, allowed: true, volume24hVal: { $gt: 1000000 }, $or: [
      { symbol: { $regex: search, $options: 'i' } },
      { name: { $regex: search, $options: 'i' } },
    ] 
  } : {
    currentPrice: { $exists: true, $gt: 0 }, marketCap: { $exists: true, $gt: 0 }, volume24hVal: { $gt: 1000000 }, $or: [
      { symbol: { $regex: search, $options: 'i' } },
      { name: { $regex: search, $options: 'i' } }
    ] 
  }

  let insufficientVolumeSearchCondition = allowed === 'true' ? {
    currentPrice: { $exists: true, $gt: 0 }, marketCap: { $exists: true, $gt: 0 }, allowed: true, volume24hVal: { $lte: 1000000 }, $or: [
      { symbol: { $regex: search, $options: 'i' } },
      { name: { $regex: search, $options: 'i' } }
    ]
  } : {
    currentPrice: { $exists: true, $gt: 0 }, marketCap: { $exists: true, $gt: 0 }, volume24hVal: { $lte: 1000000 }, $or: [
      { symbol: { $regex: search, $options: 'i' } },
      { name: { $regex: search, $options: 'i' } }
    ]
  }

  let searchCondition = allowed === 'true' ? {
    currentPrice: { $exists: true, $gt: 0 }, marketCap: { $exists: true, $gt: 0 }, allowed: true, $or: [
      { symbol: { $regex: search, $options: 'i' } },
      { name: { $regex: search, $options: 'i' } },
    ]
  } : {
    currentPrice: { $exists: true, $gt: 0 }, marketCap: { $exists: true, $gt: 0 }, $or: [
      { symbol: { $regex: search, $options: 'i' } },
      { name: { $regex: search, $options: 'i' } }
    ]
  }

  const project = {
    _id: 1,
    name: 1,
    image: 1,
    symbol: 1,
    currentPrice: 1,
    marketCap: 1,
    diff1h: 1,
    diff1d: 1,
    diff1w: 1,
    priceChart: 1,
    volume24hVal: 1,
    allowed: 1
  }
  const suffCnt = await Currency.count(sufficientVolumeSearchCondition)
  const length = await Currency.count(searchCondition)
  let currencies
  if ((page + 1) * size <= suffCnt) {
    currencies = await Currency.find(sufficientVolumeSearchCondition, project).limit(size).skip(page * size).sort({ marketCap: -1 })
  } else if (page * size >= suffCnt) {
    currencies = await Currency.find(insufficientVolumeSearchCondition, project).limit(size).skip(page * size - suffCnt).sort({ marketCap: -1 })
  } else {
    const suffCurrencies = await Currency.find(sufficientVolumeSearchCondition, project).limit(size).skip(page * size).sort({ marketCap: -1 })
    const insuffCurrencies = await Currency.find(insufficientVolumeSearchCondition, project).limit(size - suffCurrencies.length).sort({ marketCap: -1 })
    currencies = [...suffCurrencies, ...insuffCurrencies]
  }
  currencies = currencies.map(currency => ({ ...currency._doc, priceChart: getPriceChart(currency.priceChart) }))
  if (search.length > 0) {
    Promise.all(currencies.map(async(currency) => {
       await Currency.findByIdAndUpdate(currency._id, { searched: (currency.searched || 0) + 1 })  
    }))
  }
  return { currencies, length }
}

const getTopMarketCap = async () => {
  const tokens = await Currency.find({ currentPrice: { $exists: true, $gt: 0 }, marketCap: { $exists: true, $gt: 0 }, volume24hVal: { $exists: true, $gt: 100000 } }, {
    _id: 1,
    name: 1,
    image: 1,
    symbol: 1,
    currentPrice: 1,
    marketCap: 1,
    volume24hVal: 1,
    diff1d: 1
  }).sort({ marketCap: -1 }).limit(20)
  return tokens
}

const getTopDailyPriceGrowth = async () => {
  return await Currency.find({ currentPrice: { $exists: true, $gt: 0 }, marketCap: { $exists: true, $gt: 0 }, volume24hVal: { $exists: true, $gt: 100000 } }, {
    _id: 1,
    name: 1,
    image: 1,
    symbol: 1,
    currentPrice: 1,
    marketCap: 1,
    volume24hVal: 1,
    diff1d: 1
  }).sort({ diff1d: -1 }).limit(20)
}

const getTopDailyVolumeGrowth = async () => {
  return await Currency.find({ currentPrice: { $exists: true, $gt: 0 }, marketCap: { $exists: true, $gt: 0 }, volume24hVal: { $exists: true, $gt: 100000 } }, {
    _id: 1,
    name: 1,
    image: 1,
    symbol: 1,
    currentPrice: 1,
    marketCap: 1,
    volume24hVal: 1,
    diff1d: 1,
    marketCapChangePercent: 1
  }).sort({ marketCapChangePercent: -1 }).limit(20)
}

const getGainers = async () => {
  let currencies = await Currency.find({ currentPrice: { $exists: true, $gt: 0 }, marketCap: { $exists: true, $gt: 0 }, volume24hVal: { $gt: 50000 } }, {
    _id: 1,
    name: 1,
    image: 1,
    symbol: 1,
    currentPrice: 1,
    marketCap: 1,
    diff1h: 1,
    diff1d: 1,
    diff1w: 1,
    priceChart: 1,
    volume24hVal: 1,
  }).sort({ diff1d: -1 }).limit(15)
  currencies = currencies.map(currency => ({ ...currency._doc, priceChart: getPriceChart(currency.priceChart) }))
  return currencies
}

const getLosers = async () => {
  let currencies = await Currency.find({ currentPrice: { $exists: true, $gt: 0 }, diff1d: { $exists: true }, marketCap: { $exists: true, $gt: 0 }, volume24hVal: { $gt: 50000 } }, {
    _id: 1,
    name: 1,
    image: 1,
    symbol: 1,
    currentPrice: 1,
    marketCap: 1,
    diff1h: 1,
    diff1d: 1,
    diff1w: 1,
    priceChart: 1,
    volume24hVal: 1,
  }).sort({ diff1d: 1 }).limit(15)
  currencies = currencies.map(currency => ({ ...currency._doc, priceChart: getPriceChart(currency.priceChart) }))
  return currencies
}

const getRecentlyAdded = async () => {
  let currencies = await Currency.find({ currentPrice: { $exists: true, $gt: 0 }, marketCap: { $exists: true, $gt: 0 } }, {
    _id: 1,
    name: 1,
    image: 1,
    symbol: 1,
    currentPrice: 1,
    marketCap: 1,
    diff1h: 1,
    diff1d: 1,
    diff1w: 1,
    priceChart: 1,
    volume24hVal: 1,
  }).sort({ _id: -1 }).limit(15)
  currencies = currencies.map(currency => ({ ...currency._doc, priceChart: getPriceChart(currency.priceChart) }))
  return currencies
}

const getTrending = async () => {
  let currencies = await Currency.find({ currentPrice: { $exists: true, $gt: 0 }, marketCap: { $exists: true, $gt: 0 }, volume24hVal: { $gt: 50000 } }, {
    _id: 1,
    name: 1,
    image: 1,
    symbol: 1,
    currentPrice: 1,
    marketCap: 1,
    diff1h: 1,
    diff1d: 1,
    diff1w: 1,
    priceChart: 1,
    volume24hVal: 1,
  }).sort({ volume24hVal: 1 }).limit(15)
  currencies = currencies.map(currency => ({ ...currency._doc, priceChart: getPriceChart(currency.priceChart) }))
  return currencies
}

const getAllCurrencies = async () => {
  const currencies = await Currency.find({ currentPrice: { $exists: true, $gt: 0 } })
  return {
    data: currencies,
    length: currencies.length
  }
}

const getCurrency = async name => {
  let currency = await Currency.findOne({ name: { $regex: `^${name.toLowerCase().replaceAll('-', ' ')}$`, $options: 'i' } })
  const pairs = await Pair.find({ currency: currency._id })
  let newSum = 0
  let newPairs = []
  pairs.map(pair => newSum += pair.volume24h)
  currency = { ...currency, priceChart: getPriceChart(currency.priceChart) }
  newPairs.push(...(pairs.filter(pair => pair.swap === 'binance').filter(pair => pair.volume24h > 0).sort((a, b) => b.volume24h - a.volume24h).slice(0, 10)))
  newPairs.push(...(pairs.filter(pair => pair.swap === 'kucoin').filter(pair => pair.volume24h > 0).sort((a, b) => b.volume24h - a.volume24h).slice(0, 10)))
  newPairs.push(...(pairs.filter(pair => pair.swap === 'gate').filter(pair => pair.volume24h > 0).sort((a, b) => b.volume24h - a.volume24h).slice(0, 10)))
  newPairs.push(...(pairs.filter(pair => pair.swap === 'pancakeswap').filter(pair => pair.volume24h > 0).sort((a, b) => b.volume24h - a.volume24h).slice(0, 2)))
  newPairs.push(...(pairs.filter(pair => pair.swap === 'biswap').filter(pair => pair.volume24h > 0).sort((a, b) => b.volume24h - a.volume24h).slice(0, 2)))
  newPairs.push(...(pairs.filter(pair => pair.swap === 'uniswap').filter(pair => pair.volume24h > 0).sort((a, b) => b.volume24h - a.volume24h).slice(0, 2)))
  newPairs.push(...(pairs.filter(pair => pair.swap === 'sushiswap').filter(pair => pair.volume24h > 0).sort((a, b) => b.volume24h - a.volume24h).slice(0, 2)))

  return { ...(currency._doc), pairs: newPairs, sum: newSum }
}

const getCurrencyById = async id => {
  let currency = await Currency.findById(id)
  const pairs = await Pair.find({ currency: currency._id })
  let newSum = 0
  let newPairs = []
  pairs.map(pair => newSum += pair.volume24h)
  currency = { ...currency, priceChart: getPriceChart(currency.priceChart) }
  newPairs.push(...(pairs.filter(pair => pair.swap === 'binance').filter(pair => pair.volume24h > 0).sort((a, b) => b.volume24h - a.volume24h).slice(0, 10)))
  newPairs.push(...(pairs.filter(pair => pair.swap === 'kucoin').filter(pair => pair.volume24h > 0).sort((a, b) => b.volume24h - a.volume24h).slice(0, 10)))
  newPairs.push(...(pairs.filter(pair => pair.swap === 'gate').filter(pair => pair.volume24h > 0).sort((a, b) => b.volume24h - a.volume24h).slice(0, 10)))
  newPairs.push(...(pairs.filter(pair => pair.swap === 'pancakeswap').filter(pair => pair.volume24h > 0).sort((a, b) => b.volume24h - a.volume24h).slice(0, 2)))
  newPairs.push(...(pairs.filter(pair => pair.swap === 'biswap').filter(pair => pair.volume24h > 0).sort((a, b) => b.volume24h - a.volume24h).slice(0, 2)))
  newPairs.push(...(pairs.filter(pair => pair.swap === 'uniswap').filter(pair => pair.volume24h > 0).sort((a, b) => b.volume24h - a.volume24h).slice(0, 2)))
  newPairs.push(...(pairs.filter(pair => pair.swap === 'sushiswap').filter(pair => pair.volume24h > 0).sort((a, b) => b.volume24h - a.volume24h).slice(0, 2)))

  // if (currency.symbol === 'WBNB') {
  //   newPairs = [...newPairs, ...(pairs.filter(pair => pair.swap === 'biswap' && pair.volume24h > 0).sort((a, b) => b.volume24h - a.volume24h).slice(0, 1))]
  // } else {
  //   dexPairs = pairs.filter(pair => pair.swap === 'biswap' && [`wbnb/${currency.symbol.toLowerCase()}`, `${currency.symbol.toLowerCase()}/wbnb`].includes(pair.symbol.toLowerCase())).sort((a, b) => b.volume24h - a.volume24h)
  //   newPairs = [...newPairs, ...dexPairs]
  // }
  // if (currency.symbol === 'WETH') {
  //   newPairs = [...newPairs, ...(pairs.filter(pair => pair.swap === 'uniswap' && pair.volume24h > 0).sort((a, b) => b.volume24h - a.volume24h).slice(0, 1))]
  // } else {
  //   dexPairs = pairs.filter(pair => pair.swap === 'uniswap' && [`weth/${currency.symbol.toLowerCase()}`, `${currency.symbol.toLowerCase()}/weth`].includes(pair.symbol.toLowerCase())).sort((a, b) => b.volume24h - a.volume24h)
  //   newPairs = [...newPairs, ...dexPairs]
  // }
  // if (currency.symbol === 'WETH') {
  //   newPairs = [...newPairs, ...(pairs.filter(pair => pair.swap === 'sushiswap' && pair.volume24h > 0).sort((a, b) => b.volume24h - a.volume24h).slice(0, 1))]
  // } else {
  //   dexPairs = pairs.filter(pair => pair.swap === 'sushiswap' && [`weth/${currency.symbol.toLowerCase()}`, `${currency.symbol.toLowerCase()}/weth`].includes(pair.symbol.toLowerCase())).sort((a, b) => b.volume24h - a.volume24h)
  //   newPairs = [...newPairs, ...dexPairs]
  // }
  // if (currency.symbol === 'WBNB') {
  //   newPairs = [...newPairs, ...(pairs.filter(pair => pair.swap === 'pancakeswap' && pair.volume24h > 0).sort((a, b) => b.volume24h - a.volume24h).slice(0, 1))]
  // } else {
  //   dexPairs = pairs.filter(pair => pair.swap === 'pancakeswap' && [`wbnb/${currency.symbol.toLowerCase()}`, `${currency.symbol.toLowerCase()}/wbnb`].includes(pair.symbol.toLowerCase())).sort((a, b) => b.volume24h - a.volume24h)
  //   newPairs = [...newPairs, ...dexPairs]
  // }
  return { ...(currency._doc), pairs: newPairs, sum: newSum }
}

const getHotTokens = async () => {
  const tokens = await Currency.find({ currentPrice: { $exists: true, $gt: 0 }, marketCap: { $exists: true, $gt: 0 } }, {
    _id: 1,
    name: 1,
    image: 1,
    symbol: 1,
    currentPrice: 1,
    totalSupply: 1,
    marketCap: 1,
    diff1d: 1,
  }).sort({ volume24hVal: -1 }).limit(20)
  return tokens
}

const getBullTokens = async () => {
  const tokens = await Currency.find({ currentPrice: { $exists: true, $gt: 0 }, marketCap: { $exists: true, $gt: 0 } }, {
    _id: 1,
    name: 1,
    image: 1,
    symbol: 1,
    currentPrice: 1,
    totalSupply: 1,
    marketCap: 1,
    diff1d: 1,
  }).sort({ diff1d: -1 }).limit(20)
  return tokens
}

const getMostSearched = async () => {
  const mostTokens = await Currency.find({ searched: { $exists: true, $gt: 0 } }).sort({ searched: -1 }).limit(10)
  return mostTokens
}

const addCurrencies = async tokens => {
  let result = []
  await Promise.all(tokens.map(async token => {
    const currency = new Currency({ address: token.address, name: token.name, symbol: token.symbol, image: token.image, decimals: token.decimals, socials: token.socials, paymentList: token.paymentList, allowed: token.allowed })
    const res = await currency.save()
    result = [...result, res]
  }))
  return result
}

const banCurrencies = async currencies => {
  let result = []
  await Promise.each(currencies, async ban => {
    const currency = await Currency.findById(ban.id)
    if (!currency) {
      return
    }
    const newBanlist = new Banlist({ chainId: Number(ban.chain), address: currency.address[ban.chain], symbol: currency.symbol })
    result.push(await newBanlist.save())
  }, { concurrency: 1 })
  return result
}

const getAnalytics = async (currencies, gettingAll = false) => {
  let result = []
  const ZERO = new BigNumber(0)
  const chainIds = [1, 56]
  await Promise.all(currencies.filter(currency => (!!currency.address && Object.keys(currency.address).length > 0 && !!currency.volume24h)).map(async data => {
    const { _id, address: idObj, price: priceObj, name, image, symbol, tsupply: supplyObj, trending, volume: volumeObj, volume24h: volume24hObj, history, socials, marketCap } = data
    try {
      const series = Object.keys(volume24hObj)
      let volume24h = 0
      let priceNume = ZERO, priceDeno = ZERO, price1hNume = ZERO, price1hDeno = ZERO, price1dNume = ZERO, price1dDeno = ZERO, price1wNume = ZERO, price1wDeno = ZERO, supply = ZERO
      await Promise.all(chainIds.filter(chainId => !!idObj[chainId]).map(chainId => {
        let deltaNume = priceNume
        series.filter(swap => !!volumeObj[swap][chainId] && Number(priceObj[swap][chainId]?.now) > 0).map(swap => { // eslint-disable-line
          volume24h += Number(volume24hObj[swap][chainId])
          if (!!volumeObj[swap][chainId].now && !!priceObj[swap][chainId].now) {
            priceNume = priceNume.plus(new BigNumber(volumeObj[swap][chainId].now).times(priceObj[swap][chainId].now))
            priceDeno = priceDeno.plus(new BigNumber(volumeObj[swap][chainId].now))
          }
          if (!!volumeObj[swap][chainId].hourAgo && !!priceObj[swap][chainId].hourAgo) {
            price1hNume = price1hNume.plus(new BigNumber(volumeObj[swap][chainId].hourAgo).times(priceObj[swap][chainId].hourAgo))
            price1hDeno = price1hDeno.plus(new BigNumber(volumeObj[swap][chainId].hourAgo))
          }
          if (!!volumeObj[swap][chainId].dayAgo && !!priceObj[swap][chainId].dayAgo) {
            price1dNume = price1dNume.plus(new BigNumber(volumeObj[swap][chainId].dayAgo).times(priceObj[swap][chainId].dayAgo))
            price1dDeno = price1dDeno.plus(new BigNumber(volumeObj[swap][chainId].dayAgo))
          }
          if (!!volumeObj[swap][chainId].weekAgo && !!priceObj[swap][chainId].weekAgo) {
            price1wNume = price1wNume.plus(new BigNumber(volumeObj[swap][chainId].weekAgo).times(priceObj[swap][chainId].weekAgo))
            price1wDeno = price1wDeno.plus(new BigNumber(volumeObj[swap][chainId].weekAgo))
          }
        })
        if (priceNume.gt(deltaNume) && !!supplyObj && !!supplyObj[chainId]) {
          supply = supply.plus(supplyObj[chainId] || ZERO)
        }
      }))
      const diff1h = (priceDeno.toString() === '0' || price1hDeno.toString() === '0' || price1hNume.toString() === '0') ? '' : calculateCiffPercent(priceNume.div(priceDeno).toString(), price1hNume.div(price1hDeno).toString())
      const diff1d = (priceDeno.toString() === '0' || price1dDeno.toString() === '0' || price1dNume.toString() === '0') ? '' : calculateCiffPercent(priceNume.div(priceDeno).toString(), price1dNume.div(price1dDeno).toString())
      const diff1w = (priceDeno.toString() === '0' || price1wDeno.toString() === '0' || price1wNume.toString() === '0') ? '' : calculateCiffPercent(priceNume.div(priceDeno).toString(), price1wNume.div(price1wDeno).toString())
      let times = Object.keys(history || {}).map((val) => Number(val || '0'))
      let values = Object.values(history || {}).map((val) => Number(val || '0'))
      let index = times.findIndex((time) => time >= Date.now() - 7 * 24 * 3600 * 1000)
      times = times.slice(index)
      values = values.slice(index)
      let chart = []
      if (gettingAll && times.length > 0) {
        let start = times[0]
        const interval = (times[times.length - 1] - times[0]) / 100
        while (start < times[times.length - 1]) {
          index = times.findIndex((time) => time >= start)
          chart = [...chart, values[index]]
          start += interval
        }
      }

      result = [...result, {
        idObj,
        _id,
        name,
        image,
        symbol,
        price: priceDeno.toString() === '0' ? '' : priceNume.div(priceDeno).toString(),
        diff1h,
        diff1d,
        diff1w,
        marketCap,
        supply,
        trending,
        volume24h,
        history: chart,
        socials
      }]
    } catch (err) {
      console.log('error loading analytics:', err)
    }
  }))
  return result
}

const updateAllowed = async (id, allowed) => {
  const currency = await Currency.findById(id)
  if (!currency) {
    throw 'Currency not found'
  }
  const result = await Currency.findByIdAndUpdate(id, { allowed: allowed})
  return result  
}

const updateAllAllowed = async() => {
  const currencies = await Currency.find({});
  try{
    const result = await Promise.all(currencies.map(async(currency) => {    
      const res = await Currency.findByIdAndUpdate({_id: currency.id}, { allowed: true })
      console.log("res", res)
    }));
    return result;
  }catch(err){
    console.log("err", err)
  }
}

const updateSocials = async (id, socials) => {
  const currency = await Currency.findById(id)
  if (!currency) {
    throw 'Currency not found'
  }
  const result = await Currency.findByIdAndUpdate(id, { socials: { ...(currency.socials) || {}, ...socials } })
  return result
}

module.exports = {
  getCurrencies,
  getAllCurrencies,
  getCurrency,
  getCurrencyById,
  getHotTokens,
  getBullTokens,
  getMostSearched,
  getAnalytics,
  getTopMarketCap,
  getTopDailyPriceGrowth,
  getTopDailyVolumeGrowth,
  getGainers,
  getLosers,
  getRecentlyAdded,
  getTrending,
  addCurrencies,
  banCurrencies,
  updateAllowed,
  updateAllAllowed,
  updateSocials
}