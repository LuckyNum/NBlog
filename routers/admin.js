/**
 * Created by Lenovo on 2017/3/25.
 */

var express = require('express');
var router = express.Router();
var User = require('../models/User');


router.use(function(req, res, next){

    if(!req.userInfo.isAdmin){
        //不是管理员
        res.send('<h1 style="color: red;">对不起，你不是博主哦！</h1>');
        return;
    }
    next();
});

router.get('/', function(req, res, next){
    res.render('admin/index',{
        userInfo: req.userInfo
    });
});

/**
 * 用户管理
 */
router.get('/user', function(req, res){


    //数据库查询
    //limit(number)限制查询条数
    //skip(number)忽略数据的条数
    //每页显示5条
    //1:1-5 skip:0
    //2:6-10 skip:5
    var page = Number(req.query.page || 1);
    var limit = 5;
    var pages = 0;

    User.count().then(function(count){

        //计算总页数
        pages = Math.ceil(count / limit);
        //取值不超过pages
        page = Math.min( page, pages);
        //取值不小于1
        page = Math.max( page, 1);

        var skip = (page-1)*limit;

        User.find().limit(limit).skip(skip).then(function(users){
            //console.log(users);
            res.render('admin/user/index',{
                userInfo: req.userInfo,
                users: users,

                count: count,
                pages: pages,
                page: page
            });
        });

    });
});

module.exports = router;