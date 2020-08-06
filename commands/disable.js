exports.config = {
    name: "disable",
    cooldown: 5,
    guildOnly: true,
    staffOnly: false,
    description: "Disables the specified command in the server.",
    usage: "disable <Command>",
    category: "Management",
    permissions: ["ADMINISTRATOR"],
};

const db = require(`quick.db`)
const { MessageEmbed } = require(`discord.js`)

exports.run = async (bot, message, args) => {
    require(`../modules/checkPermission.js`)(message.member, this.config.permissions).then(async hasPerm => {
        if (typeof hasPerm === `string`) return message.channel.send(new MessageEmbed().setTitle(`You don't have permissions!`).setDescription(`This command requires the permissions:\`\`\`${hasPerm}\`\`\``).setColor(`#ff0000`))
        if (!args[0]) return message.channel.send(`🚫 | Please specify a command!`)
        var cmd = args[0].toLowerCase()
        if (cmd === `enable` || cmd === `disable`) return message.channel.send(`🚫 | You can not enable/disable the commands that enable/disable other commands!`)
        if (!bot.commands.get(cmd)) return message.channel.send(`🚫 | That isn't a valid command!`)
        var data = await db.fetch(`enabledcmds_${message.guild.id}`) || {}
        data[cmd] = false
        await db.set(`enabledcmds_${message.guild.id}`, data)
        message.channel.send(new MessageEmbed()
            .setColor(`#00ff00`)
            .setTitle(`Changed command settings`)
            .setDescription(`Successfully set the command usage toggle to: \`${data[cmd]}\` for the command: \`${cmd}\`!`)
        )
    })
}