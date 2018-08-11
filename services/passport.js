const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const keys = require('../config/keys');

const User = mongoose.model('userm');

passport.serializeUser((userm, done) => {
  done(null, userm.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then(user => {
    done(null, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL:
        'https://damp-oasis-24984.herokuapp.com/auth/google/callback',
      proxy: true
    },
    (accessToken, refreshToken, profile, done) => {
      User.findOne({ googleID: profile.id }).then(existingUser => {
        if (existingUser) {
          // we have a user record with the given profile

          done(null, existingUser);
        } else {
          new User({ googleID: profile.id })
            // we don't have a user record with this ID, make one

            .save()
            .then(userm => done(null, userm));
        }
      });
    }
  )
);
