const msgFormatter = require("../util/formatTextMsg.js");
const database = require("../util/database.js");

module.exports = {
	name: 'save',
	description: 'save the current song queue',
	aliases: [],
	execute(message) {

		try
		{
			const serverQueue = message.client.queue.get(message.guild.id);
			if (!message.member.voice.channel) 
			{
				msgFormatter.flashTextMessage(message.channel, 'Error', 'You have to be in a voice channel to load song queue!');
				return;
			}
			
			if (!serverQueue || !serverQueue.songs || serverQueue.songs.length == 0) 
			{
			  msgFormatter.flashTextMessage(message.channel, "Error", 'there is no songs in queue');
			}
			else	  
			{
				database.write(serverQueue.songs, message.guild.id);
				msgFormatter.flashTextMessage(message.channel, null, 'Saved ' + serverQueue.songs.length + ' songs');
			}
		}
		catch (error) {
		  console.log( error);
		  return;
		}
  
	},
};