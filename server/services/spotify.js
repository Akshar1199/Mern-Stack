const express = require('express');
const router = express.Router();
const SpotifyWebApi = require('spotify-web-api-node');
const randString = require('randomstring');
const querystring = require('querystring');
const { LocalStorage } = require('node-localstorage')
const request = require('request')
var localStorage = new LocalStorage('./scratch');
const app = express();
const cors = require('cors');
app.use(cors());
const User = require('../models/UserModel');



var client_id = '744bf04be8dd4779a8e4d13faa847baa';
var client_secret = '5f91efad83b346088f4708e3639dca8a';
var redirect_uri = 'http://localhost:4000/spotify/callback';




router.get('/login', function (req, res) {

  var state = randString.generate(16);
  var scope = 'streaming user-read-private user-modify-playback-state user-read-email user-top-read playlist-read-private user-library-read user-read-recently-played user-library-modify playlist-modify-public playlist-modify-private user-read-playback-position playlist-modify-public playlist-modify-private';


  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
    }));
});

var globalToken = '';

router.get('/callback', async function (req, res) {


  var code = req.query.code || null;
  var state = req.query.state || null;

  if (state === null) {
    res.redirect('/#' +
      querystring.stringify({
        error: 'state_mismatch'
      }));
  } else {

    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64'))
      },
      json: true
    };



    await request.post(authOptions, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        var access_token = body.access_token;
        globalToken = access_token;
        console.log(globalToken);
        // res.header('Authorization', globalToken);
        // res.send('Token has been set as a response header');
        res.redirect('http://localhost:3000/access/' + globalToken);
        // res.json({
        //   'access_token': access_token
        // });
      }
    });

  }
});

// hello
router.get('/api/token', (req, res) => {
  console.log(globalToken);
  console.log('token sent');
  console.log('');
  res.json({ token: globalToken });
});

router.get('/refresh_token', function (req, res) {

  var refresh_token = req.query.refresh_token;
  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: { 'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64')) },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    },
    json: true
  };

  request.post(authOptions, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      var access_token = body.access_token;
      console.log(access_token);
      res.json({
        'access_token': access_token
      });
    }
  });
});


router.get('/profile/:token', async (req, res) => {
  const result = await fetch("https://api.spotify.com/v1/me/", {
    method: 'get',
    headers: {
      Authorization: `Bearer ${req.params.token}`
    }
  });

  const data = await result.json();
  const email = data.email;
  const user = await User.findOne({ email });
    if (!user) {
      const newUser = new User({
        username: data.display_name,
        email: data.email,
      });
  
      await newUser.save();
    }

    console.log(data);
    res.json(data);

})

router.get('/api/user/playlists', async (req, res) => {
  const accessToken = globalToken

  try {
    const response = await fetch('https://api.spotify.com/v1/me/playlists', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      res.json(data.items);
    } else {
      res.status(response.status).json({ error: 'Error fetching playlists' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred while fetching playlists' });
  }
});



module.exports = router;
