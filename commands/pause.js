const msgFormatter = require("../util/formatTextMsg.js");

module.exports = {
	name: 'pause',
	description: 'Pause a song',
	aliases: [],
	execute(message) {

		try
		{
			const serverQueue = message.client.queue.get(message.guild.id);
			if (!message.member.voice.channel) 
			{
				msgFormatter.formatTextMsg(message.channel, 'Error', 'You have to be in a voice channel to pause the music!');
				return;
			}
			
			if (serverQueue != null && serverQueue.connection != null && serverQueue.connection.dispatcher != null)
			{
				serverQueue.connection.dispatcher.pause(true);
			}
		}
		catch (error) {
		  console.log( error);
		  return;
		}
  
	},
};