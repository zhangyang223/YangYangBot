"use strict";
const { Util } = require("discord.js");
const ytdl = require("ytdl-core");

module.exports = 
{
  async get(url) 
  {
    try 
    {
      var inputURL = url;
      var songInfo;

      try
      {
        songInfo = await ytdl.getInfo(inputURL);
        var obj = 
        {
            info: songInfo,
            title:  songInfo.videoDetails.title,
            url: songInfo.videoDetails.video_url,
            length: songInfo.videoDetails.lengthSeconds,
            startTime: null
        };
    
        return obj;
      } 
      catch (error) 
      {
        console.log("Video \"" + inputURL + "\" is not found");
        console.error(error);

        return null;
      }

    } 
    catch (error) 
    {
        console.error(error);
    }
  
  }
};
