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
            title:  songInfo.title,
            url: songInfo.video_url,
            length: songInfo.length_seconds,
            startTime: null
        };
    
        return obj;
      } 
      catch (error) 
      {
        console.log("Video \"" + inputURL + "\" is not found");

        return null;
      }

    } 
    catch (error) 
    {
        console.error(error);
    }
  
  }
};