const { Client, MessageEmbed, Util } = require("discord.js");
const ytdl = require("ytdl-core");
const msgFormatter = require("../util/formatTextMsg.js");
const songFormatter = require("../util/songFormatter.js");
const parser = require("../util/parseArgs.js");
const {
	prefix,
} = require('../config.json');
const queueInterval = 10;

module.exports = 
{
  name: "queue",
  description: "[#] Show the top " + queueInterval + " songs, use queue 2 for the next set of songs",
  aliases: ["q"],
  async execute(message) 
  {
    const textTitle = 'Play Queue';
    const emptyQueueMsg = 'Play queue is empty.  Please add more songs.';
    const nextPageMsg = " more in queue, use <" + prefix + this.name + " 2> to see next page";

    try 
    {
      const queue = message.client.queue;
      const serverQueue = message.client.queue.get(message.guild.id);

      function sendMsg(msg)
      {
       msgFormatter.formatTextMsg(message.channel, textTitle, msg)
      }

      function showQueue(startNum)
      {
        if (serverQueue) 
        {
          var msg = "";
  
          if (serverQueue.songs.length == 0)
          {
              return sendMsg(emptyQueueMsg);
          }
          else
          {
              msg = "Now Playing:\n" + songFormatter.format(serverQueue.songs[0]) + "\n\n";
  
              if (serverQueue.songs.length > 1)
              {
                let i = 1; 
                let count = i + startNum;

                if (count >=  serverQueue.songs.length)
                {
                  msg = msg + "Up Next:\n";
                }
          
                for (; count <serverQueue.songs.length && i <= queueInterval; i++, count = i + startNum)
                {
                  var song = serverQueue.songs[count];
                  var tmpMsg = songFormatter.pad(count,2) + ") " +  songFormatter.format(song) + "\n"; 
                  msg = msg + tmpMsg;
                }

                let numSongLeft = serverQueue.songs.length - startNum  -  queueInterval - 1;

                if (numSongLeft > 0 )
                {
                  msg = msg + "\n " + numSongLeft + nextPageMsg;
                }
              }
              return sendMsg(msg);
          }
        } 
        else 
        {
          return sendMsg(emptyQueueMsg);
        }
      }

      const args = parser.parseIntegers(message.content);
      if (args == null)
      {
        showQueue(0);
      }
      else
      {
        let input  = args[0];
        console.log("input=" + input);
        showQueue((input - 1) * queueInterval);
      }

    } catch (error) 
    {
      console.error(error);
      msgFormatter.formatTextMsg(message.channel, 'Unexpected Error', error.message);;

    }
  }
};

