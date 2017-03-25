/**
 * Created by Lenovo on 2017/3/25.
 */

var express = require('express');
var router = express.Router();

router.get('/user', function(req, res, next){
    res.send('User');
});

module.exports = router;