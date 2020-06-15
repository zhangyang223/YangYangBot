var iconv = require('iconv-lite');
var cheerio = require('cheerio');
const request = require('request-promise');
var expect    = require("chai").expect;
const {google} = require('googleapis');
const path = require('path');
const {authenticate} = require('@google-cloud/local-auth');
const {JWT} = require('google-auth-library');
const youtube = google.youtube('v3');

var auth = null;

module.exports = 
{
    async searchYouTube(searchText)
    {
        var result = null;
        let recurse = 0;
        let url1 = encodeURI("https://www.youtube.com/results?search_query=" + searchText);

        async function parsePromise(url1)
        {
            let videoListFromPromise = [];
            await request({uri: url1, encoding: null, transform: function (body) {return cheerio.load(body);}})
            .then(function($){           
                $('.yt-lockup-thumbnail a').each(function () 
                {
                    var yturl = 'https://www.youtube.com' + $(this).attr('href');
                    videoListFromPromise.push(yturl);
                });

                if (videoListFromPromise.length == 0 && recurse < 5)
                {
                    console.log("Recurse");       
                    recurse++;   
                    parsePromise(url1);
                }
                else
                {
                    console.log("found " + videoListFromPromise.length + " songs from Cheerio Promise");
                    result = videoListFromPromise[0];
                    return result;
                }
            })
            .catch(function(err){console.error(err);});
        }

        console.log("before parsePromise, url=" + url1);
        recurse = 0;
        await parsePromise(url1);
        console.log("after parsePromise");
        return result;

    }

    /*
    async searchYouTube(searchText)
    {
      var result = null;
      async function search() 
      {
        try 
        {
            
            var keyfilepath = path.join(__dirname, '../secrets/client_secret_962603753191-3o0u03pi75oid7a3161efn4kl2sqvlu8.apps.googleusercontent.com.json');
            console.log("keyfilepath=" + keyfilepath );
    
            async function getToken()
            {
                auth = await authenticate({
                    keyfilePath: keyfilepath,
                    scopes: ['https://www.googleapis.com/auth/youtube'],
                    });
                    google.options({auth});
            }


            if (!auth)
            {
                await getToken();                
            }
            
            try
            {
                var res = await youtube.search.list({
                part: 'id,snippet',
                q: searchText,
                });

            }
            catch (error)
            {
                if (error.message.search("refresh token") != -1)
                {
                    // token is no longer valid.  Needs to refresh it.
                    await getToken();
                    res = await youtube.search.list({
                        part: 'id,snippet',
                        q: searchText,
                        });
                        }
            }

            var data = res.data;
            if (data.items.length >= 1)
            {
                result = data.items[0].id.videoId;
            }
//            var myJSON = JSON.stringify(res.data);
//            console.log(myJSON);
            
        } 
        catch (error) 
        {
            console.error(error);
        }
      }
      
      await search().catch(console.error);
      console.log("search found=" + result);
      return "https://www.youtube.com/watch?v=" + result;      
    }
  */
};
