const msgFormatter = require("../util/formatTextMsg.js");
const parser = require("../util/parseArgs.js");
const {
	prefix,
} = require('../config.json');

module.exports = {
	name: 'volume',
	description: '[10-200] Change volume between 1 to 200%',
	aliases: [],
    execute(message) 
    {

		try
		{
			const serverQueue = message.client.queue.get(message.guild.id);
			if (!message.member.voice.channel) 
			{
				msgFormatter.formatTextMsg(message.channel, 'Error', 'You have to be in a voice channel to resume the music!');
				return;
			}
			
			if (serverQueue != null && serverQueue.connection != null && serverQueue.connection.dispatcher != null)
			{
                const args = parser.parseIntegers(message.content);
                if (args == null)
                {
                    return message.reply(this.name + ", " + this.description);
                }
                else
                {
                    let v = args[0] / 100;
                    console.log("setting voluem to " + v);
                    serverQueue.connection.dispatcher.setVolume(v);
                    msgFormatter.formatTextMsg(message.channel, null, 'Setting Volume to ' + args[0] + "%");
                }
			}
		}
		catch (error) {
		  console.log( error);
		  return;
		}
  
	},
};