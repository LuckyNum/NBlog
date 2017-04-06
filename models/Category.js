/**
 * Created by Lenovo on 2017/3/25.
 */

var mongoose = require('mongoose');
var categoriesSchema = require('../schemas/categories');

module.exports = mongoose.model('Category', categoriesSchema);