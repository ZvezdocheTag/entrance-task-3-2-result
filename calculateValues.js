const { sortValues, toKWT } = require('./utils');
const { getSupportedTarif } = require('./supportedTarifs');


exports.getCalculatedValues = function(arr, initRates, shedule) {
  return arr.map(item => ({ ...item, ...calcOptimalSheduleValues(item, initRates, shedule)}))
}

function getSortableWorkShedule(device, rates) {
  return getSupportedTarif(device, rates).sort(sortValues).filter(item => item !== null);
}


function calculatedTimePeriod(sortableItem, duration, id) {
    return HOURS_IN_ARRAY.reduce((curr, next, index) => {
        if(sortableItem.from + duration > 24) {
            if(index >= 0 && index < duration) {
                next[index] = id;
            }
        } else if(index >= sortableItem.from && index < sortableItem.from + duration) {
            curr[index] = id;
        }
        curr[index] = "";
        return {...curr}
    }, {})
}
// console.log(generatedShedule)
function fillShedule(value, shedule) {
    for(hour in shedule) {
        shedule[hour] = [value]
        // shedule[hour].push(value)
    }
    return shedule;
}

function fillSheduleCondition(value, shedule, duration) {
    for(hour in shedule) {
        shedule[hour] = []
        if(hour >= 0 && hour < duration) {
            shedule[hour] = [value]
            // shedule[hour].push(value)
        }
    }
    return shedule;
}

function fillSheduleDevice(value, shedule, start, duration) {
    for(hour in shedule) {
        shedule[hour] = []
        if(hour >= start && hour < start + duration) {
            // shedule[hour] = [...shedule[hour], value]
            shedule[hour] = [value]
            // shedule[hour].push(value)
        }
    }
    return shedule;
}
// console.log(generatedShedule)
function calcOptimalSheduleValues(device, rates, ds) {
    const shedule = getSortableWorkShedule(device, rates)
    const objs = Object.assign({}, ds)
    // const objs = ds
    let period = 0;
    let result = 0;
    let timePeriod = {};
    // console.log(objs)
    for(let i = 0; i< shedule.length; i+=1) {
        period = shedule[i].to - shedule[i].from;

        if(period < 0) {
            period = shedule[i].from + period + 1;
        }
        
        if(device.duration < period) {
            result = (toKWT(device.power) * device.duration) * shedule[i].value 
            if(shedule[i].from + device.duration > 24) {
                timePeriod[device.id] = fillSheduleCondition(device.id, objs, device.duration)
            }else {
                timePeriod[device.id] =fillSheduleDevice(device.id, objs,shedule[i].from, device.duration)
            }
            break;
        } else {
            result += (toKWT(device.power) * period) * shedule[i].value;
            timePeriod[device.id] = fillShedule(device.id, objs);
            
        }
    }
    // return objs
    return { result, timePeriod };
}
