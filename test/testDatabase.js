let request = require('request-promise-native');
let expect    = require("chai").expect;
const database = require("../util/database.js");

describe("Test Database", function() 
{
  it("Write then Read", function() {
    let obj = { first: 1, second: [2,3,4], third: "ab", chinese: "你好嗎"};
    const guildid = 1;

    database.write(guildid, obj);
    let result = database.read(guildid);
    expect(result).to.deep.equal(obj);

  });
  

});
