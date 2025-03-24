function roundPercentageToDecimal(decimal: number, value: string) {
  if (value !== '-') {
    let valueDecimals = _getDecimalsOf(parseFloat(value));
    if (valueDecimals > decimal) {
      value = parseFloat(value).toFixed(decimal) + '%';
    }
  }
  return value;
}

function _getDecimalsOf(value: number) {
  if (Math.floor(value) !== value) {
    return value.toString().split('.')[1].length || 0;
  }
  return 0;
}

export default roundPercentageToDecimal;
