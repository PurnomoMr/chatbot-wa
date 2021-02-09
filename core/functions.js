'use strict'

let fn = (fw, rootpath, basepath) => {
    const path = require('path')
    const fetch = require('node-fetch')
    const fn = {}

    // attach rootpath and basepath
    fn.rootpath = rootpath
    fn.basepath = basepath

    // set main router
    fn.router = (param) => {
        const router = require('express').Router()

        param(fn, router)

        fw.use(router)
    }

    // require a route file
    fn.route = (routeName, authController) => {
        let routes = require(path.normalize(rootpath + '/' + basepath + '/routes/' + routeName.toLowerCase() + '.js'))

        const router = require('express').Router()

        let routing = routes(fn)
        routing.forEach((el) => {

            let argsArray = []
            //push route path
            argsArray.push(el.route)

            //looping inits
            //middleware that will be execute before auth checking
            for(let i = 0, len = el.inits.length; i < len; i++) {
                argsArray.push(el.inits[i])
            }

            //add auth checker middleware if auth == true
            if(el.auth == 'yes') {
                argsArray.push(authController.checkAuth)
            }

            //looping middlewares
            for(let i = 0, len = el.middlewares.length; i < len; i++) {
                argsArray.push(el.middlewares[i])
            }
            let method = el.method
            router[method.toLowerCase()].apply(router, argsArray)
        })

        return router
    }

    // require a controller file
    fn.controller = (filename) => require(path.normalize(rootpath + '/' + basepath + '/controllers/' + filename.toLowerCase() + '.js'))(rootpath)

    // set global lib function on framework request object
    global.loadLib = (filename) => require(path.normalize(rootpath + '/' + basepath + '/libs/' + filename.toLowerCase() + '.js'))(rootpath)

    // set global message by code
    global.getMessage = (code, replacement) => {
        //copy & paste "en" language to another lang if you want to activate multiple language
        let langCodeEn = "en"
        let langEn = require(path.normalize(rootpath + '/' + basepath + '/lang/' + langCodeEn + '.json'))
        let objMessage = {
            "code": code,
            "en": code
        }
        let msgEn = langEn.filter((row) => row[code] !== undefined).map((row) => row[code]).toString()

        // replace with regex
        if(typeof replacement === 'string') {
            msgEn = msgEn.replace(/%s/ig, replacement)
        }else if(typeof replacement === 'object') {
            for(let i = 0, len = replacement.length; i < len; i++) {
                msgEn = msgEn.replace(/%s/i, replacement[i])
            }
        }

        // return object
        objMessage.en = msgEn != '' ? msgEn : code
        return objMessage
    }

    // set function isEmpty
    global.isEmpty = (data) => {
        for (let item in data) {
            return false
        }
        return true
    }

    // set function isJson
    global.isJson = (data) => {
        try {
            JSON.parse(data)
            return true
        } catch(e) {
            return false
        }
    }

    // set logger
    global.myLogger = require('./logger.js')("logs/" + process.env.PROJECT_NAME + ".log", process.env.PROJECT_NAME.toLowerCase(), 50000000, 10, 'trace')

    return fn
}

module.exports = fn
