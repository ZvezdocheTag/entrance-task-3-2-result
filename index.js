const input = require('./input.json');
const { getCalculatedValues } = require('./calculateValues');
const { devices, rates } = input;

const DAY = 24;
const HOURS_IN_ARRAY = new Array(DAY).fill(true);

function generateShedule() {
    return HOURS_IN_ARRAY.reduce((curr, next, i) => ({ ...curr, [i]: [] }), {})
}

const generatedShedule = generateShedule();
const data = getCalculatedValues(devices, rates, generatedShedule);

function generateConsumedEnergy(data) {
    return data.reduce((curr, next) => {
        
        return Object.assign(curr, { 
            value: next.result + curr.value, 
            devices: { ...curr.devices, [next.id]: next.result 
            }
        });
    }, { value: 0, devices: {} })
}

data.forEach(item => {
    for(let key in item.timePeriod[item.id]) {
        generatedShedule[key] = [...generatedShedule[key], ...item.timePeriod[item.id][key] ]
    }
})

function generateResult(data) {
    return {
        shedule: generatedShedule,
        consumedEnergy: generateConsumedEnergy(data)  
    }
}
console.log(generateResult(data))