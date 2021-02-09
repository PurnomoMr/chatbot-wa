"use strict"
let obj = (rootpath) => {
    const cst = require(rootpath + '/config/const.json')
    const moment = require('moment')
    const validator = require('validator')
    const twilio = require('twilio')
    const fn = {}

    // START BANNER
    fn.webhook = async (req, res, next) => {
        try {
            /**
             *  {
                    "SmsMessageSid": "SM6a656e1e65dbe672d792f1a6e92d107d",
                    "NumMedia": "0",
                    "SmsSid": "SM6a656e1e65dbe672d792f1a6e92d107d",
                    "SmsStatus": "received",
                    "Body": "Test",
                    "To": "whatsapp:+14155238886",
                    "NumSegments": "1",
                    "MessageSid": "SM6a656e1e65dbe672d792f1a6e92d107d",
                    "AccountSid": "AC436124a0dec69f108ac40a31d9013a40",
                    "From": "whatsapp:+6287881591430",
                    "ApiVersion": "2010-04-01"
                }
             */
            let body = req.body || []
            let message = ""

            if(isEmpty(body)) {
                throw getMessage("auth002")
            }

            let message_body = String(body.Body).toUpperCase() || ""
            let message_from = body.From || ""
            let message_to = body.To || ""
            let split = message_body.split(",")
            
            // process message
            for(let key = 0; split.length > key; key++) {
                if(key > 2) {
                    break
                }
                if(split[key] == "LIST ACTION"){
                    message += "List Action: \n" +
                        "CASES country_code \n" +
                        "DEATHS country_code \n" +
                        "RECOVERED country_code \n"+
                        "CASES TOTAL \n" +
                        "DEATHS TOTAL \n" +
                        "RECOVERED TOTAL \n "+
                        "COUNTRY country_name "
                    break
                }
                message += await req.model('twilio').generateQueryFilterAction(split[key])
            }

            if(!validator.isEmpty(message)) {
                // send to wa customer
                let data = {
                    from: message_to,
                    body: message,
                    to: message_from
                }
                loadLib("twilio").sendWA(data)
            }

            res.success(getMessage("success"))
        } catch(e) {next(e)}

    }
    // END BANNER

    return fn
}

module.exports = obj