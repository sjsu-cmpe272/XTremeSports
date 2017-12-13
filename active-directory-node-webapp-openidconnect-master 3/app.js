/**
 * Copyright (c) Microsoft Corporation
 *  All Rights Reserved
 *  Apache License 2.0
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @flow
 */

'use strict';

/**
 * Module dependencies.
 */

var express = require('express');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var bodyParser = require('body-parser');
var passport = require('passport');
var util = require('util');
var bunyan = require('bunyan');
var config = require('./config');
var session = require('express-session');
var sess;
//var express = require('express');
//var router = express.Router();
var mongo = require('mongodb');
var objectId = require('mongodb').ObjectID;
var assert = require('assert');
var expressHbs = require('express-handlebars');
var mongoose = require('mongoose');
//var Product = require('product');

// Start QuickStart here
var Product = require('product');
var url = 'mongodb://localhost:27017/shopping';
var OIDCStrategy = require('passport-azure-ad').OIDCStrategy;

var log = bunyan.createLogger({
    name: 'Microsoft OIDC Example Web Application'
});

/*var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    imagePath: {type: String, required: true},
    title: {type: String, required: true},
    description: {type: String, required: true},
    price: {type: Number, required: true}
});

module.exports = mongoose.model('Product', schema);*/


// Passport session setup. (Section 2)

//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.
passport.serializeUser(function(user, done) {
  done(null, user.email);
});

passport.deserializeUser(function(id, done) {
  findByEmail(id, function (err, user) {
    done(err, user);
  });
});

// array to hold logged in users
var users = [];

var findByEmail = function(email, fn) {
  for (var i = 0, len = users.length; i < len; i++) {
    var user = users[i];
   log.info('we are using user: ', user);
    if (user.email === email) {
      return fn(null, user);
    }
  }
  return fn(null, null);
};

// Use the OIDCStrategy within Passport. (Section 2) 
// 
//   Strategies in passport require a `validate` function, which accept
//   credentials (in this case, an OpenID identifier), and invoke a callback
//   with a user object.
passport.use(new OIDCStrategy({
    callbackURL: config.creds.returnURL,
    realm: config.creds.realm,
    clientID: config.creds.clientID,
    clientSecret: config.creds.clientSecret,

    identityMetadata: config.creds.identityMetadata,

    responseType: config.creds.responseType,
    responseMode: config.creds.responseMode
  },
  function(iss, sub, profile, accessToken, refreshToken, done) {
    if (!profile.email) {
      return done(new Error("No email found"), null);
    }
    // asynchronous verification, for effect...
    process.nextTick(function () {
      findByEmail(profile.email, function(err, user) {
        if (err) {
          return done(err);
        }
        if (!user) {
          // "Auto-registration"
          users.push(profile);
          return done(null, profile);
        }
        return done(null, user);
      });
    });
  }
));


// configure Express (Section 2)

var app = express();


app.configure(function() {
  app.set('views', __dirname + '/views');
 // app.set('view engine', 'ejs');
  //app.engine('handlebars', engines.handlebars);
    var engines = require('consolidate');

    app.engine('ejs', engines.ejs);
    app.set('view engine', 'ejs');
    app.engine('.hbs', expressHbs({defaultLayout: 'layout', extname: '.hbs'}));
   // app.set('view engine', '.hbs');
    app.engine('handlebars', engines.handlebars);
  app.use(express.logger());
  app.use(express.methodOverride());
  app.use(cookieParser());
  app.use(expressSession({ secret: 'keyboard cat', resave: true, saveUninitialized: false }));
  app.use(bodyParser.urlencoded({ extended : true }));
  // Initialize Passport!  Also use passport.session() middleware, to support
  // persistent login sessions (recommended).
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
  app.use(express.static(__dirname + '/../../public'));
});



//Routes (Section 4)

app.get('/', function(req, res){
  res.render('index', { user: req.user });
});




app.get('/account', ensureAuthenticated, function(req, res){
  res.render('account', { user: req.user });
});





app.get('/login',
  passport.authenticate('azuread-openidconnect', { failureRedirect: '/login' }),
  function(req, res) {
      sess = req.session;
    log.info('Login was called in the Sample');
    res.redirect('/');
});

// POST /auth/openid
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in OpenID authentication will involve redirecting
//   the user to their OpenID provider.  After authenticating, the OpenID
//   provider will redirect the user back to this application at
//   /auth/openid/return
app.get('/auth/openid',
  passport.authenticate('azuread-openidconnect', { failureRedirect: '/login' }),
  function(req, res) {
    log.info('Authentication was called in the Sample');
    res.redirect('/');
  });

// GET /auth/openid/return
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get('/auth/openid/return',
  passport.authenticate('azuread-openidconnect', { failureRedirect: '/login' }),
  function(req, res) {
    log.info('We received a return from AzureAD.');
    res.redirect('/');
  });

// GET /auth/openid/return
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.post('/auth/openid/return',
  passport.authenticate('azuread-openidconnect', { failureRedirect: '/login' }),
  function(req, res) {
    log.info('We received a return from AzureAD.');
    res.redirect('/');
  });

app.get('/logout', function(req, res){

    req.session.destroy(function(err) {
        if(err) {
            console.log(err);
        } else {
            req.logout();
            res.redirect('/');
        }


});
});


app.listen(3000);


// Simple route middleware to ensure user is authenticated. (Section 4)

//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}


app.get('/product', ensureAuthenticated, function(req, res){
    res.render('product', { user: req.user });
});

app.post('/insert', function(req, res, next) {
    var product = new Product({
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
        imagePath: req.body.imagePath
    });

    mongoose.connect(url, function(err, result) {
        assert.equal(null, err);
        product.save(product, function(err, result) {
            assert.equal(null, err);
            console.log('Item inserted');
            mongoose.disconnect();
        });
    });
    res.redirect('/login');
});

app.post('/delete', function(req, res, next) {
    var id = req.body.id;

    mongo.connect(url, function(err, db) {
        assert.equal(null, err);
        //console.log(db);exit;
        db.collection('product').deleteOne({"_id": objectId(id)}, function(err, result) {
            assert.equal(null, err);
            console.log('Item deleted');
            db.close();
        });
    });
    res.redirect('/');
});

app.post('/update', function(req, res, next) {
    var item = {
        title: req.body.title,
        content: req.body.content,
        author: req.body.author
    };
    var id = req.body.id;

    mongo.connect(url, function(err, db) {
        assert.equal(null, err);
        db.collection('user-data').updateOne({"_id": objectId(id)}, {$set: item}, function(err, result) {
            assert.equal(null, err);
            console.log('Item updated');
            db.close();
        });
    });
    res.redirect('/');
});