/*
 * GET home page.
 */
var express = require('express');
var router = express.Router();
var mongo = require('mongodb').MongoClient;
var objectId = require('mongodb').ObjectID;
var assert = require('assert');

var mongoose = require('mongoose');
var Product = require('../models/product');

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};



/*router.post('/insert', function(req, res, next) {
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
    res.redirect('/');
});*/

