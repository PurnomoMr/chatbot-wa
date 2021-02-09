'use strict'

const { emptyDir } = require("fs-extra")

let obj = (rootpath) => {
    const cst = require(rootpath + '/config/const.json')
    const fn = {}
    const path = require("path")
    let objDB = require(rootpath + "/core/database.js")(rootpath)
    let moment = require('moment')

    fn.summary = async (instance) => {
        //get Connection objDB
        let db = await objDB.getConnection()
        let pandemicModel = require(rootpath + '/app/models/pandemic.js')(objDB, db, rootpath)
        let datenow = moment().format("YYYY-MM-DD HH:mm:ss")
        myLogger.trace('Cron_get_summary_covid18', 'start')

        //variable initial value
        let data = {
            "bodys": []
        }

        let looping_infinite = true

        if(moment().isBefore("07:00:00") || moment().isAfter("21:59:59")) {
            looping_infinite = false
        }
        //initial infinite looping until lenngth until all data have been processed
        while(looping_infinite) {
            // get data summary from API Covid19 Postman
            let result = await loadLib("covid19").summary(data)
            myLogger.trace('Cron_get_summary_covid18_response', JSON.stringify(result))
            
            if(result.http_code == 200 && !isEmpty(result.response)) {
                let listSummary = JSON.parse(JSON.stringify(result.response)) || []
                let listSummaryCountry = listSummary.Countries || []

                if(!isEmpty(listSummary.Global)) {
                    let casesGlobal = await pandemicModel.getCasesGlobal()
                    let dataCasesGlobal = {

                        new_confirmed: listSummary.Global.NewConfirmed,
                        total_confirmed: listSummary.Global.TotalConfirmed,
                        new_deaths: listSummary.Global.NewDeaths,
                        total_deaths: listSummary.Global.TotalDeaths,
                        new_recovered: listSummary.Global.NewRecovered,
                        total_recovered: listSummary.Global.TotalRecovered
                    }

                    if(isEmpty(casesGlobal)) {
                        dataCasesGlobal.created_date = datenow

                        let insertCasesGlobal = await pandemicModel.insertCasesGlobal(dataCasesGlobal)

                        if(insertCasesGlobal) {
                            myLogger.info('Cron_get_summary_covid18_casesGlobal_info_insert_success', JSON.stringify(dataCasesGlobal))
                        } else {
                            myLogger.info('Cron_get_summary_covid18_casesGlobal_info_insert_failed', JSON.stringify(dataCasesGlobal))
                        }
                    } else {
                        dataCasesGlobal.updated_date = datenow

                        let updateCasesGlobal = await pandemicModel.updateCasesGlobal(casesGlobal.cs_id, dataCasesGlobal)

                        if(updateCasesGlobal) {
                            myLogger.info('Cron_get_summary_covid18_casesGlobal_info_update_success', JSON.stringify(dataCasesGlobal))
                        } else {
                            myLogger.info('Cron_get_summary_covid18_casesGlobal_info_update_failed', JSON.stringify(dataCasesGlobal))
                        }
                    }
                } else {
                    myLogger.trace('Cron_get_summary_covid18_cases_global_failed', 'Global Data Not found')
                }
                
                for (let key = 0; listSummaryCountry.length > key; key++) {
                    let cc_id, ct_id, cch_id, cs_id = 0
                    let summaryCountry = listSummaryCountry[key]
                                        
                    let dataCountry = {
                        ct_code: summaryCountry.CountryCode,
                        ct_name: summaryCountry.Country,
                        ct_slug: summaryCountry.Slug,
                        ct_continent: summaryCountry.Premium.CountryStats.Continent,
                        ct_population: summaryCountry.Premium.CountryStats.Population,
                        ct_population_density: summaryCountry.Premium.CountryStats.PopulationDensity,
                        ct_median_age: summaryCountry.Premium.CountryStats.MedianAge,
                        ct_aged_65: summaryCountry.Premium.CountryStats.Aged65Older,
                        ct_aged_70: summaryCountry.Premium.CountryStats.Aged70Older,
                        ct_extreme_poverty: summaryCountry.Premium.CountryStats.ExtremePoverty,
                        ct_gdppercapita: summaryCountry.Premium.CountryStats.GdpPerCapita,
                        ct_cvddeathrate: summaryCountry.Premium.CountryStats.CvdDeathRate,
                        ct_diabetes_prevalence: summaryCountry.Premium.CountryStats.DiabetesPrevalence,
                        ct_handwashing_facilities: summaryCountry.Premium.CountryStats.HandwashingFacilities,
                        ct_hospital_beds_per_thousand: summaryCountry.Premium.CountryStats.HospitalBedsPerThousand,
                        ct_life_expectancy: summaryCountry.Premium.CountryStats.LifeExpectancy,
                        ct_female_smokers: summaryCountry.Premium.CountryStats.FemaleSmokers,
                        ct_male_smokers: summaryCountry.Premium.CountryStats.MaleSmokers
                    }

                    let dataCasesCountry = {
                        cc_new_confirm: summaryCountry.NewConfirmed,
                        cc_total_confirmed: summaryCountry.TotalConfirmed,
                        cc_new_deaths: summaryCountry.NewDeaths,
                        cc_total_deaths: summaryCountry.TotalDeaths,
                        cc_new_recovered: summaryCountry.NewRecovered,
                        cc_total_recovered: summaryCountry.TotalRecovered
                    }
                    
                    let dataCasesCountryHistory = {
                        cch_new_confirm: summaryCountry.NewConfirmed,
                        cch_total_confirmed: summaryCountry.TotalConfirmed,
                        cch_new_deaths: summaryCountry.NewDeaths,
                        cch_total_deaths: summaryCountry.TotalDeaths,
                        cch_new_recovered: summaryCountry.NewRecovered,
                        cch_total_recovered: summaryCountry.TotalRecovered
                    }

                    let country = await pandemicModel.getCountryByCode(summaryCountry.CountryCode)
                    if(isEmpty(country)) {
                        dataCountry.created_date = datenow

                        let insertCountry = await pandemicModel.insertCountry(dataCountry)

                        if(insertCountry) {
                            ct_id = insertCountry
                            myLogger.info('Cron_get_summary_covid18_country_info_insert_success', JSON.stringify(dataCountry))
                        } else {
                            myLogger.info('Cron_get_summary_covid18_country_info_insert_failed', JSON.stringify(dataCountry))
                        }
                    } else {
                        ct_id = country.ct_id
                        dataCountry.updated_date = datenow

                        let updatedCountry = await pandemicModel.updateCountry(country.ct_id, dataCountry)

                        if(updatedCountry) {
                            myLogger.info('Cron_get_summary_covid18_country_info_update_success', JSON.stringify(dataCountry))
                        } else {
                            myLogger.info('Cron_get_summary_covid18_country_info_update_failed', JSON.stringify(dataCountry))
                        }
                    }
                    
                    // process cases country on summary response
                    let casesCountry = await pandemicModel.getCasesCountryByCountry(ct_id)
                    if(ct_id > 0) {
                        
                        if(isEmpty(casesCountry)) {
                            dataCasesCountry.ct_id = ct_id
                            dataCasesCountry.created_date = datenow

                            let insertCaseCountry = await pandemicModel.insertCasesCountry(dataCasesCountry)
                            if(insertCaseCountry) {
                                // save to cases country history
                                dataCasesCountryHistory.ct_id = ct_id
                                dataCasesCountryHistory.cc_id = insertCaseCountry
                                dataCasesCountryHistory.created_date = datenow
                                let insertCaseCountryHistory = await pandemicModel.insertCasesCountryHistory(dataCasesCountryHistory)
                                if(insertCaseCountryHistory) {
                                    myLogger.info('Cron_get_summary_covid18_cases_country_history_info_insert_success', JSON.stringify(dataCasesCountryHistory))
                                }
                            } else {
                                myLogger.info('Cron_get_summary_covid18_cases_country_info_insert_failed', JSON.stringify(dataCasesCountryHistory))
                            }
                        } else {
                            cc_id = casesCountry.cc_id
                            ct_id = casesCountry.ct_id
                            dataCasesCountry.updated_date = datenow
                            let updatedCasesCountry = await pandemicModel.updateCasesCountry(cc_id, dataCasesCountry)
    
                            if(updatedCasesCountry) {
                                myLogger.info('Cron_get_summary_covid18_cases_country_info_update_success', JSON.stringify(dataCasesCountry))

                                // update cases country history if did not have today 
                                dataCasesCountryHistory.ct_id = casesCountry.ct_id
                                dataCasesCountryHistory.cc_id = casesCountry.cc_id

                                /**
                                 * search history today
                                 * if does not exist
                                 * it would created new data with created date is today
                                 * and exist, it would be update existing data with updated date now
                                 */
                                let where = " AND ct_id = ? AND cc_id = ? AND DATE(created_date) = ? "
                                let dataHistory = [ct_id, cc_id, moment(datenow).format("YYYY-MM-DD")]
                                let casesHistory = await pandemicModel.getAllCasesCountryHistory(where, dataHistory, " cch_id  DESC ", 1)
                                if(!isEmpty(casesHistory)) {
                                    dataCasesCountryHistory.updated_date = datenow
                                    let updatedCaseHistory = await pandemicModel.updateCasesCountryHistory(casesHistory[0].cch_id, dataCasesCountryHistory)
                                } else {
                                    dataCasesCountryHistory.created_date = datenow
                                    let insertCaseHistory = await pandemicModel.insertCasesCountryHistory(dataCasesCountryHistory)
                                }

                            } else {
                                console.log("")
                                myLogger.info('Cron_get_summary_covid18_cases_country_info_update_failed', JSON.stringify(dataCasesCountryHistory))
                            }
                        }
                    } else {
                        console.log("333333")
                        myLogger.info('Cron_get_summary_covid18_country_info_failed', 'CT_ID not found')
                    }

                }

                looping_infinite = false
            } else{
                looping_infinite = false
                myLogger.trace('Cron_get_summary_covid18_response', 'data not found!')
            }
        }
        myLogger.trace('Cron_get_summary_covid18', 'end')
        db.destroy()
    }

    return fn
}
module.exports = obj
