const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const keys = require('../config/keys');

const userm = mongoose.model('userm');

passport.serializeUser((userm, done) => {
  done(null, userm.id);
});

passport.deserializeUser((id,done)=>{
  userm.findById(id)
  .then(user=>{
    done(null,user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: '/auth/google/callback'
    },
    (accessToken, refreshToken, profile, done) => {
      userm.findOne({ googleID: profile.id }).then(existingUser => {
        if (existingUser) {
          done(null, existingUser);
        } else {
          new userm({ googleID: profile.id })
            .save()
            .then(userm => done(null, userm));
        }
      });
    }
  )
);
