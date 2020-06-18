const { Util } = require("discord.js");
const addPlaylist = require("../play/addPlaylist.js");
const addSong = require("../play/addSong.js");
const cleanURL = require("../util/cleanURL.js");
const songPlayer = require("../play/songPlayer.js");
const ytSearch = require("../youtube/search.js");
const msgFormatter = require("../util/formatTextMsg.js");

module.exports = {
  name: "play",
  description: "<text/url> Play a song/playlist",
  aliases: ["p"],
  async execute(message) 
  {
    try 
    {
      const queue = message.client.queue;
      const serverQueue = message.client.queue.get(message.guild.id);

      const voiceChannel = message.member.voice.channel;
      if (!voiceChannel)
      {
        return msgFormatter.formatTextMsg(message.channel, "Error", "You need to be in a voice channel to play music!");

//        return message.channel.send(
//          "You need to be in a voice channel to play music!"
//        );
      }
      const permissions = voiceChannel.permissionsFor(message.client.user);
      if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) 
      {
        return msgFormatter.formatTextMsg(message.channel, "Error", "I need the permissions to join and speak in your voice channel!");
//        return message.channel.send(
//          "I need the permissions to join and speak in your voice channel!"
//        );
      }

      var inputText = cleanURL.clean(message.content);

      if (inputText == null || inputText.length == 0)
      {
        var textTitle = "User Error";
        var msg = "Please enter a url or a song to search";
        msgFormatter.formatTextMsg(message.channel, textTitle, msg);
        return;
    }

      if (inputText.startsWith('http'))
      {
        var url = inputText;
        if (url.includes("/playlist?"))
        {
          console.log("this is a playlist");
          await addPlaylist.add(message, url);
        }
        else
        {
          console.log("this is a video");
          await addSong.addWithMsg(message, url);
          songPlayer.play(message);
        }
      }
      else
      {
        // it is not an URL, search
        console.log("this is a text");
        var url = await ytSearch.searchYouTube(inputText);
        if (url != null)
        {
          await addSong.addWithMsg(message, url);
          songPlayer.play(message);
        }
        else
        {
          // cannot find any songs
          var textTitle = null;
          var msg = "Cannot find any song";
          msgFormatter.flashTextMessage(message.channel, textTitle, msg);
        }
      }

    } 
    catch (error) 
    {
      console.error(error);
      msgFormatter.formatTextMsg(message.channel, 'Unexpected Error', error.message);
    }
  }

};
