"use strict"

const path = require("path")
let rootpath = path.resolve(__dirname, "../")
let cronpath = rootpath + '/cronjob'

require("dotenv").config({path: rootpath + '/.env'})
global.ENV = process.env.NODE_ENV || 'development';

//to enable debug, .env must be load first than oneScript
const cronScript = require(cronpath + "/src/index.js")
const covid19Cron = require(cronpath + "/src/covid19.js")(rootpath)

//logger
global.myLogger = require(rootpath + '/core/logger.js')(rootpath + "/logs/covid19_summary.log", 'covid19_cron', 50000000, 10, 'trace')

//set global lib
global.loadLib = (filename) => require(path.normalize(rootpath + '/app/libs/' + filename.toLowerCase() + ".js"))(rootpath)

// set function isEmpty
global.isEmpty = (data) => {
    for (let item in data) {
        return false
    }
    return true
}

let objSource = {}

myLogger.info('start', 'cron has started')

objSource.run = async () => {
    await covid19Cron.summary(1)
}

cronScript(
    {
        infinite_loop: true,
        pid_file: rootpath + "/pid/cron_covid19_summary01.pid",
        source: objSource,
        sleep: 300000,
        run: 'run',
        init: false,
        close: false
    }
).then(() => {
    myLogger.info('stop', 'cron has stopped')
    process.exit(0);
}).catch((e) => {
    myLogger.error('catch', JSON.stringify(e))
    process.exit(0);
})