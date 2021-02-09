'use strict'
let obj = (objDB, db, rootpath) => {

    const tbl = require(rootpath + '/config/tables.json')
    const fn = {}

    // BEGIN CASES
    fn.getCasesGlobal = async () => {
        let sql = "SELECT * FROM " + tbl.cases + " WHERE 1=1 ORDER BY cs_id DESC LIMIT 1"

        let [rows] = await db.query(sql)
        return rows
    }

    fn.insertCasesGlobal = async (data) => {
        let res = await objDB.insert(db, tbl.cases, data)
        return res.insertId
    }

    fn.updateCasesGlobal = async (id, data) => {
        let where = {'cond': 'cs_id = ?', 'bind': [id]}
        return await objDB.update(db, tbl.cases, where, data)
    }
    // END CASES

    // BEGIN CASES COUNTRY
    fn.getCasesCountryById = async (id) => {
        let sql = "SELECT * FROM " + tbl.cases_country + " WHERE 1=1 AND cc_id = ? ORDER BY cc_id DESC LIMIT 1"

        let [rows] = await db.query(sql, [id])
        return rows
    }

    fn.getCasesCountryByCountry = async (ct_id) => {
        let sql = "SELECT * FROM " + tbl.cases_country + " WHERE 1=1 AND ct_id = ? ORDER BY cc_id DESC LIMIT 1"

        let [rows] = await db.query(sql, [ct_id])
        return rows
    }

    fn.getAllCasesCountry = async (where = '', data = [], order_by = " cc_id ASC ", limit = 0) => {
        let sql =
            "SELECT * FROM " + tbl.cases_country +
            " WHERE 1=1 " + where + " ORDER BY " + order_by

        let result = await objDB.getAll(db, sql, data, limit)
        return result
    }

    fn.insertCasesCountry = async (data) => {
        let res = await objDB.insert(db, tbl.cases_country, data)
        return res.insertId
    }

    fn.updateCasesCountry = async (id, data) => {
        let where = {'cond': 'cc_id = ?', 'bind': [id]}
        return await objDB.update(db, tbl.cases_country, where, data)
    }
    // END CASES COUNTRY

    // BEGIN CASES COUNTRY HISTORY
    fn.getAllCasesCountryHistory = async (where = '', data = [], order_by = " cch_id ASC ", limit = 0) => {
        let sql =
            "SELECT * FROM " + tbl.cases_country_history +
            " WHERE 1=1 " + where + " ORDER BY " + order_by

        let result = await objDB.getAll(db, sql, data, limit)
        return result
    }

    fn.insertCasesCountryHistory = async (data) => {
        let res = await objDB.insert(db, tbl.cases_country_history, data)
        return res.insertId
    }

    fn.updateCasesCountryHistory = async (id, data) => {
        let where = {'cond': 'cch_id = ?', 'bind': [id]}
        return await objDB.update(db, tbl.cases_country_history, where, data)
    }
    // END CASES COUNTRY HISTORY


    // BEGIN COUNTRY
    fn.getAllCountry = async (where = '', data = [], order_by = " ct_id ASC ", limit = 0) => {
        let sql =
            "SELECT * FROM " + tbl.country +
            " WHERE 1=1 " + where + " ORDER BY " + order_by

        let result = await objDB.getAll(db, sql, data, limit)
        return result
    }
    
    fn.getCountryByCode = async (code) => {
        let sql =
            "SELECT * FROM " + tbl.country +
            " WHERE 1=1 AND ct_code = ?  ORDER BY ct_id ASC LIMIT 1"

        let [rows] = await db.query(sql, [code])
        return rows
    }

    fn.getCountryBySlug = async (code) => {
        let sql =
            "SELECT * FROM " + tbl.country +
            " WHERE 1=1 AND ct_slug = ?  ORDER BY ct_id ASC LIMIT 1"

        let [rows] = await db.query(sql, [code])
        return rows
    }

    fn.getCountryById = async (id) => {
        let sql =
            "SELECT * FROM " + tbl.country +
            " WHERE 1=1 AND ct_id = ? ORDER BY ct_id ASC LIMIT 1"

        let [rows] = await db.query(sql, [id])
        return rows
    }

    fn.insertCountry = async (data) => {
        let res = await objDB.insert(db, tbl.country, data)
        return res.insertId
    }

    fn.updateCountry = async (id, data) => {
        let where = {'cond': 'ct_id = ?', 'bind': [id]}
        return await objDB.update(db, tbl.country, where, data)
    }
    // END COUNTRY

    // START PANDEMIC
    fn.getCasesByToday = async (where, data, order_by = " cc.cc_id ASC ") => {

        let sql = " SELECT cc.cc_id, cc.ct_id, ct.ct_code, ct.ct_name, cc.cc_new_confirm, cc.cc_total_confirmed,"+
                "cc.cc_new_deaths, cc.cc_total_deaths, cc.cc_new_recovered, cc.cc_total_recovered " +
                "FROM " + tbl.cases_country + " cc " +
                "INNER JOIN " + tbl.country + " ct ON cc.ct_id = ct.ct_id " +
                "WHERE 1=1 "+ where + " ORDER BY " + order_by + " LIMIT 1 "
        
        let [rows] = await db.query(sql, data)
        return rows
    }

    fn.getCasesByYesterday = async (where, data, order_by = " cch.cch_id ASC ") => {

        let sql = " SELECT cch.cch_id, cch.ct_id, ct.ct_code, ct.ct_name, cch.cch_new_confirm, cch.cch_total_confirmed,"+
                "cch.cch_new_deaths, cch.cch_total_deaths, cch.cch_new_recovered, cch.cch_total_recovered " +
                "FROM " + tbl.cases_country_history + " cch " +
                "INNER JOIN " + tbl.country + " ct ON cch.ct_id = ct.ct_id " +
                "WHERE 1=1 "+ where + " ORDER BY " + order_by + " LIMIT 1 "
        
        let [rows] = await db.query(sql, data)
        return rows
    }
    // END PANDEMIC
    return fn
}

module.exports = obj
