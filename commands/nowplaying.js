const msgFormatter = require("../util/formatTextMsg.js");
const songFormatter = require("../util/songFormatter.js");

module.exports = {
	name: 'nowplaying',
	description: 'Get the song that is playing.',
	aliases: ["np"],
	execute(message) {
		const serverQueue = message.client.queue.get(message.guild.id);
		if (!serverQueue) 
		{
			return msgFormatter.flashTextMessage(message.channel, null, 'There is nothing playing.');;
//			return message.channel.send('There is nothing playing.');
		}
		else
			return msgFormatter.flashTextMessage(message.channel, null, "Now playing: " + (serverQueue.current + 1) + ") " + songFormatter.format(serverQueue.songs[serverQueue.current], true));;
		//		return message.channel.send(`Now playing: ${serverQueue.songs[0].title}`);
	},
};



