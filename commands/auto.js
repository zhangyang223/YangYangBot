const { Util } = require("discord.js");
const addPlaylist = require("../play/addPlaylist.js");
const cleanURL = require("../util/cleanURL.js");
const addSong = require("../play/addSong.js");
const songPlayer = require("../play/songPlayer.js");
const ytRequest = require("../youtube/ytRequest.js");
const msgFormatter = require("../util/formatTextMsg.js");
const parser = require("../util/parseArgs.js");

module.exports = {
	name: 'auto',
	description: 'Not Implemented. <url> Automatic continuously play recommendation based on a song',
	aliases: [],
	async execute(message) 
	{
	  try 
	  {
		const queue = message.client.queue;
		const serverQueue = message.client.queue.get(message.guild.id);
  
		const voiceChannel = message.member.voice.channel;
		if (!voiceChannel)
		{
		  return msgFormatter.formatTextMsg(message.channel, "Error", "You need to be in a voice channel to auto play!");
		}
		const permissions = voiceChannel.permissionsFor(message.client.user);
		if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) 
		{
		  return msgFormatter.formatTextMsg(message.channel, "Error", "I need the permissions to join and speak in your voice channel!");
		}
  
		let args = parser.parse(message.content);
  
		if (args == null || args.length == 0)
		{
		  var textTitle = "User Error";
		  var msg = "Please enter a url or a song to start";
		  msgFormatter.formatTextMsg(message.channel, textTitle, msg);
		  return;
		}
  
		let inputText = args[0];
  
		if (inputText.startsWith('http'))
		{
		  var url = inputText;
		  if (url.includes("/playlist?"))
		  {
			console.log("this is a playlist");
			addPlaylist.add(message, url);
		  }
		  else
		  {
			console.log("this is a video");
			/*
			addSong.addWithMsg(message, url).then(() => {
			  console.log("before play"); 
			  songPlayer.play(message);});
		  }*/
			await addSong.addWithMsg(message, url);
			songPlayer.play(message);
		  }
			
		}
		else
		{
		  // it is not an URL, search
		  console.log("this is a text");
		  var urlList = await ytRequest.search(inputText);
		  if (urlList != null && urlList.length > 0)
		  {
			let url = urlList[0].url;
			await addSong.addWithMsg(message, url);
			songPlayer.play(message);
		  }
		  else
		  {
			// cannot find any songs
			var textTitle = null;
			var msg = "Cannot find any song";
			msgFormatter.flashTextMessage(message.channel, textTitle, msg);
		  }
		}
  
	  } 
	  catch (error) 
	  {
		console.error(error);
		msgFormatter.formatTextMsg(message.channel, 'Unexpected Error', error.message);
	  }
	}
  };