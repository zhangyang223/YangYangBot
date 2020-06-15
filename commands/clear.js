const msgFormatter = require("../util/formatTextMsg.js");

module.exports = {
	name: 'clear',
	description: 'Remove all songs from queue',
	aliases: [],
	execute(message) {
		const serverQueue = message.client.queue.get(message.guild.id);
		if (!message.member.voice.channel) 
		{
			msgFormatter.formatTextMsg(message.channel, 'Error', 'You have to be in a voice channel to clear queue.');
		}

		if (serverQueue != null)
		{
            if (serverQueue.songs != null)
                serverQueue.songs.splice(1, serverQueue.songs.length - 1);
        }
    }
};