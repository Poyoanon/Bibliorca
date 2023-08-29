require('dotenv').config();
const { EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
  execute: async interaction => {
    const query = encodeURIComponent(interaction.options.getString('query'));
    const apiUrl = `https://gutendex.com/books/?search=${query}`;

    try {
      const response = await axios.get(apiUrl);
      const books = response.data.results || [];

      if (books.length === 0) {
        await interaction.reply('No results found.');
        return;
      }

      const book = books[0];

      const title = book.title;
      const author = book.authors[0]?.name || 'Unknown Author';
      const thumbnail = book.formats?.['image/jpeg'] || '';

      const formats = book.formats?.['text/html'];
      const details = [
        `Author: ${author}`,
      ];

      if (formats) {
        details.push(`[Read Book](${formats})`);
      }

      const embed = new EmbedBuilder()
        .setTitle(title)
        .setColor(0xFFFFFF) 
        .setDescription(details.join('\n'))
        .setImage(thumbnail);
  
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Error fetching data:', error);

      await interaction.reply('An error occurred while fetching data from the API.');
    }
  },
};
