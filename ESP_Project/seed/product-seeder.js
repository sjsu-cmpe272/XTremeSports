var Product = require('../models/product');

var mongoose = require('mongoose');

mongoose.connect('localhost:27017/shopping');

var products = [
    new Product({
        imagePath: 'https://s3.amazonaws.com/vidbucketinvirginia/shoe2.jpg',
        title: 'Blue Nike Shoes',
        description: 'This is best pair of nike shoes available at our store',
        price: 10
    }),
    new Product({
        imagePath: 'https://s3.amazonaws.com/vidbucketinvirginia/jacket3.jpg',
        title: 'Jacket',
        description: 'Its right time to keep you warm with this amazing blank and white jacket',
        price: 20
    }),
    new Product({
        imagePath: 'https://s3.amazonaws.com/vidbucketinvirginia/football1.jpg',
        title: 'Adidas Football',
        description: 'Great football for indoors',
        price: 40
    }),
    new Product({
        imagePath: 'https://s3.amazonaws.com/vidbucketinvirginia/football2.png',
        title: 'Adidas Starr football',
        description: 'This even works on lawn',
        price: 15
    }),
    new Product({
        imagePath: 'https://s3.amazonaws.com/vidbucketinvirginia/gloves1.jpg',
        title: 'Gloves for hiking',
        description: 'Gloves for winter at a cheapest rate',
        price: 50
    })
];

var done = 0;
for (var i = 0; i < products.length; i++) {
    products[i].save(function(err, result) {
        done++;
        if (done === products.length) {
            exit();
        }
    });
}

function exit() {
    mongoose.disconnect();
}