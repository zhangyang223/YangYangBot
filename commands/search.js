const { Util } = require("discord.js");
const ytRequest = require("../youtube/ytRequest.js");
const msgFormatter = require("../util/formatTextMsg.js");
const parser = require("../util/parseArgs.js");
const songFormatter = require("../util/songFormatter.js");
const addSong = require("../play/addSong.js");
const songPlayer = require("../play/songPlayer.js");

const MAX_RESULT = 10;


module.exports = {
  name: "search",
  description: "<text> search for a song based on text",
  aliases: [],
  async execute(message) 
  {

    function waitForInput(textChannel, title, text, urlList)
    {
      msgFormatter.formatTextMsg(textChannel, title, text).then((msg) => {
        const filter = m => message.author.id === m.author.id;

        textChannel.awaitMessages(filter, { time: 20000, max: 1, errors: ['time'] })
          .then(messages => {
            let input = messages.first().content;
//            textChannel.send(`You've entered: ${input}`);
            try 
            {
              if (input >= 1 && input <= urlList.length)
              {
                let url = urlList[input-1].url;
                addSong.addWithMsg(message, url).then( () => {songPlayer.play(message);});
                msg.delete();
              }
            }
            catch(err)
            {
              console.error(err);
            }

          })
          .catch(() => 
          {
//            textChannel.send('You did not enter any input!');
          });
      });      
    }

    try 
    {
      const queue = message.client.queue;
      const serverQueue = message.client.queue.get(message.guild.id);

      const voiceChannel = message.member.voice.channel;
      if (!voiceChannel)
      {
        return msgFormatter.flashTextMessage(message.channel, "Error", "You need to be in a voice channel to play music!");
      }

      const permissions = voiceChannel.permissionsFor(message.client.user);
      if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) 
      {
        return msgFormatter.flashTextMessage(message.channel, "Error", "I need the permissions to join and speak in your voice channel!");
      }

      let args = parser.parse(message.content);

      if (args == null || args.length == 0)
      {
        var textTitle = "User Error";
        var msg = "Please enter the song name to search";
        msgFormatter.flashTextMessage(message.channel, textTitle, msg);
        return;
      }

      let inputText = args[0];

      var urlList = await ytRequest.search(inputText);
      if (urlList != null && urlList.length > 0)
      {
        let msg = "";
        for (let i = 0; i < MAX_RESULT; i++)
        {
          msg = msg + songFormatter.pad(i + 1,2) + ") " +  urlList[i].title + "\n"; 
        }
        waitForInput(message.channel, "Songs based on " + inputText, msg, urlList);
      }
      else
      {
        // cannot find any songs
        var textTitle = null;
        var msg = "Cannot find any song";
        msgFormatter.flashTextMessage(message.channel, textTitle, msg);
      }

    } 
    catch (error) 
    {
      console.error(error);
      msgFormatter.flashTextMessage(message.channel, 'Unexpected Error', error.message);
    }
  }

};
