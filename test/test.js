const {format} = require("..");
const assert = require("assert");
function test() {
  let res = format();
  assert.match(res,/\d{1,4}-\d{1,2}-\d{1,2}\s\d{1,2}:\d{1,2}:\d{1,2}/);
  console.log(`\u001B[32m✓\u001B[39m ${res}`);
}
test();
