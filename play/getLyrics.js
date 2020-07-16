const cleanURL = require("../util/cleanURL.js");
const { KSoftClient } = require('@ksoft/api');
let ksoft_token = process.env.KSOFT_TOKEN;

const maxLyricLength = 2000;

module.exports = 
{
    async get(query)
    {
      console.log("Getting Lyrics from ksoft");
      
      async function useKsoft()
      {
        let result = null;

        try
        {

          if (ksoft_token == null)
            console.log("failed to get ksoft_token");

          const ksoft = new KSoftClient(ksoft_token);
          if (ksoft == null)
          { 
            console.log("failed to find ksoft");
            return result;
          }
          let tracks = await ksoft.lyrics.search(query, { textOnly: true });
          console.log("ksoft returned " + tracks.length + " tracks");
      
          for(var item of tracks) 
          {
              if (item.name != null)
              {
                if (item.name.search(query) != -1)
                {
                  // found it.
                  console.log("Found exact match");
                  result = item.lyrics;
                  break;
                }
              }
          };
    
          if (result == null)
          {
            for(var item of tracks) 
            {
              if (item.lyrics != null)
              {
                if (item.lyrics.search(query) != -1)
                {
                  // found it.
                  console.log("Found through lyrics");
                  result = item.lyrics;
                  break;
                }
              }
            }
          }
        }
        catch (err)
        {
          // don't care for now
          console.error(err);
        }          
        return result;
      }

      let lyrics = useKsoft();

      if (lyrics == null)
      {
        console.log("Failed to find any lyrics");
      }
      else if (lyrics.length > maxLyricLength)
      {
        lyrics = lyrics.substring(0, maxLyricLength) + "...";
      }

      return lyrics;
    }

};



