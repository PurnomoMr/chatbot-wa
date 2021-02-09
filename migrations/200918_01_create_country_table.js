'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        // logic for transforming into the new state
        return queryInterface.createTable('country',
            {
                ct_id: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                    allowNull: false
                },
                ct_code: {
                    type: Sequelize.STRING(10),
                    allowNull: true
                },
                ct_name: {
                    type: Sequelize.STRING(50),
                    allowNull: true
                },
                ct_slug: {
                    type: Sequelize.STRING(50),
                    allowNull: true,
                },
                ct_continent: {
                    type: Sequelize.STRING(50),
                    allowNull: true,
                },
                ct_population: {
                    type: Sequelize.INTEGER,
                    allowNull: true,
                },
                ct_population_density: {
                    type: Sequelize.FLOAT,
                    allowNull: true,
                },
                ct_median_age: {
                    type: Sequelize.FLOAT,
                    allowNull: true,
                },
                ct_aged_65: {
                    type: Sequelize.FLOAT,
                    allowNull: true,
                },
                ct_aged_70: {
                    type: Sequelize.FLOAT,
                    allowNull: true,
                },
                ct_extreme_poverty: {
                    type: Sequelize.FLOAT,
                    allowNull: true,
                },
                ct_gdppercapita: {
                    type: Sequelize.FLOAT,
                    allowNull: true,
                },
                ct_cvddeathrate: {
                    type: Sequelize.FLOAT,
                    allowNull: true,
                },
                ct_diabetes_prevalence: {
                    type: Sequelize.FLOAT,
                    allowNull: true,
                },
                ct_handwashing_facilities: {
                    type: Sequelize.FLOAT,
                    allowNull: true,
                },
                ct_hospital_beds_per_thousand: {
                    type: Sequelize.FLOAT,
                    allowNull: true,
                },
                ct_life_expectancy: {
                    type: Sequelize.FLOAT,
                    allowNull: true,
                },
                ct_female_smokers: {
                    type: Sequelize.FLOAT,
                    allowNull: true,
                },
                ct_male_smokers: {
                    type: Sequelize.FLOAT,
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
                    queryInterface.addIndex('country', ['ct_code'])
                ]
            });
    },

    down: function (queryInterface, Sequelize) {
        // logic for reverting the changes
        return queryInterface.dropTable('country')
    }
}