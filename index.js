require('dotenv').config();

const { Client, GatewayIntentBits } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const fs = require('fs');

const botToken = process.env.BOT_TOKEN;
const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;


const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent],
});

const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  commands.push(command.data.toJSON());
}

const rest = new REST({ version: '9' }).setToken(botToken);

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(
      Routes.applicationGuildCommands(clientId, guildId),
      { body: commands },
    );

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();

const interactionFiles = fs.readdirSync('./interactions').filter(file => file.endsWith('.js'));
for (const file of interactionFiles) {
  const interaction = require(`./interactions/${file}`);
  client.on('interactionCreate', async int => {
    if (!int.isCommand()) return;

    if (int.commandName === 'search') {
      await interaction.execute(int);
    }
  });
}

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.login(botToken);
