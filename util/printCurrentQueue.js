const songFormatter = require("../util/songFormatter.js");



module.exports = 
{
    print(message)
    {
        function formatSong(song)
        {
        return song.title + " | " + song.length + " | " + song.requestor ;
        }
        
        const serverQueue = message.client.queue.get(message.guild.id);
        
        if (serverQueue == null)
            return;
            
        var msg = "Now Playing:\n" + formatSong(serverQueue.songs[0]) + "\n\n";
        
        if (serverQueue.songs.length > 1)
        {
            msg = msg + "Up Next:\n";
            var i = 1; 
            var count = 1;
        
            for (;i <serverQueue.songs.length; i++)
            {
                var song = serverQueue.songs[i];
                if (!song.tts)
                {
                    var tmpMsg = count + ") " +  formatSong(song) + "\n"; 
                    msg = msg + tmpMsg;
                    count ++;
                }
            }
        }
        console.log(msg);
        
    },

}