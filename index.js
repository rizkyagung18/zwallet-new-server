const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const routeNav = require('./src/')
const routeAdmin = require('./src/admin')
require('dotenv').config()
var admin = require("firebase-admin");

var serviceAccount = require("./src/services/zwallet-fe539-firebase-adminsdk-yns68-18457d206d.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://zwallet-fe539.firebaseio.com"
});

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors())

app.use('/api/v1', routeNav)
app.use('/admin/api/v1', routeAdmin)

app.use(express.static('public'))

app.listen(process.env.PORT || 8000, () => { 
    console.log('Server running')
})