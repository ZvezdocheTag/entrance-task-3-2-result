const { sortValues, toKWT } = require('./utils');
const { getSupportedTarif } = require('./supportedTarifs');
const DAY = 24;
const HOURS_IN_ARRAY = new Array(DAY).fill(true);

exports.getCalculatedValues = function(arr, initRates) {
  return arr.map(item => ({ ...item, ...calcOptimalSheduleValues(item, initRates)}))
}

function getSortableWorkShedule(device, rates) {
  return getSupportedTarif(device, rates).sort(sortValues).filter(item => item !== null);
}

function calculatedTimePeriod(sortableItem, duration, id) {
    return HOURS_IN_ARRAY.map((item, index) => {
        if(sortableItem.from + duration > 24) {
            if(index >= 0 && index < duration) {
                return id;
            }
        } else if(index >= sortableItem.from && index < sortableItem.from + duration) {
            return id;
        }

        return ""
    })
}

function calcOptimalSheduleValues(device, rates) {
    const shedule = getSortableWorkShedule(device, rates)
    let period = 0;
    let result = 0;
    let timePeriod = HOURS_IN_ARRAY;

    for(let i = 0; i< shedule.length; i+=1) {
        period = shedule[i].to - shedule[i].from;

        if(period < 0) {
            period = shedule[i].from + period + 1;
        }
        
        if(device.duration < period) {
            result = (toKWT(device.power) * device.duration) * shedule[i].value 
            timePeriod = calculatedTimePeriod(shedule[i], device.duration, device.id)
            break;
        } else {
            result += (toKWT(device.power) * period) * shedule[i].value;
            timePeriod = timePeriod.map(() => device.id)
        }
    }

    return { result, timePeriod };
}
