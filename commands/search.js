require('dotenv').config();
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('search')
    .setDescription('Search for a book or an author')
    .addStringOption(option =>
      option
        .setName('query')
        .setDescription('Enter the title or author name. More details means more accuracy.')
        .setRequired(true)
    ),
async execute(interaction) {
    const query = encodeURIComponent(interaction.options.getString('query'));

    try {
      await interaction.reply('Received API response. Check the console.');
    } catch (error) {
      console.error('Error fetching data:', error);
      await interaction.reply('An error occurred while fetching data from the API.');
    }
  },
};