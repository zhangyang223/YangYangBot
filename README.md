# Discord-bot

Easy Music Bot is a discord music bot that will have similar features as Groovy and Rythm.  Once this is more production ready, I will make it run on a public server so it will be accessible by everyone.

## Change logs
* help page needs refinement, specifically, if there is no alias.  and needs better formatting.
* add current playback progress for debugging.
* display percentage of the current play
* be able to play youtube playlist
* added unit test framework
* playback optimization, prefer highestaudio.  This picks the highest audio quality.
* search text for songs
* All text message output needs to be formatted.
* add lyric display from ksoft with footer icon.(removed and moved to a different lyric provider)
* better formatting for queue with coloring.
* move to use mojim.com as lyrics provider and use embedded link for caption.
* fix queue output to show progress of current song
* support song movement within queue
* conform command names to Groovy, support remove, clear, disconnect and etc.
* improve lyrics.  If found from ksoft, then use it; otherwise, provide link to other lyric provider
* fix aliases by moving them into each command instead of using a config file by following discord convention
* add pause/resume
* speed up adding playlist
* limit queue display to 10 so it won't be so long and q 2 to move to the second page
* clean up messages, specifically start play message.  delete old one before add the new one
* investigate how to setup a server to migrate from my laptop to a server, hosted on github

## Todo
* add a web site, support server, fix up help
* investigate into adding a database support.
* identify the audio stream and prefer opus first.
* try to link up a radio site(possible?), https://listen.moe/
* sometimes during playback, the connection is lost.  Needs an auto reconnection and start playing from where it was left off.
* add Chinese TTS
* somehow setting up the youtube service account does not work.  Getting Exceed Daily limit
* try out youtube caption API

## Fixed Bugs

* =q run it before the song is queued, throws an error because the song is not in queue yet.
* =p <invalidcharacter> will cause an "The "url" argument must be of type string. Received undefined", needs better error msg.
* =skip throws an error when there is no song in queue. This problem also occurs while playing certain youtube video because they have the Cipher on(without url to download the actual content).  downloaded the latest 2.1.5 ytdl which fixed the problem.
internal/validators.js:117
    throw new ERR_INVALID_ARG_TYPE(name, 'string', value);
    ^

TypeError [ERR_INVALID_ARG_TYPE]: The "url" argument must be of type string. Received undefined
    at validateString (internal/validators.js:117:11)
    at Url.parse (url.js:159:3)
    at Object.urlParse [as parse] (url.js:154:13)
    at doDownload (C:\Newman\DiscordBot\dev\easymusicbot\node_modules\miniget\dist\index.js:90:28)
    at processTicksAndRejections (internal/process/task_queues.js:79:11) {
  code: 'ERR_INVALID_ARG_TYPE'
}
* =stop does not stop because default song continues to loop play.  
* handle the "deleted video" case in playlist.  It threw an error before and it is being handled correctly now.
* when adding a playlist, randomly says no song in playlist.  Run it a second time is fine。  This is because the dom returned contains an empty list.

## Known Issues
* if the length of the song is more than an hour, then current progress is incorect because it only displays mm:ss.

## Acknowledgement

The original shell code is copied from https://github.com/TannerGabriel/discord-bot.git.  

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE) file for details
