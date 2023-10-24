const Sequelize = require('sequelize');

const sequelize = new Sequelize('node_complete', process.env.SQL_USERNAME , process.env.SQL_PASSWORD , {
    dialect: 'mysql', 
    host: 'localhost' 
});

module.exports = sequelize;




