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
const lengthTag = "lengthText";


//let result = [];

module.exports = 
{
    scrapePlaylistFromHTML(html)
    {
        return scrapePlaylist(cheerio.load(html));
    },

    async get(playlistURL)
    {
        return await sendRequest(playlistURL, scrapePlaylist);
    },
    
    scrapeSearchFromHTML(html)
    {
        return scrapeSearch(cheerio.load(html));
    },

    async search(query)
    {
        let url = encodeURI("https://www.youtube.com/results?search_query=" + query);

        return await sendRequest(url, scrapeSearch);
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

function convertTimecodeToSeconds(timecode)
{
    let timeArray = timecode.trim().split(":");
    let seconds = 0;
    if (timeArray.length > 2)
    {
        // hh:mm:ss
        seconds = ((parseInt(timeArray[0]) * 60) + parseInt(timeArray[1])) * 60 + parseInt(timeArray[2]);
    }
    else if (timeArray.length == 2)
    {
        seconds = parseInt(timeArray[0]) * 60 + parseInt(timeArray[1]);
    }
    else if (timeArray.length == 1)
    {
        seconds = parseInt(timeArray[0]);
    }

    return seconds;
}

function getVideoListWithDuration(text, startingIndex, firstTag, thirdTag, lengthTag)
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

        let fourthTagIndex = text.indexOf(lengthTag, fourthQuoteIndex);
        let durationTagIndex = text.indexOf(playlistTitleTag, fourthTagIndex);
        let fifthQuoteIndex = text.indexOf('\"', durationTagIndex + playlistTitleTag.length + 1);
        let sixthQuoteIndex = text.indexOf('\"', fifthQuoteIndex + 1);
        let songLength = text.substring(fifthQuoteIndex + 1, sixthQuoteIndex);

        let songLengthInSeconds = convertTimecodeToSeconds(songLength);
        let element = {url: yturl, title: songTitle, length: songLengthInSeconds};

        //console.table(element);
        result.add(element);

        firstTagIndex = text.indexOf(firstTag, sixthQuoteIndex + 1);
    }

    return result;
}

function scrapePlaylist($)
{
    let videoListFromPromise = [];

    $('.pl-video').each(function () 
    {
        let titleLink = $('.pl-video-title .pl-video-title-link', this);
        var yturl = 'https://www.youtube.com' + titleLink.attr('href').replace(/&amp;/g, '&');
        var uriAmpIndex = yturl.indexOf('&');
        if (uriAmpIndex != -1)
        {
            yturl = yturl.substring(0, uriAmpIndex);
        }

        let songTitle = titleLink.text();
        let songLength = $(".pl-video-time .more-menu-wrapper .timestamp", this).children().first().text();
        
        let songLengthInSeconds = convertTimecodeToSeconds(songLength);
        let element = {url: yturl, title: songTitle, length: songLengthInSeconds};
//        console.log("dom parser");
//        console.table(element);
        videoListFromPromise.push(element);
    });

    if (videoListFromPromise.length == 0)
    {
        // cannot use static html to find it.  use script
//                videoListFromPromise = processScript($, tag, playlistTitleTag);
        videoListFromPromise = processScript($, (body, index) => {return getVideoListWithDuration(body, index, playlistTag, playlistTitleTag, lengthTag);});
    }

    console.log("playlist found " + videoListFromPromise.length + " songs from Cheerio Promise");
    return videoListFromPromise;
}

function scrapeSearch($)
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
//                videoListFromPromise = processScript($, tag, searchTitleTag);
        videoListFromPromise = processScript($, (body, index) => {return getVideoList(body, index, searchTag, searchTitleTag);});
    }

    console.log("search found " + videoListFromPromise.length + " songs from Cheerio Promise");
    return videoListFromPromise;
}

function processScript($, scraperCB)
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
//            let setB = getVideoList(scriptBody, index, tag, titleTag);
            let setB = scraperCB(scriptBody, index);
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

