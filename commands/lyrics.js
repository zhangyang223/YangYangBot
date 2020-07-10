const msgFormatter = require("../util/formatTextMsg.js");
const cleanURL = require("../util/cleanURL.js");
const getLyrics = require("../play/getLyrics.js");
const { KSoftClient } = require('@ksoft/api');
const parser = require("../util/parseArgs.js");

module.exports = {
	name: 'lyrics',
	description: 'Get the lyrics of the current song',
	aliases: ["l"],
    async execute(message) 
    {
      const maxLyricLength = 2000;

      const serverQueue = message.client.queue.get(message.guild.id);

      async function getLyrics(query)
      {
        console.log("Getting Lyrics");
        
        async function useKsoft()
        {
          let result = null;

          try
          {

            let ksoft_token = process.env.KSOFT_TOKEN;
            console.log(ksoft_token.substring(0,3));
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
 
      function findQueryText()
      {
        let text = serverQueue.songs[serverQueue.current].title;

        if (serverQueue.songs[serverQueue.current].query != null)
        {
          let inputText = cleanURL.clean(serverQueue.songs[serverQueue.current].query);
  
          console.log("query=" + serverQueue.songs[serverQueue.current].query + ",inputText=" + inputText);
          if (inputText != null && !inputText.startsWith('http'))
          {
            text = inputText;
          }
        }
        return text;
      }

      function getExternalURL(query)
      {
        return encodeURI("https://mojim.com/" + query + ".html?u4");
      }

      let query = parser.parse(message.content);

      console.log("query=" + query);
      let title = query;

      if (query == null || query.length == 0)
      {
        if (!serverQueue) 
        {
          return msgFormatter.flashTextMessage(message.channel, null, 'There is nothing playing to show lyrics.');;
        }
        else
        {
          query = findQueryText();
          title = serverQueue.songs[serverQueue.current].title;
        }
      }

      let lyrics = await getLyrics(query);

      if (lyrics != null)
      {
        return msgFormatter.formatLyricsWithText(message.channel, title, lyrics);
      }
      else
        return msgFormatter.formatLyrics(message.channel, title, getExternalURL(query));

	}
};



