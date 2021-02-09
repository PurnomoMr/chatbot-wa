'use strict'

module.exports = (app) => {
    const twilioController = app.controller('twilio')
    
    let aRoutes = [
        {method: 'post', route: '/whatsapp', inits: [], middlewares: [twilioController.webhook], auth: 'yes'},
        {method: 'post', route: '/', inits: [], middlewares: [twilioController.webhook], auth: 'yes'}
    ]
    return aRoutes 
}