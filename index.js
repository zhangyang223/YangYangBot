"use strict";
const fs = require('fs')
//const {Discord, UserManager} = require('discord.js');
const Discord = require('discord.js');
const UserManager = require('discord.js');
const Client = require('./client/Client');
const {
	prefix,
} = require('./config.json');
//const killTime = (6 * 60 - 10) * 60 * 1000; // 5:50
const killTime = 2 * 60 * 1000; // 2 minutes

//var aliases = require('./alias.js');
//console.log("value=" + aliases + ",type=" + typeof(aliases));

const client = new Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) 
{
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

//console.log(client.commands);

client.once('ready', () => 
  {
	console.log(`Logged in as ${client.user.tag}!`);
	client.user.setPresence({ activity: { name: prefix + "help", type: 'LISTENING' }, status: 'online' });
  });

client.once('guildCreate', guild => {
	console.log("guild.id=" + guild.id);
	});

client.once('reconnecting', () => {
	console.log('Reconnecting!');
});

client.once('disconnect', () => {
	console.log('Disconnect!');
});

process.on('unhandledRejection', error => {
	console.error('Unhandled promise rejection:', error);
});

function getUserName(message)
{
	
	console.log(message.author.username);

}

client.on('message', async message => {
	if (message.author.bot) return;

//	getUserName(message);
	const args = message.content.slice(prefix.length).split(/ +/);
	var commandName = args.shift().toLowerCase();
	
	const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
	
	if (!message.content.startsWith(prefix)) return;
	if (!command) 
	{
		console.log("Command: ###" + command + "### not found, message.content=" + message.content + " by " + message.author.username + " on server=" + message.guild.name + " channel=" + message.channel.name);
		client.commands.get("help").execute(message);
		return;
	}

	try {
		console.log('Executing ' + commandName + ", message.content=###" + message.content + "###");
		if(commandName == "ban" || commandName == "userinfo") {
			command.execute(message, client);
		} else 
		{
			command.execute(message);
		}
	} catch (error) {
		console.error(error);
		message.reply('Command not found <' + commandName + '>');
	}
});

setTimeout(() => {process.exit(0);}, killTime);

const encoded = "TnpFek5UVXdNelkzTVRZMU5qUTBPREV3Llh1UlVLdy5mNmtMUnZBd0tKVjVLWExVbGNhRXhKSFBxWHM=";
let token = Buffer.from(encoded, 'base64').toString();

client.login(token);