const calculateDiffPercent = (val1, val2) => {
  if (Number(val2) === 0) {
    return ''
  }
  return (1.0 - Number(val1) / Number(val2)) * 100
}

module.exports = {
  calculateDiffPercent
}