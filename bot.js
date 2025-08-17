const express = require('express');
const { Client, GatewayIntentBits } = require('discord.js');
const app = express();
const PORT = process.env.PORT || 10000;

// --- CONFIGURA TU BOT ---
const GUILD_ID = '1406631298746810381';
const TOKEN = 'TU_NUEVO_TOKEN_AQUI'; // Cambia esto por tu nuevo token

// --- CLIENTE DE DISCORD ---
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences
  ]
});

client.once('ready', () => {
  console.log(`Bot conectado como ${client.user.tag}`);
});

client.login(TOKEN);

// --- RUTA PARA OBTENER MIEMBROS ONLINE ---
app.get('/members', async (req, res) => {
  try {
    const guild = await client.guilds.fetch(GUILD_ID);
    await guild.members.fetch(); // Trae todos los miembros

    const onlineMembers = guild.members.cache
      .filter(member => member.presence?.status === 'online')
      .map(member => ({ username: member.user.username }));

    res.json(onlineMembers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'No se pudieron cargar los miembros' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor web corriendo en puerto ${PORT}`);
});
