const {MessageEmbed} = require("discord.js");

const leftBorderColor = 0x00aa00;
const textColorPrefix = "\`\`\`javascript\n";
const textcolorPostfix = "\`\`\`";

const flashDuration = 60000;

module.exports = 
{

    formatTextMsg(textChannel, title, text)
    {
        return this.formatTextMsgWithOption(textChannel, title, text, null);
    },

    formatTextMsgWithOption(textChannel, title, text, option)
    {
        var leftBorderColor = 0x00aa00;
        if (!textChannel) return;

        var cleanText = text.replace(new RegExp(/[\'\"]/, "g"), "");
        
        var coloredText = textColorPrefix + cleanText + "\n" + textcolorPostfix;
        if (title != null)
        {
            const embed = new MessageEmbed()
            .setTitle(title)
            .setColor(leftBorderColor)
            .setDescription(coloredText);

            return textChannel.send(embed, option);
        }
        else
        {

            const embed = new MessageEmbed()
            .setColor(leftBorderColor)
            .setDescription(coloredText);

//            embed.addField("Its mine now", "See Lyrics [Click here](https://mojim.com/%E6%83%B3%E5%92%8C%E4%BD%A0%E5%8E%BB%E5%90%B9%E5%90%B9.html?u4)");
            return textChannel.send(embed, option);
        }
    },
    
    flashTextMessage(textChannel, title, text)
    {
        this.formatTextMsg(textChannel, title, text)
        .then(msg => {
        msg.delete({ timeout: flashDuration })
        })
        .catch(console.error);
    },

    formatLyrics(textChannel, title, url)
    {

        const embed = new MessageEmbed()
        .setAuthor('Lyrics for \"' + title + '\"', 'http://mojim.com/logo-fb.jpg', url)
        .setColor(leftBorderColor);


//        embed.addField("Follow the link below for complete lyrics", "[Click here](" + url + ")");

        return textChannel.send(embed);
    },

    formatLyricsWithText(textChannel, title, text)
    {
        var cleanText = text.replace(new RegExp(/[[\'\"]/, "g"), "");
        var coloredText = textColorPrefix + cleanText + "\n" + textcolorPostfix;

        const embed = new MessageEmbed()
        .setTitle(title)
        .setColor(leftBorderColor)
        .setDescription(coloredText)
        .setFooter("Lyrics provided by KSoft.Si", "https://cdn.ksoft.si/images/Logo1024.png");

        return textChannel.send(embed);
    }


};
