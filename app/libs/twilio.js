'use strict'

let obj = (rootpath) => {
    const config = require(rootpath + '/config/config.json')
    const cst = require(rootpath + '/config/const.json')
    const moment = require('moment')
    const twilio = require("twilio")(config.twilio.auth.account_sid, config.twilio.auth.key)
    const fn = {}

    fn.sendWA =  async (data) => {
        twilio.messages
            .create(data)
            .then(message => myLogger.info("libs_twilio_response", JSON.stringify(message.sid)));
        return true
    }

    return fn
}

module.exports = obj