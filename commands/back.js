const msgFormatter = require("../util/formatTextMsg.js");

module.exports = {
	name: 'back',
	description: 'Play previous song',
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
				if (serverQueue.current > 1)
				{
					serverQueue.songs[serverQueue.current].startTime = null;
					serverQueue.connection.dispatcher.end();
					serverQueue.current -= 2;
				}
				else
				{
					msgFormatter.flashTextMessage(message.channel, 'Error', 'No previous song');
				}

			}
		}
		catch (error) {
		  console.log( error);
		  return;
		}
  
	},
};