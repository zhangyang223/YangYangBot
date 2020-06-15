const cleanURL = require("../util/cleanURL.js");
const { KSoftClient } = require('@ksoft/api');

const ksoft = new KSoftClient('a4c6aef23cdde42913dc6d70e4de4a90b52f110b');

module.exports = 
{
    async get(query)
    {
        var lyrics = "";
        
        //var option = { textOnly: true };
        //var tracks = await ksoft.lyrics.search(query, option);
        var tracks = await ksoft.lyrics.search(query);
    
        var songFound = false;
    
        for(var item of tracks) 
        {
            if (item.name != null)
            {
                if (item.name.search(query) != -1)
                {
                // found it.
                console.log("Found exact match using " + query);
                console.table(item.lyrics);
                if (lyrics.length == 0 || item.lyrics.length < lyrics.length)
                {
                    console.log("using this one and replacing previous one");
                    lyrics = item.lyrics;
                }
                songFound = true;
                }
            }
        };
    
        if (!songFound)
        {
            for(var item of tracks) 
            {
            if (item.lyrics != null)
            {
                if (item.lyrics.search(query) != -1)
                {
                // found it.
                console.log("Found through lyrics using " + query);
                console.table(item.lyrics);
                lyrics = item.lyrics;
                songFound = true;
                break;
                }
            }
            }
        }
    
        if (!songFound)
        {
            console.log("Failed to find any lyrics");
        }

        return lyrics;
    }
};



