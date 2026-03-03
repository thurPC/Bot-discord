const { Client, GatewayIntentBits } = require('discord.js');

// 🔐 Verificação forte do TOKEN
if (!process.env.TOKEN) {
  console.error("❌ TOKEN não encontrado no ambiente.");
  process.exit(1);
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// 🎭 COLOQUE AQUI OS IDs REAIS DOS CARGOS
const ROLE_ATIVO = 'minecraft (teste)';
const ROLE_INATIVO = 'COLOQUE_AQUI_ID';
const ROLE_VALORANT = 'COLOQUE_AQUI_ID';

client.once('ready', () => {
  console.log(`✅ Bot online como ${client.user.tag}`);
});

// 💬 Quando enviar mensagem → vira ATIVO
client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  const member = message.member;
  if (!member) return;

  try {
    if (!member.roles.cache.has(ROLE_ATIVO)) {
      await member.roles.add(ROLE_ATIVO);
    }

    if (member.roles.cache.has(ROLE_INATIVO)) {
      await member.roles.remove(ROLE_INATIVO);
    }
  } catch (err) {
    console.error("Erro ao atualizar cargos:", err.message);
  }
});

// 🎮 Detectar se está jogando VALORANT
client.on('presenceUpdate', async (oldPresence, newPresence) => {
  if (!newPresence || !newPresence.member) return;

  const member = newPresence.member;
  const activities = newPresence.activities;

  const jogandoValorant = activities.some(
    activity => activity.name === "VALORANT"
  );

  try {
    if (jogandoValorant) {
      await member.roles.add(ROLE_VALORANT);
    } else {
      await member.roles.remove(ROLE_VALORANT);
    }
  } catch (err) {
    console.error("Erro ao atualizar cargo VALORANT:", err.message);
  }
});

// 🚀 Login
client.login(process.env.TOKEN);
