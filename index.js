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

// TOKEN vindo do Render
const TOKEN = process.env.TOKEN;

// IDs dos cargos (COLOQUE OS IDs REAIS AQUI)
const ROLE_ATIVO = 'ID_CARGO_ATIVO';
const ROLE_INATIVO = 'ID_CARGO_INATIVO';
const ROLE_VALORANT = 'ID_CARGO_VALORANT';

// Verificação simples do token
if (!TOKEN) {
  console.log("❌ TOKEN não encontrado. Verifique Environment Variables no Render.");
  process.exit(1);
}

client.on('ready', () => {
  console.log(`✅ Bot online como ${client.user.tag}`);
});

// Sistema de cargo ativo/inativo
client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  const member = message.member;

  try {
    if (!member.roles.cache.has(ROLE_ATIVO)) {
      await member.roles.add(ROLE_ATIVO);
    }

    if (member.roles.cache.has(ROLE_INATIVO)) {
      await member.roles.remove(ROLE_INATIVO);
    }
  } catch (err) {
    console.log("Erro ao atualizar cargos:", err.message);
  }
});

// Sistema de cargo por jogo
client.on('presenceUpdate', async (oldPresence, newPresence) => {
  if (!newPresence) return;

  const member = newPresence.member;
  const activities = newPresence.activities;

  const jogandoValorant = activities.some(
    (a) => a.name === "VALORANT"
  );

  try {
    if (jogandoValorant) {
      await member.roles.add(ROLE_VALORANT);
    } else {
      await member.roles.remove(ROLE_VALORANT);
    }
  } catch (err) {
    console.log("Erro ao atualizar cargo de jogo:", err.message);
  }
});

// LOGIN (APENAS UMA VEZ)
client.login(TOKEN);
