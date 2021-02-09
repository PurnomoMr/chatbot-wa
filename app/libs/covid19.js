'use strict'

let obj = (rootpath) => {
    const config = require(rootpath + '/config/config.json')
    const cst = require(rootpath + '/config/const.json')
    const moment = require('moment')
    const fn = {}
    const request = require('request-promise')
    const uuidv = require('uuid/v4')

    /**
     * 
     * @param {*} data Array
     * this function to get data all country from covid19-api
     */
    fn.country = async (data = []) => {
        try {
    
            data.method = "GET"
            let options = await fn.getOptions(data)

            let response = await request(options)

            let result = {
                "http_code": 200,
                "response": response
            }
            myLogger.trace("libs_covid_response_error", JSON.stringify(result))
            return result
        } catch (e) {
            let result = {
                "http_code": 500,
                "response": e
            }
            myLogger.trace("libs_covid_response_error", JSON.stringify(result))
            return result
        }
    }

    /**
     * 
     * @param {*} data Array
     * this function to get data summary from covid19-api
     */
    fn.summary = async (data) => {
        try {

            data.method = "GET"
            let options = await fn.getOptions(data, "summary")
            
            let response = await request(options)
            
            let result = {
                "http_code": 200,
                "response": response
            }
            myLogger.trace("libs_covid19_response_success", JSON.stringify(result))
            return result
        } catch (e) {
            let result = {
                "http_code": 500,
                "response": e
            }
            myLogger.trace("libs_covid19_response_error", JSON.stringify(result))
            return result
        }
    }

    fn.getOptions = async (data, action_url) => {
        try{
        
            let options = {
                method: data.method,
                url: config.covid19.url + action_url,
                headers: {
                    'Content-Type': 'application/json',
                    'X-Access-Token': config.covid19.auth.access_token 
                },
                body: data.bodys,
                json: true
            }

            return options
        }catch(e) {
            throw e
        }
    }

    return fn
}

module.exports = obj