const Sequelize = require('sequelize')
const db = require('./_db')

const User = db.define('user', {
  deviceId: {
    type: Sequelize.STRING
  },
  fcmToken: Sequelize.STRING,
  lat: Sequelize.FLOAT,
  long: Sequelize.FLOAT
})

module.exports = User
