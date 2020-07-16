const msgFormatter = require("../util/formatTextMsg.js");
const cleanURL = require("../util/cleanURL.js");
const getLyrics = require("../play/getLyrics.js");
const { KSoftClient } = require('@ksoft/api');
const parser = require("../util/parseArgs.js");
let ksoft_token = process.env.KSOFT_TOKEN;

module.exports = {
	name: 'lyrics',
	description: 'Get the lyrics of the current song',
	aliases: ["l"],
    async execute(message) 
    {
      const serverQueue = message.client.queue.get(message.guild.id);

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
        if (!serverQueue || !serverQueue.songs[serverQueue.current]) 
        {
          return msgFormatter.flashTextMessage(message.channel, null, 'There is nothing playing to show lyrics.');;
        }
        else
        {
          query = findQueryText();
          title = serverQueue.songs[serverQueue.current].title;
        }
      }

      let lyrics = await getLyrics.get(query);
//      let lyrics = await getLyrics(query);

      if (lyrics != null)
      {
        return msgFormatter.formatLyricsWithText(message.channel, title, lyrics);
      }
      else
        return msgFormatter.formatLyrics(message.channel, title, getExternalURL(query));

	}
};



