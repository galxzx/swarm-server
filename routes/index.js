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
  // let point = {
  //   type: 'Point',
  //   coordinates: [req.body.lat, req.body.long]
  // }
  User.findOrCreate({where: {
    deviceId: req.body.deviceId
  }, defaults: req.body})
  .then(([user, created]) => {
    if(!created) {
      return user.update(req.body)
    }
    else return user
  })
  .then(user => res.send(user))
  .catch(next)
})


router.get('/alerts', (req, res, next) => {
  const lat1 = +req.query.lat
  const long1 = +req.query.long
  const milePerLong = Math.cos(lat1) * 69.17
  const degPer2Mile = 2 / milePerLong
  Alert.findAll({
    where: {
      lat: {
        $lte: lat1 + .032,
        $gte: lat1 - .032
      },
      long: {
        $lte: long1 + degPer2Mile,
        $gte: long1 - degPer2Mile
      }
    }

  })
 //  const distanceAlias = Sequelize.literal('"distance"')
 //  // let point = {
 //  //   type: 'Point',
 //  //   coordinates: [+req.query.lat, +req.query.long]
 //  // }
 //  const alert1 = Alert.build({position: point})
 //  console.log(alert1)
 //    Alert.findAll({
 //      attributes: [[Sequelize.fn('ST_Distance', Sequelize.col('position'), alert1.position), 'distance']],
 //      where: Sequelize.where(distanceAlias, '<=', .032)
 // //       distance: {$lte: .032}
 //    })
      .then(alerts => res.send(alerts))
      .catch(next)
})

router.post('/alerts', (req, res, next) => {


  Alert.create(req.body)
  .then(alert => {
    const milePerLong = Math.cos(alert.lat) * 69.17
    const degPer2Mile = 2 / milePerLong
    return User.findAll({
      where: {
        lat: {
          $lte: alert.lat + .032,
          $gte: alert.lat - .032
        },
        long: {
          $lte: alert.long + degPer2Mile,
          $gte: alert.long - degPer2Mile
        }
      },
      attributes: ['fcmToken']
    })
    .then(tokens => {

      tokens = tokens.map(token => {
        return token.fcmToken
      })
      let payload = {
        notification: {
          title: "NEW SWARM ALERT"
        },
        data: {
          alert: JSON.stringify(alert)
        }
      }
      return admin.messaging().sendToDevice(tokens, payload)
      .then((res) => console.log(res))
      .catch(err => console.log(err))

    })
  })
  .then(() => {res.sendStatus(200)})
  .catch(next)
})

module.exports = router
