const obj = require("../..");
let format = obj.format,
  parse = obj.parse;
console.log(format());
console.log(parse("hh:mm:ss","12:23:21"));
