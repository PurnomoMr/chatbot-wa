let memjs = require('memjs')

let memObj = (rootpath) => {
    let config = require(rootpath + "/config/config.json")
    const mem = {}

    mem.createMemServer = async () => {
        let server = config.memcached.host + ":" + config.memcached.port
        let options = {
            keepAlive: true
        }
        let mc = memjs.Client.create(server, options)
        return mc
    }

    return mem
}

module.exports = memObj