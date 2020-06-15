const fs = require('fs')
const {	prefix} = require('../config.json');
const msgFormatter = require("../util/formatTextMsg.js");

module.exports = {
	name: 'help',
	description: 'List all available commands.',
	aliases: ["h"],
	execute(message) {
		const textTitle = "Command List";
		const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
		var str = "";

		function showAlias(aliases)
		{
			if (aliases.length > 0)
				return "[" + aliases + "]";
			else
				return "";
		}
		for (const file of commandFiles) {
			const command = require(`./${file}`);
			str += `${prefix}${command.name}` + showAlias(command.aliases) + `, ${command.description} \n`;
		}

		msgFormatter.formatTextMsg(message.channel, textTitle, str);
	},
};