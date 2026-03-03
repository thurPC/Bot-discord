const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const TOKEN = process.env.TOKEN;
const ROLE_ATIVO = 'ID_CARGO_ATIVO';
const ROLE_INATIVO = 'ID_CARGO_INATIVO';
const ROLE_VALORANT = 'ID_CARGO_VALORANT';

client.on('ready', () => {
  console.log(`Bot online como ${client.user.tag}`);
});

client.on('messageCreate', async message => {
  if (message.author.bot) return;

  const member = message.member;

  if (!member.roles.cache.has(ROLE_ATIVO)) {
    await member.roles.add(ROLE_ATIVO);
  }

  if (member.roles.cache.has(ROLE_INATIVO)) {
    await member.roles.remove(ROLE_INATIVO);
  }
});

client.on('presenceUpdate', async (oldPresence, newPresence) => {
  if (!newPresence) return;

  const member = newPresence.member;
  const activities = newPresence.activities;

  const jogandoValorant = activities.some(a => a.name === "VALORANT");

  if (jogandoValorant) {
    await member.roles.add(ROLE_VALORANT).catch(() => {});
  } else {
    await member.roles.remove(ROLE_VALORANT).catch(() => {});
  }
});

client.login(TOKEN);
