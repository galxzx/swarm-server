const express = require('express')
const volleyball = require('volleyball')
const bodyParser = require('body-parser')
const path = require('path')

const db = require ('./models/')

const app = express()

// logging and parsing
app.use(volleyball)
app.use(bodyParser.json())

app.use('/', require('./routes'))

app.use((err, req, res, next) => {

  console.error(err, err.stack);
  res.sendStatus(err.status || 500);

})

app.listen(1337, ()=> {
  console.log('server is up on 1337')
  return db.sync()
  .then(()=> {
    console.log('database synched')
  })
  .catch(err=>console.error(err))
})
