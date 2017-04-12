const express = require('express')
const router = express.Router()
const Sequelize = require('sequelize')

const User = require ('../models/users')
const Alert = require('../models/alerts')

var admin = require("firebase-admin");

var serviceAccount = require("../safetyswarm-firebase-adminsdk-ikhdg-ab5688cf5d.json");

const defaultApp = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://safetyswarm.firebaseio.com"
});

router.get('/', (req, res, next) => {
  res.send('you got here')
})

router.post('/users', (req, res, next) => {
  let point = {
    type: 'Point',
    coordinates: [req.body.lat, req.body.long],
    crs: { type: 'name', properties: { name: 'EPSG:4326'} }
  }
  User.findOrCreate({where: {
    deviceId: req.body.deviceId
  }, defaults: {fcmToken: req.body.fcmToken, position:point}})
  .then(([user, created]) => {
    if(!created) {
      return user.update({fcmToken: req.body.fcmToken, position:point})
    }
    else return user
  })
  .then(user => res.send(user))
  .catch(next)
})


router.get('/alerts', (req, res, next) => {
 
      Alert.findAll({
        where: Sequelize.where(
          Sequelize.fn('ST_DWithin', Sequelize.col('position'), Sequelize.fn('ST_SetSRID', Sequelize.fn('ST_MakePoint', req.query.long, req.query.lat), 4326), 0.032), true
        )
      })
      .then(alerts => res.send(alerts))
      .catch(next)
})

router.post('/alerts', (req, res, next) => {
  let point = {
    type: 'Point',
    coordinates: [req.body.long, req.body.lat],
    crs: { type: 'name', properties: { name: 'EPSG:4326'} }
  }

  Alert.create({
    message: req.body.message,
    codename: req.body.message,
    position: point
  })
  .then(alert => res.send(alert))
  .catch(next)
})

module.exports = router
