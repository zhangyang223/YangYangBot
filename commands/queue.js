const { Client, MessageEmbed, Util } = require("discord.js");
const ytdl = require("ytdl-core");
const msgFormatter = require("../util/formatTextMsg.js");
const currentQueue = require("../util/printCurrentQueue.js");
const parser = require("../util/parseArgs.js");
const {
	prefix,
} = require('../config.json');
const queueInterval = 10;

module.exports = 
{
  name: "queue",
  description: "[#] Show the current page, use queue 2 for the second page",
  aliases: ["q"],
  
  async execute(message) 
  {
    const textTitle = 'Play Queue';
    const emptyQueueMsg = 'Play queue is empty.  Please add more songs.';
    const commandMsg = "use <" + prefix + this.name + " "; 
    const nextPageMsg = " more in queue, " + commandMsg;

    function sendMsg(msg)
    {
     msgFormatter.flashTextMessage(message.channel, textTitle, msg)
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
          sendMsg(currentQueue.show(message, input * queueInterval, queueInterval));
      }
      else
      {
        let input  = args[0];
        console.log("input=" + input);
        sendMsg(currentQueue.show(message, (input - 1) * queueInterval, queueInterval));
      }

    } 
    catch (error) 
    {
      console.error(error);
      msgFormatter.formatTextMsg(message.channel, 'Unexpected Error', error.message);;

    }
  },

};

