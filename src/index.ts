import { REST } from '@discordjs/rest';
import { WebSocketManager } from '@discordjs/ws';
import { GatewayDispatchEvents, GatewayIntentBits, InteractionType, MessageFlags, Client, ButtonStyle, ComponentType } from '@discordjs/core';
const TOKEN = 'MTE0NzYzMDQ0MzMyMDA3MDE1NA.GELKhU.d2eZNG1PR36pPo3IgibVxKgzH49pYGdPMTltXM'
const APPID = '1147630443320070154'
// Create REST and WebSocket managers directly
const rest = new REST({ version: '10' }).setToken(TOKEN);

const gateway = new WebSocketManager({
    token: TOKEN,
    intents: GatewayIntentBits.GuildMessages | GatewayIntentBits.MessageContent,
    rest,
});

// Create a client to emit relevant events.
const client = new Client({ rest, gateway });

console.log({ client });
client.api.applicationCommands.createGlobalCommand(APPID, { name: 'ping', description: 'Descrição PING'  })

// Listen for interactions
// Each event contains an `api` prop along with the event data that allows you to interface with the Discord REST API
client.on(GatewayDispatchEvents.InteractionCreate, async ({ data: interaction, api }) => {
    console.log('aqui');
    if (interaction.type !== InteractionType.ApplicationCommand || interaction.data.name !== 'ping') {
        return;
    }

    await api.interactions.reply(interaction.id, interaction.token, { content: 'Pong!' });
});

// Listen for the ready event
client.once(GatewayDispatchEvents.Ready, () => console.log('Ready!'));

// Start the WebSocket connection.
gateway.connect()