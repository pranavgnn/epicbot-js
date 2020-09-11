const os = require(`os`)
const cpuInfo = os.cpus()
for (let cpu of cpuInfo) {
    console.log(`Model: ${cpu.model}\nClockspeed: ${Math.round(cpu.speed / 1024)}GHz`)
}
console.log(`Total memory: ${Math.round(os.totalmem()/1000000000)}GB`)

console.log(require(`./modules/secondsToDhms`)(os.uptime()))

console.log(os.hostname())

function format(str) {
    return str
        .replace("!", "-")
        .replace("@", "-")
        .replace("#", "-")
        .replace("$", "-")
        .replace("%", "-")
        .replace("^", "-")
        .replace("&", "-")
        .replace("*", "-")
        .replace("(", "-")
        .replace(")", "-")
        .replace("_", "-")
        .replace("+", "-")
        .replace("=", "-")
        .replace("{", "-")
        .replace("[", "-")
        .replace("}", "-")
        .replace("]", "-")
        .replace("\\", "-")
        .replace("|", "-")
        .replace(":", "-")
        .replace(";", "-")
        .replace("\"", "-")
        .replace("'", "-")
        .replace("<", "-")
        .replace(",", "-")
        .replace(">", "-")
        .replace(".", "-")
        .replace("?", "-")
        .replace("/", "-")
        .replace(/ +/, "-")
}

console.log(format(`r#e#I suck`))