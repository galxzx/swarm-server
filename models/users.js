const Sequelize = require('sequelize')
const db = require('./_db')

const User = db.define('user', {
  deviceId: Sequelize.STRING,
  fcmToken: Sequelize.STRING,
  position: Sequelize.GEOMETRY('POINT', 4326)
})

module.exports = User
