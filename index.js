"use strict";
const fs = require('fs')
//const {Discord, UserManager} = require('discord.js');
const Discord = require('discord.js');
const UserManager = require('discord.js');
const Client = require('./client/Client');
const {
	prefix,
} = require('./config.json');

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

console.log(client.commands);

client.once('ready', () => {
	console.log('Ready!');
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
	/*
	try {
		const devID = message.author;
		const dev = client.users.cache.get(devID);// || await client.fetchUser(devID);
		// Retrieve the user from the client's cache.
		// If they haven't been cached yet, fetch them.
	
		/*
		const feedback = new discord.RichEmbed()
		.setColor([0, 0, 255])
		.setFooter(`Bot created by ${dev.tag}.`, dev.displayAvatarURL)
		.setDescription('Your text here.');
	
		console.log("author id=" + devID);
		console.log("author=" + dev.tag);
		return dev.tag;
	} catch(err) {
		console.error(err);
	}
	*/
}

client.on('message', async message => {
	if (message.author.bot) return;

	getUserName(message);
	const args = message.content.slice(prefix.length).split(/ +/);
	var commandName = args.shift().toLowerCase();
	
	const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
	
	if (!message.content.startsWith(prefix)) return;

	try {
		console.log('Executing ' + commandName);
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

const encoded = "TnpFek5UVXdNelkzTVRZMU5qUTBPREV3Llh1UlVLdy5mNmtMUnZBd0tKVjVLWExVbGNhRXhKSFBxWHM=";
let token = Buffer.from(encoded, 'base64').toString();

client.login(token);