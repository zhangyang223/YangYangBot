var iconv = require('iconv-lite');
var cheerio = require('cheerio');
const request = require('request-promise');
var expect    = require("chai").expect;
const path = require('path');

const playlistTag = 'playlistVideoRenderer';
const searchTag = 'videoRenderer';
const secondTag = 'videoId';
const playlistTitleTag = 'simpleText';
const searchTitleTag = 'text';


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
        
                let element = {url: yturl, title: ""};
                videoListFromPromise.push(element);
            });
        
            if (videoListFromPromise.length == 0)
            {
                // cannot use static html to find it.  use script
                videoListFromPromise = processScript($, tag, playlistTitleTag);
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
        
            $('.yt-lockup-title a').each(function () 
            {
                var yturl = 'https://www.youtube.com' + $(this).attr('href');
                let element = {url: yturl, title: $(this).attr('title')};
                videoListFromPromise.push(element);
            });
        
            if (videoListFromPromise.length == 0)
            {
                // cannot use static html to find it.  use script
                videoListFromPromise = processScript($, tag, searchTitleTag);
            }

            console.log("search found " + videoListFromPromise.length + " songs from Cheerio Promise");
            return videoListFromPromise;
        }

        let result = await sendRequest(url, process);
        return result;
    }
};

function getVideoList(text, startingIndex, firstTag, thirdTag)
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

        let thirdTagIndex = text.indexOf(thirdTag, secondQuoteIndex);
        let thirdQuoteIndex = text.indexOf('\"', thirdTagIndex + thirdTag.length + 1);
        let fourthQuoteIndex = text.indexOf('\"', thirdQuoteIndex + 1);
        let songTitle = text.substring(thirdQuoteIndex + 1, fourthQuoteIndex);

        let element = {url: yturl, title: songTitle};

//        console.table(element);
        result.add(element);

        firstTagIndex = text.indexOf(firstTag, fourthQuoteIndex + 1);
    }

    return result;
}

function processScript($, tag, titleTag)
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
            let setB = getVideoList(scriptBody, index, tag, titleTag);
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

