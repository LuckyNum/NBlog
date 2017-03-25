/**
 * Created by Lenovo on 2017/3/25.
 */

var mongoose = require('mongoose');
var usersSchema = require('../schemas/users');

module.exports = mongoose.model('User', usersSchema);