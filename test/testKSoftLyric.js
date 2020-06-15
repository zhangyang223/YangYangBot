var expect    = require("chai").expect;
const getLyrics = require("../play/getLyrics.js");

/*

describe("Test Get Lyrics", function() 
{
  it("Search", function() {
    var query = "紅豆";

    async function runAsync(query) 
    {
      return await getLyrics.get(query);
    }
    expect(runAsync(query)).not.equal("");
  });
  
});



describe("Test Get Lyrics 2", function() 
{
  it("Search", function() {
    var query = "小幸運";

    async function runAsync(query) 
    {
      return await getLyrics.get(query);
    }
    expect(runAsync(query)).not.equal("");
  });
  
});
*/

/*

const { KSoftClient } = require('@ksoft/api');

const ksoft = new KSoftClient('a4c6aef23cdde42913dc6d70e4de4a90b52f110b');

/* I use a helper asnyc function called main here.
 * This would also work using a lambda function or class method,
 * as long as it's asynchronous.
 *
async function main() 
{
    console.log("Testing KSoft");
    var query = "紅豆";
//    query = "小幸運";
//    query = "田馥甄  Hebe Tien 《小幸運》";
  query = "Michael Jackson - Smooth Criminal (Official Video)"
    var tracks = await ksoft.lyrics.search(query, { textOnly: true });

    var songFound = false;

    for(var item of tracks) 
    {
      console.table(item.lyrics);
      if (item.name != null)
        {
          if (item.name.search(query) != -1)
          {
            // found it.
            console.log("Found exact match");
            console.table(item.lyrics);
            songFound = true;
            break;
          }
        }
    };

    if (!songFound)
    {
      for(var item of tracks) 
      {
        if (item.lyrics != null)
        {
          if (item.lyrics.search(query) != -1)
          {
            // found it.
            console.log("Found through lyrics");
            console.table(item.lyrics);
            songFound = true;
            break;
          }
        }
      }
    }

    if (!songFound)
      console.log("Failed to find any lyrics");
        
//    var track = await ksoft.lyrics.get(query, { textOnly: true });

//    console.log("dumping track ****");
//    console.table(track);
}

main();

*/