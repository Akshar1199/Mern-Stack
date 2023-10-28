require('dotenv').config()
const User = require('../models/UserModel').default;

const passport = require('passport')
const googleStrategy = require('passport-google-oauth20').Strategy

// passport.serializeUser((user, cb) => {
//     cb(null, user._id)
// })

// passport.deserializeUser((id, cb) => {
//     User.findById(_id).then((user) => {
//         cb(null, user)
//     })
// })

// for google signup
passport.use(new googleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/auth/signup/google/callback"
    }, 
    async function(accessToken, refreshToken, profile, cb) {
        console.log(profile)
        // User.findOrCreate({ googleId: profile.id , name: profile.name}, function (err, user) {
        //     console.log(profile.id, profile.name);
        //     return cb(err, user);
        // });
        try {
            const profileId = profile.id;
            const profileName = profile.name;
            const profileEmail = profile.emails[0]["value"];

            // Check if the user already exists
            const existingUser = await User.findOne({ profileId });
            if (existingUser) {
                console.log('account already exists');
            //   return res.status(400).json({ message: 'Account already exists' });
            }
            console.log("from auth.js")
            console.log(profile.emails[0]["value"])
            // Hash the password
            // const hashedPassword = await bcrypt.hash(password, 10)
        
            // Create a new user
            const newUser = new User({
                googleId: profileId,
                googleName: profileName,
                email: profileEmail
            });
        
            await newUser.save();
            console.log(newUser, 'user registered');
            // return res.status(201).json({ message: 'User registered successfully' });
          } catch (error) {
            console.error(error);
            // return res.status(500).json({ message: 'Internal server error' });
          }
    }
));

// passport.use(new googleStrategy({
//         clientID: process.env.GOOGLE_CLIENT_ID,
//         clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//         callbackURL: "/auth/login/google/callback"
//     }, 
//     async function(accessToken, refreshToken, profile, cb) {

//     }
// ));
