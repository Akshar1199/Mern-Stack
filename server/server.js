require('dotenv').config()

const mongoose = require("mongoose");

const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors');
const spotifyRoute = require('./services/spotify');
const playlistRoutes = require('./routes/playlist');

const app = express()
app.use(cors());

app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})

// routes 
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }))

  
app.use('/spotify/', spotifyRoute);
app.use('/playlist/', playlistRoutes);

// monogodb connection establishment 
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log("listening on port ", process.env.PORT)
        })
    })
    .catch((error) => {
        console.log(error)
    })
