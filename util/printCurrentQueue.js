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

    show(message, startNum, queueInterval)
    {
  
      const serverQueue = message.client.queue.get(message.guild.id);
      if (serverQueue) 
      {
        var msg = "";
  
        if (serverQueue.songs.length == 0)
        {
            return emptyQueueMsg;
        }
        else
        {
            msg = "Now Playing:\n" + (serverQueue.current + 1) + ") " + songFormatter.format(serverQueue.songs[serverQueue.current], true) + "\n\n";
  
            if (serverQueue.songs.length > 1)
            {
              let i = 0; 
              let count = i + startNum;
  
              if (count <  serverQueue.songs.length)
              {
                let pageNum = Math.floor(startNum / queueInterval) + 1;
                msg = msg + "Page #" + pageNum + "\n";
              }
        
              for (; count <serverQueue.songs.length && i < queueInterval; i++, count = i + startNum)
              {
                var song = serverQueue.songs[count];
                var tmpMsg = "";
                if (count == serverQueue.current)
                  tmpMsg += "=> "
                tmpMsg = tmpMsg + songFormatter.pad(count + 1,2) + ") " +  songFormatter.format(song, count == serverQueue.current) + "\n"; 
                msg = msg + tmpMsg;
              }
  
              let numSongLeft = serverQueue.songs.length - startNum  -  queueInterval ;
  
              if (numSongLeft > 0 )
              {
                let pageNum = Math.floor(startNum/queueInterval) + 2;
                msg = msg + "\n " + numSongLeft + nextPageMsg + pageNum + "> to see next page";
              }
              else
              {
                let pageNum = Math.floor(startNum/queueInterval);
                if (pageNum > 0)
                  msg = msg + "\n " + commandMsg + pageNum + "> to see previous page";
              }
            }
            return msg;
        }
      } 
      else 
      {
        return emptyQueueMsg;
      }
    }    
}