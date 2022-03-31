/* eslint-disable no-bitwise */

const handler = (temp) => {
  const { Value, UnitType } = temp
  const val = ((((parseInt(Value, 10)) - 32) * 5) / 9) | 0
  return {
    Value: val,
    Unit: 'C',
    UnitType,
  }
}

module.exports = {
  handler,
}
