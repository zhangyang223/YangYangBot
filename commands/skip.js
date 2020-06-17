const msgFormatter = require("../util/formatTextMsg.js");

module.exports = {
	name: 'skip',
	description: 'Skip a song!',
	aliases: [],
	execute(message) {

		try
		{
			const serverQueue = message.client.queue.get(message.guild.id);
			if (!message.member.voice.channel) 
			{
				msgFormatter.formatTextMsg(message.channel, 'Error', 'You have to be in a voice channel to stop the music!');
				return;
			}

			// if nothing is playing, then that is nothing to skip.
//			if (!serverQueue || !serverQueue.connection || !serverQueue.connection.dispatcher )
//			{
//				msgFormatter.formatTextMsg(message.channel, 'Error', 'There is no song in queue');
//			} 
			
			if (serverQueue != null && serverQueue.connection != null && serverQueue.connection.dispatcher != null)
			{
				serverQueue.playing = false;
				serverQueue.connection.dispatcher.end();
			}
		}
		catch (error) {
		  console.log( error);
		  return;
		}
  
	},
};