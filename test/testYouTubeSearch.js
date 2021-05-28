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
      ytUtil.search(queryText).then((result) => {  expect(result.length > 0);});
  });

  it("Search From HTML", function() 
  {
    this.timeout(10000) // 10 second timeout only for this test    
    const folderPath = "./test/search";
    const expected = 11;

    for (let i = 0; i < LIMIT; i++)
    {
      const htmlPath = folderPath + "/" + (i+1) + ".htm";
      let html = fs.readFileSync(htmlPath, 'utf8');

      let result = ytUtil.scrapeSearchFromHTML(html);
      expect(result.length > 0);
    }

  });

  it("Playlist", function() 
  {
    const playlistURL = "https://www.youtube.com/playlist?list=PLYPW-sfMha5aoEyMBPyhreEW735FvwiMQ";
    const expected = 11;

      ytUtil.get(playlistURL).then((result) => {expect(result.length).equal(expected);});

  });
  
  it("Playlist From HTML", function() 
  {
    this.timeout(5000) // 10 second timeout only for this test    
    const folderPath = "./test/playlist";
    const expected = 11;

    for (let i = 0; i < LIMIT; i++)
    {
      const htmlPath = folderPath + "/" + (i+1) + ".htm";
      let html = fs.readFileSync(htmlPath, 'utf8');

      let result = ytUtil.scrapePlaylistFromHTML(html);
      if (result.length > 0)
      {
        expect(result[0].url).to.not.equal(undefined);
        expect(result[0].title).to.not.equal(undefined);
        expect(result[0].length).to.not.equal(undefined);
      }
      expect(result.length).equal(expected);
    }

  });

  it("Recommendation List From HTML", function() 
  {
//    this.timeout(5000) // 10 second timeout only for this test    
    const folderPath = "./test/recommendation";
    const expected = 19;

    const htmlPath = folderPath + "/" + "1.htm";
    let html = fs.readFileSync(htmlPath, 'utf8');

    let result = ytUtil.getRecommendationListFromHTML(html);
    if (result.length > 0)
    {
      expect(result[0].url).to.not.equal(undefined);
    }
    expect(result.length).equal(expected);
    
  });


});

