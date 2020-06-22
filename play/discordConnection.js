"use strict";
const { Util } = require("discord.js");


module.exports = 
{
    async open(message) 
    {
      const queueContruct = 
      {
        textChannel: message.channel,
        voiceChannel: message.member.voice.channel,
        connection: null,
        songs: [],
        volume: 5,
        canPlay: true
      };
      message.client.queue.set(message.guild.id, queueContruct);
      try 
      {
        var connection = await message.member.voice.channel.join().then( connection => {queueContruct.connection = connection;});
      }
      catch (err) 
      {
        console.log("error=" + err);
        message.client.queue.delete(message.guild.id);
        throw err.message;
      }
      return connection;
    },

    async close(message)
    {
      let serverQueue = message.client.queue.get(message.guild.id);

      if (serverQueue != null)
      {
        if (serverQueue.connection != null && serverQueue.connection.dispatcher != null)
        {
          serverQueue.connection.dispatcher.end();
        }
        serverQueue.voiceChannel.leave();
        message.client.queue.delete(message.guild.id);
      } 


    },

    canPlay(message)
    {
      let serverQueue = message.client.queue.get(message.guild.id);
      return serverQueue != null && serverQueue.canPlay;
    },

    setPlayable(message, value)
    {
      let serverQueue = message.client.queue.get(message.guild.id);
      if (serverQueue)
        serverQueue.canPlay = value;
    }

  };


