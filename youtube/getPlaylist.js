var iconv = require('iconv-lite');
var cheerio = require('cheerio');
const request = require('request-promise');
var expect    = require("chai").expect;
const path = require('path');


module.exports = 
{
    async get(playlistURL)
    {
        var result = null;
        let url1 = playlistURL;
        let videoListFromPromise = [];

        function getVideoList(text, startingIndex)
        {
            let firstTag = 'playlistVideoRenderer';
            const secondTag = 'videoId';
            let index = startingIndex;

            let firstTagIndex = text.indexOf(firstTag, index);
            
            while (firstTagIndex != -1)
            {
                let secondTagIndex = text.indexOf(secondTag, firstTagIndex);
                let firstQuoteIndex = text.indexOf('\"', secondTagIndex + secondTag.length + 1);
                let secondQuoteIndex = text.indexOf('\"', firstQuoteIndex + 1);
                let videoId = text.substring(firstQuoteIndex + 1, secondQuoteIndex);
                var yturl = 'https://www.youtube.com/watch?v='+ videoId;

                videoListFromPromise.push(yturl);

                firstTagIndex = text.indexOf(firstTag, secondQuoteIndex + 1);
            }
        }

        function processScript($)
        {
            // {"playlistVideoRenderer":{"videoId":"2zaJopX5a4w"
            let scriptTag = 'ytInitialData';
            $('script ').each(function () 
            {
                let scriptBody = $(this).html();
                let index = scriptBody.indexOf(scriptTag);
                if (index != -1)
                {
                    getVideoList(scriptBody, index);
                }
            });

            return videoListFromPromise;
        }

        function process($)
        {
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
                result = processScript($);
            }
            else
            {
                console.log("found " + videoListFromPromise.length + " songs from Cheerio Promise");
                result = videoListFromPromise[0];
            }
        }

        async function parsePromise(url1)
        {
            await request({uri: url1, encoding: null, transform: function (body) {return cheerio.load(body);}})
            .then(process)
            .catch(function(err){console.error(err);});
        }

        await parsePromise(url1);
        console.log("getPlaylist result.length=" + result.length);
        return result;

    }
};
