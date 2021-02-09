'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        // logic for transforming into the new state
        return queryInterface.createTable('cases_country',
            {
                cc_id: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                    allowNull: false
                },
                ct_id: {
                    type: Sequelize.INTEGER,
                    allowNull: true
                },
                cc_new_confirm: {
                    type: Sequelize.INTEGER,
                    allowNull: true
                },
                cc_total_confirmed: {
                    type: Sequelize.INTEGER,
                    allowNull: true,
                },
                cc_new_deaths: {
                    type: Sequelize.INTEGER,
                    allowNull: true,
                },
                cc_total_deaths: {
                    type: Sequelize.INTEGER,
                    allowNull: true,
                },
                cc_new_recovered: {
                    type: Sequelize.INTEGER,
                    allowNull: true,
                },
                cc_total_recovered: {
                    type: Sequelize.INTEGER,
                    allowNull: true,
                },
                created_date: {
                    type: Sequelize.DATE,
                    allowNull: true
                },
                updated_date: {
                    type: Sequelize.DATE,
                    allowNull: true
                }
            }, {
                freezeTableName: true,
                engine: 'InnoDB',
                charset: 'utf8'
            })
            .then(function () {
                return [
                    queryInterface.addIndex('cases_country', ['ct_id'])
                ]
            })
    },

    down: function (queryInterface, Sequelize) {
        // logic for reverting the changes
        return queryInterface.dropTable('cases_country')
    }
}