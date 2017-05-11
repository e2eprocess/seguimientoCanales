var arr = "2,3";
arr = arr.split(',');
var params = [];
for(var i = 1; i <= arr.length; i++) {
  params.push('$' + i);
}

console.log(params);