import { REST } from '@discordjs/rest';
import { WebSocketManager } from '@discordjs/ws';
import { GatewayDispatchEvents, GatewayIntentBits, InteractionType, Client, TextInputStyle, ComponentType, ButtonStyle } from '@discordjs/core';
import { config } from "dotenv";

config()

// Create REST and WebSocket managers directly
const rest = new REST({ version: '10' }).setToken(process.env.TOKEN!);

const gateway = new WebSocketManager({
    token: process.env.TOKEN!,
    intents: GatewayIntentBits.GuildMessages | GatewayIntentBits.MessageContent,
    rest,
});

// Create a client to emit relevant events.
const client = new Client({ rest, gateway });

client.api.applicationCommands.createGlobalCommand(process.env.APP_ID!, { name: 'ping', description: 'Descrição PING'  })
client.api.applicationCommands.createGlobalCommand(process.env.APP_ID!, { name: 'caçar', description: 'escolhe um pokemon'  })

// Listen for interactions
// Each event contains an `api` prop along with the event data that allows you to interface with the Discord REST API
client.on(GatewayDispatchEvents.InteractionCreate, async ({ data: interaction, api }) => {
    const responseButton = {
         "capture": async () => {
            await api.interactions.reply(interaction.id, interaction.token, { content: "Você capturou o pokemon",})
        },

         "run": async () => {
            await api.interactions.reply(interaction.id, interaction.token, { content: "Você fugiu com sucesso",})
        }
    }
    
    if (interaction.type !== InteractionType.ApplicationCommand) {
        //@ts-ignore
        await responseButton[interaction.data.custom_id]()
        return;
    }

    if(interaction.data.name === 'ping') await api.interactions.reply(interaction.id, interaction.token, { content: 'Pong!' });

    if(interaction.data.name === 'caçar') {
        const randomNumber = Math.round(Math.random() * 100)
        const pokemon = await fetch(process.env.URL_POKE! + randomNumber).then(res => res.json())

        await api.interactions.reply(interaction.id, interaction.token, { content: "",  embeds: [{
            /*Todo o card*/ 
            title: `${pokemon.name}      #${String(pokemon.id).padStart(3, "0")}`,  
            color: 644961,
            fields: [{
                name: '',
                value: pokemon.types[0].type.name,
            }],
            image: {
                proxy_url: pokemon?.sprites.front_default,
                url: pokemon?.sprites.front_default,
                height: 124,
                width: 124,
            },
        }],
        components: [{
            /*Local dos dois componentes*/ 
            type: 1,
            components: [{
                type: ComponentType.Button,
                style: ButtonStyle.Success,
                custom_id: "capture",
                label: "capturar"
            },
            {
                custom_id: "run",
                style: ButtonStyle.Danger,
                type: ComponentType.Button,
                label: "fugir",
            }
            ],
        }
    ]
    })}
});

// Listen for the ready event
client.once(GatewayDispatchEvents.Ready, () => console.log('Ready!'));

// Start the WebSocket connection.
gateway.connect()