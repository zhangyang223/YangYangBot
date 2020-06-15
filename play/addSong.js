"use strict";
const { Util } = require("discord.js");
const getSongInfo = require("../play/getSongInfo.js");
const msgFormatter = require("../util/formatTextMsg.js");

var addSongReturnVal = null;

module.exports = 
{
  async add(message, url) 
  {
    try 
    {
      const queue = message.client.queue;
      const serverQueue = message.client.queue.get(message.guild.id);
      const voiceChannel = message.member.voice.channel;
      var songInfo = await getSongInfo.get(url);

      if (!songInfo)
      {
        const errMsg = "Failed to retrieve song based on " + message.content;
        console.error (errMsg);
        throw err.message;
      }

      const song = {
        info: songInfo.info,
        title: songInfo.title,
        url: songInfo.url,
        length: songInfo.length,
        requestor: message.author.tag,
        query: message.content
      };

      addSongReturnVal = song;

      if (!serverQueue) 
      {
        const queueContruct = 
        {
          textChannel: message.channel,
          voiceChannel: voiceChannel,
          connection: null,
          songs: [],
          volume: 5
        };

        queue.set(message.guild.id, queueContruct);

        console.log("adding song " + song.title + ","+ song.url + "," + song.length + "," + song.query);
        queueContruct.songs.push(song);

        try {
          var connection = await voiceChannel.join();
          queueContruct.connection = connection;
        } catch (err) {
          console.log("error=" + err);
          queue.delete(message.guild.id);
          throw err.message;
        }
      } 
      else 
      {

        console.log("adding song " + song.title + ","+ song.url + "," + song.length);
        serverQueue.songs.push(song);
      }
    } catch (error) {
      console.error(error);
      throw error.message;

    }
  },

  async addWithMsg(message, url)
  {
    try
    {
      await this.add(message, url);
      msgFormatter.flashTextMessage(message.channel, null, `${addSongReturnVal.title} has been added to the queue!`);
    }
    catch (err)
    {
      msgFormatter.flashTextMessage(message.channel, 'Unexpected Error', err.message);
    }
  }

};
