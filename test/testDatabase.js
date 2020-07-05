let request = require('request-promise-native');
let expect    = require("chai").expect;
const database = require("../util/database.js");


/*
        const song = {
          info: null,
          title: playlist[i].title,
          url: playlist[i].url,
          length: null,
          requestor: message.author.tag,
          query: message.content
        };
*/

describe("Test Database", function() 
{
  it("Raw Write then Read", function() {
    let obj = { first: 1, second: [2,3,4], third: "ab", chinese: "你好嗎"};
    const guildid = 1;

    database.writeObj(obj, guildid);
    let result = database.readObj(guildid);
    expect(result).to.deep.equal(obj);

  });
  
  it("Write songs then Read", function() {
    const song1 = {
      info: null,
      title: '小蘋果',
      url: 'http://someurl',
      length: null,
      requestor: 'test123',
      query: '小蘋果'
    };
    let obj = [song1, song1];
    const guildid = 1;

    database.write(obj, guildid);
    let result = database.read(guildid);
    expect(result).to.deep.equal(obj);

  });

});
