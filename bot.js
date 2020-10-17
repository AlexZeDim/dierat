require('dotenv').config();
const Discord = require('discord.js');
const client = new Discord.Client();

client.once('ready', () => {
    client.guilds.cache.forEach(async guild => {
        let parent_category = guild.channels.cache.find(ch => ch.name === 'Рейд')
        if (!parent_category) {
            parent_category = await guild.channels.create('Рейд', {
                type: 'category'
            })
        }

        /** create first sub voice */
        let voice = await guild.channels.create(`Группа`, {
            type: 'voice'
        })

        /** attach to parent */
        await voice.setParent(parent_category.id);

        client.on('voiceStateUpdate', async (oldState, newState) => {
            if (oldState.channelID && !newState.channelID) {
                /** LEAVE EVENT */
                if (oldState.channel.members.size === 0 && oldState.channel.parentID === parent_category.id && parent_category.children.size > 1) {
                    await oldState.channel.delete('Delete administrative channel')
                }
            } else if (!oldState.channelID && newState.channelID) {
                /** JOIN EVENT */
                if (newState.channel.parentID === parent_category.id && newState.channel.members.size === 1) {
                    /** create new voice in category */
                    let sub_voice = await guild.channels.create(`Группа`, {
                        type: 'voice'
                    })
                    /** attach to parent */
                    await sub_voice.setParent(parent_category.id);
                }
            } else {
                /** JUMP EVENT */
                if (oldState.channel.members.size === 0 && oldState.channel.parentID === parent_category.id && parent_category.children.size > 1) {
                    await oldState.channel.delete('Delete administrative channel')
                }
                if (newState.channel.members.size === 1 && newState.channel.parentID === parent_category.id) {
                    /** create new voice in category */
                    let sub_voice = await guild.channels.create(`Группа`, {
                        type: 'voice'
                    })
                    /** attach to parent */
                    await sub_voice.setParent(parent_category.id);
                }
            }
        })
    })
});


client.login(process.env.token);
