const { Client, GatewayIntentBits } = require('discord.js');
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMembers
  ]
});

const GUILD_ID = "TU_GUILD_ID"; // Pon aquí el ID de tu servidor

client.once('ready', () => {
  console.log(`Bot conectado como ${client.user.tag}`);
});

// Endpoint para la web
app.get('/members', async (req, res) => {
  try {
    const guild = await client.guilds.fetch(GUILD_ID);
    await guild.members.fetch(); // Traer todos los miembros
    const onlineMembers = guild.members.cache.filter(
      m => m.presence?.status === 'online'
    );
    res.json(onlineMembers.map(m => ({ username: m.user.username, status: m.presence.status })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "No se pudo obtener miembros" });
  }
});

// Poner el bot online
client.login(process.env.DISCORD_TOKEN);

// Poner el servidor web online
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor web corriendo en puerto ${PORT}`);
});
