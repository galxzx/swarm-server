const Sequelize = require('sequelize')
const db = require('./_db')

const Alert = db.define('alert', {
  deviceId: Sequelize.STRING,
  lat: Sequelize.FLOAT,
  long: Sequelize.FLOAT,
  codename: Sequelize.STRING,
  message: Sequelize.STRING
})

module.exports = Alert
