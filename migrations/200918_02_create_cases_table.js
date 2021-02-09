'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        // logic for transforming into the new state
        return queryInterface.createTable('cases',
            {
                cs_id: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                    allowNull: false
                },
                new_confirmed: {
                    type: Sequelize.INTEGER,
                    allowNull: true
                },
                total_confirmed: {
                    type: Sequelize.INTEGER,
                    allowNull: true
                },
                new_deaths: {
                    type: Sequelize.INTEGER,
                    allowNull: true,
                },
                total_deaths: {
                    type: Sequelize.INTEGER,
                    allowNull: true,
                },
                new_recovered: {
                    type: Sequelize.INTEGER,
                    allowNull: true,
                },
                total_recovered: {
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
            .then(function () {})
    },

    down: function (queryInterface, Sequelize) {
        // logic for reverting the changes
        return queryInterface.dropTable('cases')
    }
}