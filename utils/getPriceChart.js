const getPriceChart = data => {
  let dates = Object.keys(data).map(key => Number(key))
  if (dates.length === 0) {
    return ''
  }
  let values = []
  let i
  for (i = 0; i < 200; ++i) {
    const threshold = 1000 * 3600 * 24 * 7 * i / 200 + dates[0]
    const index = dates.findIndex(date => date >= threshold)
    if (index < 0) {
      break
    }
    values = [...values, data[dates[index]]]
  }
  let min = values[0], max = values[0]
  for (i = 0; i < values.length; ++i) {
    if (values[i] < min) {
      min = values[i]
    } else if (values[i] > max) {
      max = values[i]
    }
  }
  max -= min
  let points = ''
  for (i = 0; i < values.length; ++i) {
    points = `${points} ${i}, ${max === 0 ? 20 : (values[i] - min) * 50 / max}`
  }
  return points
}

module.exports = getPriceChart