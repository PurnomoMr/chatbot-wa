'use strict'

let obj = (objDB, db, rootpath) => {

    const cst = require(rootpath + '/config/const.json')
    const tbl = require(rootpath + '/config/tables.json')
    const moment = require("moment")
    const validator = require("validator")
    const fn = {}

    fn.generateQueryFilterAction = async (message) => {
        
        const pandemicModel = require('./pandemic.js')(objDB, db, rootpath)
        let is_yesterday = message.search(cst.yesterday) == -1 ? 0 : 1 
        let is_country = message.search(cst.country) == -1 ? 0 : 1 
        let splitWord = message.trim().split(" ")
        let where = ""
        let number = 0
        let data = []
        let result = []
        let response = ""
        let is_total = 0
        let country_code = ""
        let country_slug = ""
        let casesData = [
            cst.cases_total, 
            cst.deaths_total, 
            cst.recovered_total, 
            cst.new_cases_total, 
            cst.new_deaths_total, 
            cst.new_recovered_total,
            cst.cases_total_today,
            cst.deaths_total_today, 
            cst.recovered_total_today, 
        ]

        
        if(casesData.includes(message)) {
            is_total = 1
        }

        // split the word for getting filter request action
        for(let key = 0; splitWord.length > key; key++) {
            if(![cst.cases, cst.deaths, cst.recovered, cst.total, cst.today, cst.country, cst.new].includes(splitWord[key]) && !is_country){
                country_code =  splitWord[key]
                where += " AND ct.ct_code = ? "
                data.push(country_code)
                break;
            }
        }

        if(is_yesterday && !is_total) {
            where += " AND DATE(cch.created_date) = ? "
            data.push(moment().add(-1).format("YYYY-MM-DD"))
            result = await pandemicModel.getCasesByYesterday(where, data)
        } else if(is_total){
            result = await pandemicModel.getCasesGlobal()
        } else if(is_country) {
            country_slug = splitWord[1]
            result = await pandemicModel.getCountryBySlug(country_slug)
        } else {
            result = await pandemicModel.getCasesByToday(where, data)
        }
        
        if(!isEmpty(result)) {
            switch (message) {
                case cst.cases_total:
                    response = "Total Active Cases " + result.total_confirmed + ". "
                    is_total = 1
                    break;
                case cst.deaths_total:
                    response = "Total Deaths " + result.total_deaths + ". "
                    is_total = 1
                    break;
                case cst.recovered_total:
                    response = "Total Recovered " + result.total_recovered + ". "
                    is_total = 1
                    break;
                case cst.new_cases_total:
                    response = "Total New Cases " + result.new_confirmed + ". "
                    is_total = 1
                    break;
                case cst.new_deaths_total:
                    response = "Total New Deaths " + result.new_deaths + ". "
                    is_total = 1
                    break;
                case cst.new_recovered_total:
                    response = "Total New Recovered " + result.new_recovered + ". "
                    is_total = 1
                    break;
                default:
                    break;
            }
            
            if(!is_total && (!validator.isEmpty(country_code) || !validator.isEmpty(country_slug))) {
                let words = splitWord.length == 2 ? splitWord[0] : splitWord[0].concat(splitWord[1])
                switch (words) {
                    case cst.cases:
                        number = result.cc_total_confirmed
                        if(is_yesterday) {
                            number = result.cch_total_confirmed
                        }
                        response = country_code + " Active Cases " + number + ". "
                        break
                    case cst.deaths:
                        number = result.cc_total_deaths
                        if(is_yesterday) {
                            number = result.cch_total_deaths
                        }
                        response = country_code + " Deaths " + number + ". "
                        break
                    case cst.recovered:
                        number = result.cc_total_recovered
                        if(is_yesterday) {
                            number = result.cch_total_recovered
                        }
                        response = country_code + " Recovered " + number + ". "
                        break
                    case cst.country:
                        let ct_code = result.ct_code
                        response = country_slug + " code is " + ct_code + ". "
                        break
                    case cst.new_cases:
                        number = result.cc_new_confirm
                        response = country_slug + " New Cases " + number + ". "
                        break
                    case cst.new_deaths:
                        number = result.cc_new_deaths
                        response = country_slug + " New Deaths " + number + ". "
                        break
                    case cst.new_recovered:
                        number = result.cc_new_recovered
                        response = country_slug + " New Recovered " + number + ". "
                        break
                    default: 
                        break
                }
            }

        }

        return response
    }


    return fn
}

module.exports = obj
