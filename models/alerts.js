const Sequelize = require('sequelize')
const db = require('./_db')

const Alert = db.define('alert', {
  deviceId: Sequelize.STRING,
  position: Sequelize.GEOMETRY('POINT', 4326),
  codename: Sequelize.STRING,
  message: Sequelize.STRING
})

module.exports = Alert
