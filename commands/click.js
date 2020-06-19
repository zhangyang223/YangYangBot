const {MessageEmbed} = require("discord.js");
const msgFormatter = require("../util/formatTextMsg.js");
const cleanURL = require("../util/cleanURL.js");
const getLyrics = require("../play/getLyrics.js");


module.exports = {
	name: 'click',
	description: 'mini game, click as fast as you can',
	aliases: [],
  async execute(message) 
  {
    const queue = message.client.queue;
    const serverQueue = message.client.queue.get(message.guild.id);
    const emoji = '👌';
    const minigameName = "Who is the fastest?";


    function getGameDescription(count)
    {
      let msg = "click on ";
      msg += emoji + " after the beep! " + count + " seconds";
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


    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel)
    {

      return message.channel.send(
        "You need to be in a voice channel to play music!"
      );
    }

    try {
      connection = await voiceChannel.join();
    } catch (err) {
      console.log("error=" + err);
      queue.delete(message.guild.id);
      throw err.message;
    }


    let max = 5;
    let count = max;
    let random = Math.floor(Math.random()* max );

    const embed = createMessageEmbed(getGameDescription(count));

    let msg = await message.channel.send(embed);
    msg.react(emoji); 


    const counter = setInterval(() => {
      if (random + count >= max)
//      if (count > 0) 
      {
        msg.edit(createMessageEmbed(getGameDescription(count)));
        count--;
      } else {
        clearInterval(counter);

        try
        {
          console.log("before play");
  ////        let dispatcher = connection.play('C:\\Newman\\DiscordBot\\dev\\yangyangbot\\YangYangBot\\BeepPing-SoundBible.com-217088958.mp3', {volume: 10.0})
  ////        let dispatcher = connection.play('C:\\Newman\\DiscordBot\\dev\\yangyangbot\\YangYangBot\\Censored_Beep-Mastercard-569981218.wav', {volume: 10.0})
          let dispatcher = connection.play(__dirname + '/../Censored_Beep-Mastercard-569981218.wav', {volume: 10.0})
  
  //        let dispatcher = connection.play('../music_orig.wav')
  //        let dispatcher = connection.play('C:\\Newman\\DiscordBot\\dev\\yangyangbot\\YangYangBot\\music_orig.wav')
          .on("start", () => {console.log("playing beep starts at " + new Date().toLocaleTimeString()); })
          .on("error", error => {console.log("error occurred during playing"); console.error(error); })
          .on("finish", () => 
              {console.log("finished playing at " +  new Date().toLocaleTimeString());

              let username = null;
              const filter = (reaction, user) => 
              {
                if (reaction.emoji.name === emoji && !user.bot)
                {
                  username = user.username;
                  return true;
                }
                else
                  return false;
              };
              
              msg.awaitReactions(filter, { max: 1, time: 3000, errors: ['time'] })
                .then(collected => {
                  console.log(username  + ' won');
                  msg.edit(createMessageEmbed(username  + ' won'));
                })
                .catch(collected => {
                  console.log("At " +  new Date().toLocaleTimeString() + `, only ${collected.size} reacted.`);
                  msg.edit(createMessageEmbed('no one won. try again'));
                });
      
            });
  
          console.log("after play");
          //dispatcher.end();
  //        voiceChannel.leave();
        } catch (err) {
          console.log("error=" + err);
          queue.delete(message.guild.id);
          throw err.message;
        }

    

      }
    }, 1000);




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



