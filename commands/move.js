const msgFormatter = require("../util/formatTextMsg.js");
const songFormatter = require("../util/songFormatter.js");
const parser = require("../util/parseArgs.js");
const {
	prefix,
} = require('../config.json');


module.exports = {
	name: 'move',
	description: 'move <track>, <new position> Move the songs into new position',
	aliases: [],
    execute(message) 
    {
        const args = parser.parseIntegers( message.content);
        if (args == null || args.length != 2)
        {
            return message.reply('move [track], [new position] Move the songs into new position');
        }
        else
        {
            const serverQueue = message.client.queue.get(message.guild.id);
            if (!serverQueue) 
            {
                return msgFormatter.formatTextMsg(message.channel, null, 'There is nothing in queue');;
            }
            else
            {
                let maxQueueSize = serverQueue.songs.length;
                let track = args[0];
                let pos = args[1];

                if ( track < 1 || track > maxQueueSize || pos < 1 || pos > maxQueueSize)
                {
                    return message.reply('Please input valid track and position numbers')
                }
                else
                {
                    let tmp = serverQueue.songs.splice(track - 1,1);
                    if (tmp != null && tmp.length == 1)
                    {
                        serverQueue.songs.splice(pos - 1, 0, tmp[0]);

                        return msgFormatter.formatTextMsg(message.channel, null, "Moved " + tmp[0].title + " to position " + pos);;
                    }
                }
            }
        }
	},
};



