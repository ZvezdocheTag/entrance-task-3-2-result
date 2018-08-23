const modeTypes = {
  day: { from: 7, to: 21, type: "day"},
  night: { from: 21, to: 7, type: "night"},
} 

function getRatesByModes(mode, rates) {
  return rates.map(
      (rate) => {
          if(rate.from >= mode.from && (
            mode.type === "night" ? true : rate.from < mode.to
          )) {
              return {...rate};
          }
          return null;
      }
  )
}

exports.getSupportedTarif = function (device, rates) {
  if(modeTypes[device.mode]) {
    return getRatesByModes(modeTypes[device.mode], rates);
  }

  return rates;
}


