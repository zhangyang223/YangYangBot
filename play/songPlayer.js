"use strict";
const { Util } = require("discord.js");
const ytdl = require("ytdl-core");
const printCurrentQueue = require("../util/printCurrentQueue.js");
const msgFormatter = require("../util/formatTextMsg.js");
const dsConnection = require("../play/discordConnection.js");

module.exports = {
  async play(message) {
    const queue = message.client.queue;
    const guild = message.guild;
    const serverQueue = queue.get(message.guild.id);

    async function displayMsg(msg, song)
    {
        return msgFormatter.flashTextMessage(serverQueue.textChannel, null, `${msg} ${song.title}`);;
    }

    let totalDownload = -1;
    let totalPlayed = 0;
    let totalLength = 0;

    function playbackProgress(ytdlStream)
    {
      let currentPert = -1;

      ytdlStream.on('progress', function(chunkLength, totalSoFar, totalSize) {
        totalDownload = totalSoFar;
        totalLength = totalSize;
        totalPlayed += chunkLength;
        let completePert = Math.trunc((totalDownload *100 / totalLength));
        if ((completePert % 10) == 0 && completePert > currentPert)
        {
            process.stdout.write("Playinging " + completePert + " %" + "\r"); 
            //console.log(completePert + "%");
        }
      });
    }

    function createYTDLStream(song)
    {
      var audioonlyoption = {filter: 'audioonly'};
      var option = { highWaterMark: 1<<25, quality: 'highestaudio' };

      if (song.info != null)
        return ytdl.downloadFromInfo(song.info, option);
      else
        return ytdl(song.url, option);
    };

    async function playcore(song)
    {
      try
      {
        totalDownload = -1;
        totalLength = 0;
        if (!song) 
        {
          console.log("SONG IS NULL in playcore");
          return;
        }

        var ytdlStream = createYTDLStream(song);

        if (!serverQueue.connection)
          console.log("connection is null");

        const dispatcher = serverQueue.connection
          .play(ytdlStream)
          .on("finish", () => {
            try
            {
              if (totalDownload < totalLength)
              {
                console.log("Song was not finished(" + totalDownload + "," + totalLength + ")\n");
              } 
              else
              {
                console.log("Song was finished Successfully (" + totalDownload + "," + totalLength + ")\n");
              }
              // play the next song
//              serverQueue.songs.shift();
              serverQueue.current++;
              playSongAux(message);
            }
            catch (err)
            {
              console.error(err);
            }
          })
          .on("start", () => {console.log("playing starts at " + new Date().toLocaleTimeString()); song.startTime = new Date();})
          .on("error", error => {
              console.log("error occurred during playing"); 
              console.error(error); 
//              serverQueue.songs.shift(); 
              serverQueue.current++;
              displayMsg("Error Playing ");
              playSongAux(message);
            });

        dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);

        playbackProgress(ytdlStream);
        return {};
      }
      catch (error) {
        console.log( error);
        return;
      }
    }

    function playcoreMock(song)
    {
      try
      {
        console.log("playing song");
//        serverQueue.songs.shift();
        serverQueue.current++;
        playSong(message);
      }
      catch (err)
      {
        console.error(err);    
      }

    }

    async function playcoreMsg(song, msg)
    {
      displayMsg(msg, song);
      playcore(song);

//      playcoreMock(song);
    }

    function playSongWithMsg(song)
    {
      playcoreMsg(song, "Start playing " + (serverQueue.current + 1) + ") ");
    }

    function announce(song)
    {
      /*
      console.log("announce");
      printCurrentQueue.print(message);
      try
      {
        const magicSpeedNumber = 20;
        const overheadCount = 35;
        const magicBuffer = 1;
        const secToWait = ((overheadCount + song.title.length) / magicSpeedNumber) + magicBuffer;

        async function queueSong() 
        {
          let promise = new Promise((resolve, reject) => {
            setTimeout(() => resolve("done!"), 1000 * secToWait)
          });
        
          let result = await promise; // wait until the promise resolves (*)
          playSongWithMsg(song);
        }
        serverQueue.textChannel.send(`Next Song is ${song.title}`, { tts: true })
        .then(msg => {
          msg.delete({ timeout: 10000 })
          })
          .catch(console.error);
  
        queueSong();

      }
      catch (error) {
        console.log( error);
        return;
      }
      */
     playSongWithMsg(song);
    }

    function playSongAux(message)
    {
      var id = serverQueue.songs.length;
      console.log("playSongAux starting(" + id +"," + dsConnection.canPlay(message) + ")");
      try 
      {

        if (!serverQueue || serverQueue.songs.length == 0)
        {
          console.log("serverQ is null || songs length = 0");
          //dsConnection.close(message);
          return;
        }

        if (serverQueue.current >= serverQueue.songs.length)
        {
          serverQueue.current = 0;
        }

        dsConnection.setPlayable(message, false);
        var song = serverQueue.songs[serverQueue.current];
        announce(song);
//        playSongWithMsg(song);
        console.log("playSongAux finished(" + id + ")");
      } 
      catch (err) 
      {err
        console.log("error=" + err);
        queue.delete(message.guild.id);
        msgFormatter.flashTextMsg(message.channel, 'Unexpected Error', err.message);
      }
    }

    function playSong(message)
    {

      if (!dsConnection.canPlay(message)) 
      {
        console.log("Currently playing, do not play the next song");
        return;
      }

      playSongAux(message);

    }

    playSong(message);
  }
};
