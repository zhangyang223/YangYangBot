const msgFormatter = require("../util/formatTextMsg.js");

module.exports = {
	name: 'resume',
	description: 'Resume a song',
	aliases: [],
	execute(message) {

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
				serverQueue.connection.dispatcher.resume();
			}
		}
		catch (error) {
		  console.log( error);
		  return;
		}
  
	},
};