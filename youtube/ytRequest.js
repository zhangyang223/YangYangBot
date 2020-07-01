var iconv = require('iconv-lite');
var cheerio = require('cheerio');
const request = require('request-promise');
var expect    = require("chai").expect;
const path = require('path');

const playlistTag = 'playlistVideoRenderer';
const searchTag = 'videoRenderer';
const secondTag = 'videoId';


//let result = [];

module.exports = 
{
    async get(playlistURL)
    {

        const tag = playlistTag;

        function process($)
        {
            let videoListFromPromise = [];
        
            $('.pl-video-title-link').each(function () 
            {
                var yturl = 'https://www.youtube.com' + $(this).attr('href').replace(/&amp;/g, '&');
                var uriAmpIndex = yturl.indexOf('&');
                if (uriAmpIndex != -1)
                {
                    yturl = yturl.substring(0, uriAmpIndex);
                }
        
                videoListFromPromise.push(yturl);
            });
        
            if (videoListFromPromise.length == 0)
            {
                // cannot use static html to find it.  use script
                videoListFromPromise = processScript($, tag);
            }

            console.log("playlist found " + videoListFromPromise.length + " songs from Cheerio Promise");
            return videoListFromPromise;
        }
        
        let result = await sendRequest(playlistURL, process);
        return result;
    },
    
    async search(query)
    {
        const tag = searchTag;
        let url = encodeURI("https://www.youtube.com/results?search_query=" + query);

        function process($)
        {
            let videoListFromPromise = [];
            let result = "";
        
            $('.yt-lockup-thumbnail a').each(function () 
            {
                var yturl = 'https://www.youtube.com' + $(this).attr('href');
                videoListFromPromise.push(yturl);
            });
        
            if (videoListFromPromise.length == 0)
            {
                // cannot use static html to find it.  use script
                videoListFromPromise = processScript($, tag);
            }

            console.log("search found " + videoListFromPromise.length + " songs from Cheerio Promise");
            if (videoListFromPromise.length > 0)
                result = videoListFromPromise[0];
            return result;
        }

        let result = await sendRequest(url, process);
        return result;
    }
};

function getVideoList(text, startingIndex, firstTag)
{
    let index = startingIndex;
    let result = new Set();

    let firstTagIndex = text.indexOf(firstTag, index);
    
    while (firstTagIndex != -1)
    {
        let secondTagIndex = text.indexOf(secondTag, firstTagIndex);
        let firstQuoteIndex = text.indexOf('\"', secondTagIndex + secondTag.length + 1);
        let secondQuoteIndex = text.indexOf('\"', firstQuoteIndex + 1);
        let videoId = text.substring(firstQuoteIndex + 1, secondQuoteIndex);
        var yturl = 'https://www.youtube.com/watch?v='+ videoId;

//        console.log("adding " + yturl);
        result.add(yturl);

        firstTagIndex = text.indexOf(firstTag, secondQuoteIndex + 1);
    }

    return result;
}

function processScript($, tag)
{
    // {"playlistVideoRenderer":{"videoId":"2zaJopX5a4w"
    let scriptTag = 'ytInitialData';
    let videoListSet = new Set();

    $('script ').each(function () 
    {
        let scriptBody = $(this).html();
        let index = scriptBody.indexOf(scriptTag);
        if (index != -1)
        {
            let setB = getVideoList(scriptBody, index, tag);
            for (let elem of setB) 
            {
                videoListSet.add(elem);
            }
        }
    });

    let videoListfromPromise = Array.from(videoListSet);
    return videoListfromPromise;
}


async function sendRequest(url1, processCB)
{
    return await request({uri: url1, encoding: null, transform: function (body) {return cheerio.load(body);}})
    .then(processCB)
    .catch(function(err){console.error(err);});
}

