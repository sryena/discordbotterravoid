const express = require('express');
const cors = require('cors');
const { Client, GatewayIntentBits } = require('discord.js');

const app = express();
const PORT = process.env.PORT || 10000;

// Configura CORS para que tu front pueda acceder
app.use(cors());

// Token y Guild ID de tu bot
const TOKEN = 'MTQwNjY1MDA4NTk3ODE0OTA1NQ.GZp_vM.CuR1q8_dEgR8oIoFRfAnncLubWnI07p4d-j1rU';
const GUILD_ID = '1406631298746810381';

// Crear cliente con intents para miembros y presencias
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildPresences
    ]
});

// Endpoint para obtener miembros online
app.get('/members', async (req, res) => {
    try {
        const guild = await client.guilds.fetch(GUILD_ID);
        await guild.members.fetch(); // Necesario para tener los miembros en cache
        const onlineMembers = guild.members.cache.filter(m => m.presence?.status === 'online');
        const data = onlineMembers.map(m => ({ username: m.user.username }));
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json([]);
    }
});

// Iniciar servidor web
app.listen(PORT, () => console.log(`Servidor web corriendo en puerto ${PORT}`));

// Iniciar bot
client.login(TOKEN);
client.on('ready', () => {
    console.log(`Bot conectado como ${client.user.tag}`);
});
