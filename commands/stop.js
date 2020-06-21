const msgFormatter = require("../util/formatTextMsg.js");
const dsConnection = require("../play/discordConnection.js");

module.exports = {
	name: 'stop',
	description: 'Stop playing songs',
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
			
			if (serverQueue != null && serverQueue.connection != null && serverQueue.connection.dispatcher != null)
			{
				dsConnection.setPlayable(message, false);
				serverQueue.connection.dispatcher.end();
			}
		}
		catch (error) {
		  console.log( error);
		  return;
		}
  
	},
};