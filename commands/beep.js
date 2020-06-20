const {MessageEmbed} = require("discord.js");
const msgFormatter = require("../util/formatTextMsg.js");
const formatter = require("../util/songFormatter.js");
const cleanURL = require("../util/cleanURL.js");
const getLyrics = require("../play/getLyrics.js");
const init = require("../play/initConnection.js");

const textColorPrefix = "\`\`\`javascript\n";
const textcolorPostfix = "\`\`\`";


module.exports = 
{
	name: 'beep',
	description: 'mini game, click after beep',
	aliases: ['b'],
  async execute(message) 
  {
    const queue = message.client.queue;
    let serverQueue = message.client.queue.get(message.guild.id);
    const emoji = '👌';
    const minigameName = "Who is the fastest?\n Click on " + emoji + " after the beep!\n\n聼嗶聲，按" + emoji;


    function getNickName(message, user)
    {
      let guild = message.guild;
      let member = guild.member(user);
      let nickname = member ? member.displayName : null;
      return nickname;
    }

    function getGameDescription(count)
    {
      let msg = "Within " + count + " seconds";
      return msg;
    }

    function createMessageEmbed(desc)
    {
      return new MessageEmbed()
       .setTitle(minigameName + "\n\n" + desc)
//      .setDescription(desc)
      .setColor('#00bb00')
      .addFields(
        { name: '\u200B', value: '\u200B' }
      )
    }

    function createMessageEmbedDesc(desc)
    {
      var coloredText = textColorPrefix + desc + "\n" + textcolorPostfix;
//      var coloredText = "**" + desc + "**\n" ;

      return new MessageEmbed()
       .setTitle(minigameName)
      .setDescription(coloredText)
      .setColor('#00bb00')
      .addFields(
        { name: '\u200B', value: '\u200B' }
      )
    }

    function getScoreMessage(scores, startTime)
    {
      if (scores.length == 0)
        return "No one won";

      let msg = scores[0].username + " has Won!!!\n";
      for (let i = 0; i < scores.length; i++)
      {
        let userTime = scores[i];
        msg += (i+1) + ") " + formatter.postpad(userTime.username, 20) + " " + formatter.pad((userTime.start.getTime() - startTime.getTime()), 10) + "ms\n";
      }
      return msg;
    }

    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel)
    {

      return message.channel.send(
        "You need to be in a voice channel to play music!"
      );
    }


    let connection = null;
    
    if (!serverQueue)
    {
      await init.initializeVoiceConnection(message).then( connection => {

        serverQueue = message.client.queue.get(message.guild.id);
        showGame(serverQueue.connection);
        });
/*
      try 
      {
        connection = await voiceChannel.join().then( showGame);
      } catch (err) {
        console.log("error=" + err);
        queue.delete(message.guild.id);
        throw err.message;
      }
*/
    }
    else
    {
      if (serverQueue.playing)
      {
        msgFormatter.flashTextMessage(serverQueue.textChannel, "Cannot play mini game while songs are playing", "Please stop song playing");;
      }
      else
      {
        showGame(serverQueue.connection);
      }
    }
    


    async function showGame(connection) 
    {
      console.log("showGame start");
      let max = 5;
      let count = max;
      let random = Math.floor(Math.random() * max);
      const embed = createMessageEmbed(getGameDescription(count));
      let msg = await message.channel.send(embed);
      msg.react(emoji);
      const counter = setInterval(() => {
        if (random + count >= max)
        //      if (count > 0) 
        {
          msg.edit(createMessageEmbed(getGameDescription(count)));
          count--;
        }
        else {
          clearInterval(counter);
          try {
            let dispatcher = connection.play(__dirname + '/../Censored_Beep-Mastercard-569981218.wav', { volume: 1.0 })
              .on("error", error => { console.log("error occurred during playing"); console.error(error); })
              .on("finish", () => {
                let startTime = new Date();
                let scores = [];
                let username = null;
                const filter = (reaction, user) => {
                  if (reaction.emoji.name === emoji && !user.bot) {
                    let userTime = { username: null, start: null };
                    userTime['username'] = getNickName(message, user);
                    userTime['start'] = new Date();
                    console.log("inside filter" + userTime.username + "," + getNickName(message, user) + "," + userTime.start.getTime());
                    scores.push(userTime);
                    return true;
                  }
                  else
                    return false;
                };
                msg.awaitReactions(filter, { max: 300, time: 2000, errors: ['time'] })
                  .then(collected => {
                    console.log(getScoreMessage(scores, startTime));
                    msg.edit(createMessageEmbed(getScoreMessage(scores, startTime)));
                  })
                  .catch(collected => {
                    msg.edit(createMessageEmbedDesc(getScoreMessage(scores, startTime)));
                    //                  console.log("At " +  new Date().toLocaleTimeString() + `, only ${collected.size} reacted.`);
                    //                  msg.edit(createMessageEmbed('no one won. try again'));
                  });
              });
            console.log("after play");
            //dispatcher.end();
            //        voiceChannel.leave();
          }
          catch (err) {
            console.log("error=" + err);
            //          queue.delete(message.guild.id);
            message.channel.send("Error occured !" + err.message);
          }
        }
      }, 1000);

      console.log("showGame ends");
      
    } 
/*
      let msg = await message.channel.send({
        embed:{
            title: "React to this to buy rank colors!",
            color: 0x00FF00, 
        }
    });
    
    msg.react('👌');
    */
	}
};





