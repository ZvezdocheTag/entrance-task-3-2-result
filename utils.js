exports.sortValues = function (a, b) {
  if(a === null || b === null) {
    return 0;
  }

  if(a.value < b.value) {
    return -1;
  } 

  if(a.value > b.value) {
    return 1;
  }

  return 0;
}

exports.toKWT = function(watt){
  return (watt / 1000);
}
