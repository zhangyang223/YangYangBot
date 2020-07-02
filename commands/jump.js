const msgFormatter = require("../util/formatTextMsg.js");
const parser = require("../util/parseArgs.js");


module.exports = {
	name: 'jump',
	description: '[#] Jump a specific song',
	aliases: [],
	execute(message) {

		try
		{
			const serverQueue = message.client.queue.get(message.guild.id);
			if (!message.member.voice.channel) 
			{
				msgFormatter.flashTextMessage(message.channel, 'Error', 'You have to be in a voice channel to stop the music!');
				return;
			}
			
			if (serverQueue != null && serverQueue.connection != null && serverQueue.connection.dispatcher != null)
			{
				const args = parser.parseIntegers(message.content);
				if (args == null)
				{
					msgFormatter.flashTextMessage(message.channel, 'Error', 'Please input a song number, e.g. jump 2');
					return;
				}
				else
				{
					let input  = args[0];
					if (input < 1 || input > serverQueue.songs.length)
					{
						msgFormatter.flashTextMessage(message.channel, 'Error', 'Please input a valid song number, e.g. jump 2');
						return;
					}
					serverQueue.songs[serverQueue.current].startTime = null;
					serverQueue.connection.dispatcher.end();
					serverQueue.current = (input - 2);
					msgFormatter.flashTextMessage(message.channel, null, 'Jump to song# ' + input);
				}
			}
		}
		catch (error) {
		  console.log( error);
		  return;
		}
  
	},
};