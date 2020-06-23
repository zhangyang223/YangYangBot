"use strict";
const { Util } = require("discord.js");
const getSongInfo = require("../play/getSongInfo.js");
const msgFormatter = require("../util/formatTextMsg.js");
const dsConnection = require("../play/discordConnection.js");

var addSongReturnVal = null;

module.exports = 
{
  async add(message, url) 
  {
    try 
    {
      const queue = message.client.queue;
      let serverQueue = message.client.queue.get(message.guild.id);
      const voiceChannel = message.member.voice.channel;
      var songInfo = await getSongInfo.get(url);

      if (!songInfo)
      {
        const errMsg = "Failed to retrieve song based on " + message.content;
        console.error (errMsg);
        throw errMsg;
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
        await dsConnection.open(message).then( connection => 
          {
            serverQueue = message.client.queue.get(message.guild.id);
            console.log("adding song " + song.title + ","+ song.url + "," + song.length);
            serverQueue.songs.push(song);
          });

      } 
      else
      {

        console.log("adding song " + song.title + ","+ song.url + "," + song.length);
        serverQueue.songs.push(song);
      }
    } 
    catch (error) 
    {
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
/*
async function initializeVoiceConnection(message) 
{
  const queueContruct = 
  {
    textChannel: message.channel,
    voiceChannel: message.member.voice.channel,
    connection: null,
    songs: [],
    volume: 5,
    playing: false
  };
  message.client.queue.set(message.guild.id, queueContruct);
  try 
  {
    var connection = await message.member.voice.channel.join();
    queueContruct.connection = connection;
  }
  catch (err) 
  {
    console.log("error=" + err);
    message.client.queue.delete(message.guild.id);
    throw err.message;
  }
}

*/