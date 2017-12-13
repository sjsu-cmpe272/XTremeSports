var passport = require('passport')
  , FacebookStrategy = require('passport-facebook').Strategy;
var User = require('../models/user');

passport.use(new FacebookStrategy({
    clientID: "1998632727052245",
    clientSecret: "1238bb6470422c1d5bbb9e3b8f5dbb29",
    callbackURL: "http://localhost:8001/products"
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOrCreate({name: profile.displayName}, {name: profile.displayName,userid: profile.id}, function(err, user) {
      if (err) { return done(err); }
      done(null, user);
    });
  }
));

module.exports = passport;
