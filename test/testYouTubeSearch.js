let expect    = require("chai").expect;
const ytUtil = require("../youtube/ytRequest.js");

const queryText = "Frozen";
const LIMIT = 100;

describe("Test Search", function() 
{
  it("Search", function() 
  {
    for (let i = 0; i < LIMIT; i++)
      ytUtil.search(queryText).then((result) => { console.log("search result.length=" + result.length); expect(result.length > 0);});
  });

  it("Playlist", function() 
  {
    const playlistURL = "https://www.youtube.com/playlist?list=PLYPW-sfMha5aoEyMBPyhreEW735FvwiMQ";
    const expected = 11;

    for (let i = 0; i < LIMIT; i++)
      ytUtil.get(playlistURL).then((result) => {console.log("playlist length=" + result.length);expect(result.length).equal(expected);});

  });
  

});

