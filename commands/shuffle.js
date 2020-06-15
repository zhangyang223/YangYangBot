const { Client, MessageEmbed, Util } = require("discord.js");
const msgFormatter = require("../util/formatTextMsg.js");

//const maxDisplaySize = 40;

module.exports = 
{
  name: "shuffle",
  description: "Shuffle queue",
  aliases: [],
  async execute(message) 
  {
    const textTitle = 'Queue Shuffled';
    const emptyQueueMsg = 'Play queue is empty.';

    function shuffle(array) 
    {
        var currentIndex = array.length, temporaryValue, randomIndex;
      
        // While there remain elements to shuffle...
        while (1 !== currentIndex) {
      
          // Pick a remaining element...
          randomIndex = Math.floor(Math.random() * currentIndex) + 1;
          currentIndex -= 1;
      
          // And swap it with the current element.
          temporaryValue = array[currentIndex];
          array[currentIndex] = array[randomIndex];
          array[randomIndex] = temporaryValue;
        }
      
        return array;
    }

    try 
    {
      const queue = message.client.queue;
      const serverQueue = message.client.queue.get(message.guild.id);

      function sendMsg(msg)
      {
       msgFormatter.flashTextMessage(message.channel, textTitle, msg);
      }

      if (serverQueue && serverQueue.songs) 
      {
        var msg = "done";

        if (serverQueue.songs.length == 0)
        {
            return sendMsg(emptyQueueMsg);
        }
        else
        {
            shuffle(serverQueue.songs);
            return sendMsg(msg);
        }
      } 
      else 
      {
        return sendMsg(emptyQueueMsg);
      }
    } 
    catch (error) 
    {
      console.error(error);
      msgFormatter.flashTextMessage(message.channel, 'Unexpected Error', error.message);;

    }
  }
};

