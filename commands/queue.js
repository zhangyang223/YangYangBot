const { Client, MessageEmbed, Util } = require("discord.js");
const ytdl = require("ytdl-core");
const msgFormatter = require("../util/formatTextMsg.js");
const parser = require("../util/parseArgs.js");
const songFormatter = require("../util/songFormatter.js");
const {
	prefix,
} = require('../config.json');

module.exports = 
{
  name: "queue",
  description: "[#] Show the current page, use queue 2 for the second page",
  aliases: ["q"],
  
  async execute(message) 
  {
    const textTitle = 'Play Queue';
    const queueInterval = 10;
    const commandMsg = "use <" + prefix + this.name + " "; 
    const nextPageMsg = " more in queue, " + commandMsg;
        
    function sendMsg(msg)
    {
     msgFormatter.flashTextMessage(message.channel, textTitle, msg)
    }

    function show(message, startNum)
    {
      const serverQueue = message.client.queue.get(message.guild.id);
      const emptyQueueMsg = 'Play queue is empty.  Please add more songs.';
      if (serverQueue) 
      {
        var msg = "";
  
        if (serverQueue.songs.length == 0)
        {
            return emptyQueueMsg;
        }
        else
        {
            msg = "Now Playing:\n" + (serverQueue.current + 1) + ") " + songFormatter.format(serverQueue.songs[serverQueue.current], true) + "\n\n";
  
            if (serverQueue.songs.length > 1)
            {
              let i = 0; 
              let count = i + startNum;
  
              if (count <  serverQueue.songs.length)
              {
                let pageNum = Math.floor(startNum / queueInterval) + 1;
                msg = msg + "Page #" + pageNum + "\n";
              }
        
              for (; count <serverQueue.songs.length && i < queueInterval; i++, count = i + startNum)
              {
                var song = serverQueue.songs[count];
                var tmpMsg = "";
                if (count == serverQueue.current)
                  tmpMsg += "=> "
                tmpMsg = tmpMsg + songFormatter.pad(count + 1,2) + ") " +  songFormatter.format(song, count == serverQueue.current) + "\n"; 
                msg = msg + tmpMsg;
              }
  
              let numSongLeft = serverQueue.songs.length - startNum  -  queueInterval ;
  
              if (numSongLeft > 0 )
              {
                let pageNum = Math.floor(startNum/queueInterval) + 2;
                msg = msg + "\n " + numSongLeft + nextPageMsg + pageNum + "> to see next page";
              }
              else
              {
                let pageNum = Math.floor(startNum/queueInterval);
                if (pageNum > 0)
                  msg = msg + "\n " + commandMsg + pageNum + "> to see previous page";
              }
            }
            return msg;
        }
      } 
      else 
      {
        return emptyQueueMsg;
      }
    }    

    try 
    {
      const queue = message.client.queue;
      const serverQueue = message.client.queue.get(message.guild.id);

      const args = parser.parseIntegers(message.content);
      if (args == null)
      {
        let input = 0;
        if (serverQueue != null && serverQueue.current != null)
          input = Math.floor(serverQueue.current / queueInterval);
          sendMsg(show(message, input * queueInterval));
      }
      else
      {
        let input  = args[0];
        console.log("input=" + input);
        sendMsg(show(message, (input - 1) * queueInterval));
      }

    } 
    catch (error) 
    {
      console.error(error);
      msgFormatter.formatTextMsg(message.channel, 'Unexpected Error', error.message);;

    }
  }


};

