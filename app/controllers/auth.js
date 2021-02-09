"use strict"

const { nextTick } = require('process')

let obj = (rootpath) => {
    const fn = {}
    const config = require(rootpath + '/config/config.json')
    const cst = require(rootpath + '/config/const.json')
    const moment = require('moment')
    const validator = require('validator')

    fn.checkAuth = async (req, res, next) => {
        try {

            let authentication = String(req.query.auth) || ""
            if(validator.isEmpty(authentication)) {
                throw getMessage("auth001")
            }

            if(authentication != config.twilio.webhook.authentication) {
                throw getMessage("auth001")
            }

            next()
        } catch (e) {
            next(e)
        }
    }

    return fn
}

module.exports = obj