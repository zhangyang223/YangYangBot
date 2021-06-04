"use strict";
const { Util } = require("discord.js");
const getSongInfo = require("../play/getSongInfo.js");
const msgFormatter = require("../util/formatTextMsg.js");
const dsConnection = require("../play/discordConnection.js");
const addPlaylist = require("./addPlaylist.js");
const { min } = require("underscore");
const songPlayer = require("./songPlayer.js");

var addedSongTitle = null;

module.exports = 
{
  async addWithoutInfo(message, info1, title1, url1, length1) 
  {
    try 
    {
      const queue = message.client.queue;
      let serverQueue = message.client.queue.get(message.guild.id);
      const voiceChannel = message.member.voice.channel;

      const song = {
        info: info1,
        title: title1,
        url: url1,
        length: length1,
        requestor: message.author.tag,
        query: message.content
      };

      addedSongTitle = song.title;

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

      return song;
    } 
    catch (error) 
    {
      console.error(error);
    }
  },

  async add(message, url) 
  {
    try 
    {
      var songInfo = await getSongInfo.get(url);

      if (!songInfo)
      {
        const errMsg = "Failed to retrieve song based on " + message.content;
        console.error (errMsg);
        throw new Error(errMsg);
      }

      return this.addWithoutInfo(message, songInfo.info, songInfo.title, songInfo.url, songInfo.length);

    } 
    catch (error) 
    {
      console.error(error);
    }
  },

  async addWithMsg(message, url)
  {
    try
    {
      return this.add(message, url).then(() => {
        msgFormatter.flashTextMessage(message.channel, null, `${addedSongTitle} has been added to the queue!`); 
//        songPlayer.play(message);
      });
    }
    catch (err)
    {
      msgFormatter.flashTextMessage(message.channel, 'Unexpected Error', err.message);
    }
  },
   
  async addPlaylist(message, playlist)
  {
    try
    {
      const queue = message.client.queue;
      let serverQueue = message.client.queue.get(message.guild.id);
      const voiceChannel = message.member.voice.channel;

      // randomize playlist
      function shuffleArray(arr) {
        arr.sort(() => Math.random() - 0.5);
      }

      shuffleArray(playlist);

      for (let i = 0; i < playlist.length; i++)
      {
        const song = {
          info: null,
          title: playlist[i].title,
          url: playlist[i].url,
          length: playlist[i].length,
          requestor: message.author.tag,
          query: message.content
        };

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
      return serverQueue.songs.length;
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