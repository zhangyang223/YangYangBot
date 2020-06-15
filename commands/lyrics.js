const msgFormatter = require("../util/formatTextMsg.js");
const cleanURL = require("../util/cleanURL.js");
const getLyrics = require("../play/getLyrics.js");
const { KSoftClient } = require('@ksoft/api');

const ksoft = new KSoftClient('a4c6aef23cdde42913dc6d70e4de4a90b52f110b');

module.exports = {
	name: 'lyrics',
	description: 'Get the lyrics of the current song',
	aliases: ["l"],
    async execute(message) 
    {
      const maxLyricLength = 2000;

      const serverQueue = message.client.queue.get(message.guild.id);
      if (!serverQueue) 
      {
        return msgFormatter.formatTextMsg(message.channel, null, 'There is nothing playing.');;
      }

      async function getLyrics(query)
      {
          console.log("Getting Lyrics");
          
          let tracks = await ksoft.lyrics.search(query, { textOnly: true });
          let lyrics = null;
      
          for(var item of tracks) 
          {
              if (item.name != null)
              {
                if (item.name.search(query) != -1)
                {
                  // found it.
                  console.log("Found exact match");
                  lyrics = item.lyrics;
                  break;
                }
              }
          };
      
          if (lyrics == null)
          {
            for(var item of tracks) 
            {
              if (item.lyrics != null)
              {
                if (item.lyrics.search(query) != -1)
                {
                  // found it.
                  console.log("Found through lyrics");
                  lyrics = item.lyrics;
                  break;
                }
              }
            }
          }
      
          if (lyrics == null)
          {
            console.log("Failed to find any lyrics");
          }
          else if (lyrics > maxLyricLength)
          {
            lyrics = lyrics.substring(0, maxLyricLength) + "...";
          }

          return lyrics;
      }
 
      function findQueryText()
      {
        let text = serverQueue.songs[0].title;

        if (serverQueue.songs[0].query != null)
        {
          let inputText = cleanURL.clean(serverQueue.songs[0].query);
  
          console.log("query=" + serverQueue.songs[0].query + ",inputText=" + inputText);
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

      let query = findQueryText();
      let lyrics = await getLyrics(query);

      if (lyrics != null)
      {
        return msgFormatter.formatLyricsWithText(message.channel, serverQueue.songs[0].title, lyrics);
      }
      else
        return msgFormatter.formatLyrics(message.channel, serverQueue.songs[0].title, getExternalURL(query));

	}
};



