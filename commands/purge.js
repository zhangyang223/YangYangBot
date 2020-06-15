module.exports = {
	name: 'purge',
	description: 'Delete the last messages in all chats.',
	aliases: [],
	async execute(message) {
		const args = message.content.split(' ');
		let deleteCount = 0;
		try {
			deleteCount = parseInt(args[1], 10);
		}catch(err) {
			return message.reply('Please provide the number of messages to delete. (max 100)')
		}
        

		if (!deleteCount || deleteCount < 1 || deleteCount > 100)
			return message.reply('Please provide a number between 2 and 100 for the number of messages to delete');

		const fetched = await message.channel.messages.fetch({
			limit: deleteCount,
		});
		message.channel.bulkDelete(fetched)
			.catch(error => message.reply(`Couldn't delete messages because of: ${error}`));


		//testing to see if we can delete some messages

//		message.channel.send("Testing 123");
//		message.channel.send("Testing 1234");
//		message.channel.send("Testing 12345");

//		message.channel.bulkDelete(2)
//			.catch(error => message.reply(`Couldn't delete messages because of: ${error}`));

	},
};