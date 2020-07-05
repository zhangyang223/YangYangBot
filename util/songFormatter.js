const maxDisplaySize = 40;


module.exports = 
{

  format(song, showPlaytime) 
  {
    function formatDuration(seconds)
    {
      if (seconds == null)
        return "";
        
      try
      {
        var tmpString = new Date(seconds * 1000).toISOString().substr(11, 8);
        if (tmpString.startsWith("00:"))
        {
            tmpString = tmpString.substring(3);
        }
        return tmpString;
      }
      catch (error)
      {
        console.error(error);
        console.log("seconds=" + seconds);
      }
      return null;
    }

    function calculatePlayDuration(startTime)
    {
      if (startTime != null)
      {
        var currentTime = new Date();
        var duration = currentTime - startTime;
        return (duration > 0) ? duration/1000 : 0;
      }
      return null;
    }

    function formatSong(song)
    {
      var result = "";
      var text = song.title.trim();
      if (text.length > maxDisplaySize)
        text = text.substring(0, maxDisplaySize-3) + "...";

        result += text;
      result += " ";

      if (showPlaytime)
      {
        var playDuration = calculatePlayDuration(song.startTime);
        if (playDuration != null)
        {
          result += formatDuration(playDuration);
          result += "/";
        }
      }
      result += formatDuration(song.length);
      return result;
    }  

    return formatSong(song);
  },

  pad(number, length) 
  {

    var str = '' + number;
    while (str.length < length) {
        str = ' ' + str;
    }
   
    return str;
  },

  postpad(text, length) 
  {

    var str = '' + text;
    while (str.length < length) {
        str = str + ' ';
    }
  
    return str;
  }


};
