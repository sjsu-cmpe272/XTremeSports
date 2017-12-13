var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

var userSchema = new Schema({
    name: {type: String, required: true},
    userid: {type: String, required: true},
    updated_at: {type: Date, default: Date.now},
});

userSchema.statics.findOrCreate = require("find-or-create");

module.exports = mongoose.model('user', userSchema);
