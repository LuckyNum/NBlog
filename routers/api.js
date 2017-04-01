/**
 * Created by Lenovo on 2017/3/25.
 */

var express = require('express');
var router = express.Router();
var User = require('../models/User');

//统一返回格式
var responseData;

router.use(function(req, res, next){
    responseData = {
        code: 0,
        message: ''
    };

    next();
});

/**
 * 用户注册
 *      注册逻辑
 */
router.post('/user/register', function(req, res, next){
    var username = req.body.username;
    var password = req.body.password;
    var repassword = req.body.repassword;

    //用户名是否为空
    if( username == ''){
        responseData.code = 1;
        responseData.message = '用户名不能为空';
        res.json(responseData);
        return;
    }
    //密码是否为空
    if( password == ''){
        responseData.code = 2;
        responseData.message = '密码不能为空';
        res.json(responseData);
        return;
    }
    //两次输入的密码是否一致
    if( password != repassword){
        responseData.code = 3;
        responseData.message = '两次输入密码不一致';
        res.json(responseData);
        return;
    }

    //判断是否已注册
    User.findOne({
        username: username
    }).then(function( userInfo ){
        if( userInfo ){
            //表示数据库中有此记录
            responseData.code = 4;
            responseData.message = '用户已注册';
            res.json(responseData);
            return;
        }
        //保存用户信息到数据库
        var user = new User({
            username: username,
            password: password
        });
        return user.save();
    }).then(function(newUserInfo){
        console.log(newUserInfo);
        responseData.message = '注册成功，请登录';
        res.json(responseData);
    });
});

/**
 * 用户登录
 */
router.post('/user/login', function(req, res, next){
    var username = req.body.username;
    var password = req.body.password;

    if( username == '' || password == ''){
        responseData.code = 1;
        responseData.message = '用户名或密码不能为空';
        res.json(responseData);
        return;
    }

    //数据库查询
    User.findOne({
        username: username,
        password: password
    }).then(function(userInfo){
        if(!userInfo){
            responseData.code = 2;
            responseData.message = '用户名或密码错误';
            res.json(responseData);
            return;
        }

        //用户名和密码正确
        responseData.message = '登录成功';
        responseData.userInfo = {
            _id: userInfo._id,
            username: userInfo.username
        };

        req.cookies.set('userInfo', JSON.stringify({
            _id: userInfo._id,
            username: userInfo.username
        }));
        res.json(responseData);
    });
});

/**
 * 退出登录
 */
router.get('/user/logout', function(req, res, next){
    req.cookies.set('userInfo', null);
    responseData.message = '退出';
    res.json(responseData);
});

module.exports = router;