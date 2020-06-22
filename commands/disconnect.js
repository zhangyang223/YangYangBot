const msgFormatter = require("../util/formatTextMsg.js");
const dsConnection = require("../play/discordConnection.js");

module.exports = {
	name: 'disconnect',
	description: 'Disconnect bot',
	aliases: ["dc"],
	execute(message) {
		const serverQueue = message.client.queue.get(message.guild.id);
		if (!message.member.voice.channel) 
		{
			msgFormatter.formatTextMsg(message.channel, 'Error', 'You have to be in a voice channel to stop the music!');
		}

		if (serverQueue != null)
		{
            if (serverQueue.songs != null)
                serverQueue.songs = [];

			if (serverQueue.connection != null)
			{
				dsConnection.setPlayable(message, false);
				dsConnection.close(message);
			}
        }
    }
};