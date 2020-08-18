const os = require(`os`)
const cpuInfo = os.cpus()
for (let cpu of cpuInfo) {
    console.log(`Model: ${cpu.model}\nClockspeed: ${Math.round(cpu.speed / 1024)}GHz`)
}
console.log(`Total memory: ${Math.round(os.totalmem()/1000000000)}GB`)

console.log(require(`./modules/secondsToDhms`)(os.uptime()))

console.log(os.hostname())
