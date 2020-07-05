const msgFormatter = require("../util/formatTextMsg.js");
const database = require("../util/database.js");
const dsConnection = require("../play/discordConnection.js");
const songPlayer = require("../play/songPlayer.js");
const queue = require("../commands/queue.js");

module.exports = {
	name: 'load',
	description: 'load the previously saved songs',
	aliases: [],
	execute(message) {

		try
		{
			let serverQueue = message.client.queue.get(message.guild.id);
			if (!message.member.voice.channel) 
			{
				msgFormatter.flashTextMessage(message.channel, 'Error', 'You have to be in a voice channel to load song queue!');
				return;
			}
			
			if (!serverQueue) 
			{
			  dsConnection.open(message).then( connection => 
				{
				  serverQueue = message.client.queue.get(message.guild.id);
				  serverQueue.songs = database.read(message.guild.id);
				  msgFormatter.flashTextMessage(message.channel, null, 'Loaded ' + serverQueue.songs.length + ' songs');
//				  queue.show(message, 0);
				  songPlayer.play(message);
				});
			}
			else	  
			{
				if (serverQueue != null && serverQueue.connection != null && serverQueue.connection.dispatcher != null)
				{
					serverQueue.songs[serverQueue.current].startTime = null;
					serverQueue.connection.dispatcher.end();
				}
	
				serverQueue.songs = database.read(message.guild.id);
				serverQueue.current = serverQueue.songs.length;
				msgFormatter.flashTextMessage(message.channel, null, 'Loaded ' + serverQueue.songs.length + ' songs');
//				queue.show(message, 0);
			}
		}
		catch (error) {
		  console.log( error);
		  return;
		}
  
	},
};