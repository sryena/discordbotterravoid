const express = require('express');
const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMembers
  ]
});

const GUILD_ID = process.env.GUILD_ID;

client.login(process.env.BOT_TOKEN);

app.get('/members', async (req, res) => {
  try {
    const guild = await client.guilds.fetch(GUILD_ID);
    await guild.members.fetch();
    const onlineMembers = guild.members.cache
      .filter(member => member.presence?.status === 'online')
      .map(member => ({ username: member.user.username }));

    res.json(onlineMembers);
  } catch (err) {
    console.error(err);
    res.json([]);
  }
});

app.listen(port, () => console.log(`Servidor activo en puerto ${port}`));
