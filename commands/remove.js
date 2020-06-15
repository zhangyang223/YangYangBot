const msgFormatter = require("../util/formatTextMsg.js");
const parser = require("../util/parseArgs.js");
const {
	prefix,
} = require('../config.json');


module.exports = {
	name: 'remove',
	description: 'remove <pos>,[<endPos>] Remove a specific song(or songs) from queue',
	aliases: [],
    execute(message) 
    {
        const args = parser.parseIntegers(prefix + 'remove', message.content);
        if (args == null || args.length < 1)
        {
            return message.reply('remove <pos>,[<endPos>] Remove a specific song(or songs) from queue');
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

                let pos = args[0];
                let endPos = -1;

                if (pos < 1 || pos >= maxQueueSize)
                {
                    return message.reply('Please input valid pos number')
                }

                if (args.length == 2)
                {
                    endPos = args[1];

                    if ( endPos < 1 || endPos >= maxQueueSize)
                    {
                        return message.reply('Please input valid endPos number')
                    }
                    else
                    {
                        serverQueue.songs.splice(pos, endPos - pos + 1);
                    }
                }
                else
                    serverQueue.songs.splice(pos, 1);
            }
        }
	},
};