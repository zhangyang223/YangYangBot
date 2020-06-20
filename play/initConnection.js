"use strict";
const { Util } = require("discord.js");


module.exports = 
{
    async initializeVoiceConnection(message) 
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
        var connection = await message.member.voice.channel.join().then( connection => {queueContruct.connection = connection;});
      }
      catch (err) 
      {
        console.log("error=" + err);
        message.client.queue.delete(message.guild.id);
        throw err.message;
      }
      return connection;
    }
};


