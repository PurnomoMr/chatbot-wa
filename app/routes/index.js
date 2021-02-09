'use strict';

module.exports = (app, router) => {
    const mainController = app.controller('main')
    const authController = app.controller('auth')

    router.use('/webhook', app.route('webhook', authController)) 
    router.get('/', mainController.index)
};