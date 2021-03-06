# Discord-bot

Emily Music Bot is a discord music bot that will have similar features as Groovy and Rythm.  Once this is more production ready, I will make it run on a public server so it will be accessible by everyone.

## Change logs
- help page needs refinement, specifically, if there is no alias.  and needs better formatting.
- add current playback progress for debugging.
- display percentage of the current play
- be able to play youtube playlist
- added unit test framework
- playback optimization, prefer highestaudio.  This picks the highest audio quality.
- search text for songs
- All text message output needs to be formatted.
- add lyric display from ksoft with footer icon.(removed and moved to a different lyric provider)
- better formatting for queue with coloring.
- move to use mojim.com as lyrics provider and use embedded link for caption.
- fix queue output to show progress of current song
- support song movement within queue
- conform command names to Groovy, support remove, clear, disconnect and etc.
- improve lyrics.  If found from ksoft, then use it; otherwise, provide link to other lyric provider
- fix aliases by moving them into each command instead of using a config file by following discord convention
- add pause/resume
- speed up adding playlist
- limit queue display to 10 so it won't be so long and q 2 to move to the second page
- clean up messages, specifically start play message.  delete old one before add the new one
- investigate how to setup a server to migrate from my laptop to a server, hosted on github
- add a web site, support server, fix up help
- updated website for mobile support
- added a mini game called bepp.
- fixed when adding a playlist, sometimes still run into a problem that play list not added initially but added again later.
- feature: keep the song queue and move to next song without deleting, change queue display to indicate current song position, add jump to set current song, add back, fix np
- feature：support search result and select song based on search result.
- optimize adding playlist.  when adding a long playlist, it takes a while.
- added persistence support: 
-- which songs are added by which user
-- current queue, for each song, including videoID, title, duration.
- when someone types in a wrong command, print out to console which channel on which server.
- needs to handle github actions upload and download artifacts.  did not work. trying to git push to keep history
- fixed concurrency issue when adding a playlist fast enough, the ordering is wrong.
- added back KSOFT_TOKEN
- fixed: when removing the song that is currently playing, it will stop playing.
- went through a renaming/rebranding to the new name

## Todo
- identify the audio stream and prefer opus first.
- try to link up a radio site(possible?), https://listen.moe/* 
- sometimes during playback, the connection is lost.  Needs an auto reconnection and start playing from where it was left off.
- somehow setting up the youtube service account does not work.  Getting Exceed Daily limit
- try out youtube caption API

## Known Issues
- if the length of the song is more than an hour, then current progress is incorect because it only displays mm:ss.

## Acknowledgement

The original shell code is copied from https://github.com/TannerGabriel/discord-bot.git.  

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE) file for details
