const input = require('./input.json');
const { getCalculatedValues } = require('./calculateValues');
const { devices, rates } = input;

const data = getCalculatedValues(devices, rates);

console.log(data)
