"use strict";
var fs = require('fs');
var ytdl = require('ytdl-core');
var request = require('request');
var argv = require('optimist').argv;
var select = require('soupselect').select;
var htmlparser = require('htmlparser');
var _ = require('underscore');
const addSong = require("../play/addSong.js");
const songPlayer = require("../play/songPlayer.js");
const printCurrentQueue = require("../util/printCurrentQueue.js");
const msgFormatter = require("../util/formatTextMsg.js");

module.exports = 
{
  async add(message, url) 
  {
    var videoList = [];
    let recurse = 0;

    if (!message || !url) return;

    async function addSongFromPlaylist(message, url)
    {
        await addSong.add(message, url);
    }

    async function addSongsFromPlaylist(message, videoList)
    {
        var i = 0;

        console.log(i + ") " + videoList[i].url + " added");
        try
        {
            await addSong.add(message, videoList[i].url);
            songPlayer.play(message);
        }
        catch(error)
        {
            console.error(error);
        }

        for (++i;i < videoList.length; i++) 
        {
            console.log(i + ") " + videoList[i].url + " added");
            try
            {
                await addSong.add(message, videoList[i].url);
                songPlayer.play(message);
            }
            catch(error)
            {
                console.error(error);
            }
        }

        console.log("finished adding all songs");
        printCurrentQueue.print(message);
    }

    async function requestCB(err, res, body)
    {
        if (err) {
            console.err('Error: ', + err);
            throw err;
        } else {
            var handler = new htmlparser.DefaultHandler(function(err, dom) {
                if (err) {
                    console.err('Error: ', + err);
                    throw err;
                } else {

                    var list = select(dom, '.pl-video-title-link');

                    if (list.length == 0)
                    {
                        console.log("did not find songs, recurse");
                        recurse++;
                        sendRequest();
                    }
                    else
                        console.log("inside RequestCB DefaultHandler, list.length=", list.length);
                    
                    list.forEach(function(node, i) {
                        var url = 'https://www.youtube.com' +
                            node.attribs.href.replace(/&amp;/g, '&');

                        var uriAmpIndex = url.indexOf('&');
                        if (uriAmpIndex != -1)
                        {
                            url = url.substring(0, uriAmpIndex);
                        }

                        var padLength = String(list.length).length;
                        var index = (Array(padLength).join('0') + (i+1)).slice(-padLength);

                        videoList.push({
                            url: url
                        });
                    });
                }
            });

            var parser = new htmlparser.Parser(handler);
//            console.log("html body=" + body);
            await parser.parseComplete(body);

            if (videoList.length == 0)
                msgFormatter.flashTextMessage(message.channel, null, "failed to find any songs in the playlist");
            else
            {
                msgFormatter.flashTextMessage(message.channel, null, "added " + videoList.length + " songs to the queue!");;

                await addSongsFromPlaylist(message, videoList);
//                await songPlayer.play(message);
                console.log("finished songPlayer.play");
            }
        }
    }

    function sendRequest()
    {
        try
        {
            request.get(url, requestCB);
        }
        catch (error) 
        {
          console.error(error);
          msgFormatter.flashTextMessage(message.channel, 'Unexpected Error', error.message);
        }
    }

    recurse = 0;
    sendRequest();
  }
}