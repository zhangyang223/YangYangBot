let expect    = require("chai").expect;
const ytUtil = require("../youtube/ytRequest.js");
var fs = require('fs');
const utf8 = require('utf8');

const queryText = "Frozen";
const LIMIT = 100;

describe("Test Search", function() 
{
  it("Search", function() 
  {
      ytUtil.search(queryText).then((result) => { console.log("search result.length=" + result.length); expect(result.length > 0);});
  });

  it("Search From HTML", function() 
  {
    const folderPath = "./test/search";
    const expected = 11;

    for (let i = 0; i < LIMIT; i++)
    {
      const htmlPath = folderPath + "/" + (i+1) + ".htm";
      let html = fs.readFileSync(htmlPath, 'utf8');

      let result = ytUtil.scrapeSearchFromHTML(html);
      console.log("search length=" + result.length);
      expect(result.length > 0);
    }

  });

  it("Playlist", function() 
  {
    const playlistURL = "https://www.youtube.com/playlist?list=PLYPW-sfMha5aoEyMBPyhreEW735FvwiMQ";
    const expected = 11;

      ytUtil.get(playlistURL).then((result) => {console.log("playlist length=" + result.length);expect(result.length).equal(expected);});

  });
  
  it("Playlist From HTML", function() 
  {
    const folderPath = "./test/playlist";
    const expected = 11;

    for (let i = 0; i < LIMIT; i++)
    {
      const htmlPath = folderPath + "/" + (i+1) + ".htm";
      let html = fs.readFileSync(htmlPath, 'utf8');

      let result = ytUtil.scrapePlaylistFromHTML(html);
      console.log("playlist length=" + result.length);
      expect(result.length).equal(expected);
    }

  });

});

