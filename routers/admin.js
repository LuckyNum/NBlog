/**
 * Created by Lenovo on 2017/3/25.
 */

var express = require('express');
var router = express.Router();
var User = require('../models/User');
var Category = require('../models/Category');


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
                page: page,
                link: '/admin/user'
            });
        });

    });
});

/**
 * 分类首页
 */
router.get('/category', function(req, res){

    var page = Number(req.query.page || 1);
    var limit = 5;
    var pages = 0;

    Category.count().then(function(count){

        //计算总页数
        pages = Math.ceil(count / limit);
        //取值不超过pages
        page = Math.min( page, pages);
        //取值不小于1
        page = Math.max( page, 1);

        var skip = (page-1)*limit;

        Category.find().limit(limit).skip(skip).then(function(categories){
            //console.log(users);
            res.render('admin/category/index',{
                userInfo: req.userInfo,
                categories: categories,

                count: count,
                pages: pages,
                page: page,
                link: '/admin/category'
            });
        });

    });

});

/**
 * 分类的添加
 */
router.get('/category/add', function(req, res){

    res.render('admin/category/add', {
        userInfo: req.userInfo
    });
});

/**
 * 分类的提交
 */
router.post('/category/add', function(req, res){

    var name = req.body.name || '';

    if(name == ''){
        res.render('admin/error.html',{
            userInfo: req.userInfo,
            message: '名称不能为空'
        });
    }

    //数据库中是否已存在
    Category.findOne({
        name: name
    }).then(function(rs){
        if(rs){
            //数据库已存在
            res.render('admin/error',{
                userInfo: req.userInfo,
                message: '分类已存在'
            });
            return Promise.reject();
        }else{
            //保存
            return new Category({
                name: name
            }).save();
        }
    }).then(function(newCategory){
        res.render('admin/success',{
            userInfo: req.userInfo,
            message: '保存分类成功',
            url: '/admin/category'
        })
    })
});

/**
 * 分类修改
 */
router.get('/category/edit', function(req, res){

    //获取分类信息，返回表单
    var id = req.query.id || '';

    //获取分类信息
    Category.findOne({
        _id: id
    }).then(function(category){
        if(!category){
            res.render('admin/error', {
                userInfo: req.userInfo,
                message: '分类信息不存在'
            });
            return Promise.reject();
        } else {
            res.render('admin/category/edit', {
                userInfo: req.userInfo,
                category: category
            });
        }
    })
});
/**
 * 分类修改保存
 */
router.post('/category/edit', function(req, res){

    //获取分类信息，返回表单
    var id = req.query.id || '';

    //获取分类信息
    Category.findOne({
        _id: id
    }).then(function(category){
        if(!category){
            res.render('admin/error', {
                userInfo: req.userInfo,
                message: '分类信息不存在'
            });
            return Promise.reject();
        } else {
            //没做修改
            if(name == category.name){
                res.render('admin/success', {
                    userInfo: req.userInfo,
                    message: '修改成功',
                    url: 'admin/category'
                });
                return Promise.reject();
            } else {
                //是否已经存在
                return Category.findOne({
                    _id: {$ne: id},
                    name: name
                });
            }
        }
    }).then(function(sameCategory){
        if(sameCategory){
            res.render('admin/error', {
                userInfo: req.userInfo,
                message: '分类已存在'
            });
            return Promise.reject();
        } else {
            Category.update({
                _id: id
            },{
                name :name
            });
        }
    }).then(function(){
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: '修改成功',
            url: 'admin/category'
        });
    })
});

/**
 * 分类删除
 */
router.get('/category/delete', function(req, res){

    //获取分类信息，返回表单
    var id = req.query.id || '';

    Category.remove({
        _id: id
    }).then(function(){
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: '删除成功',
            url: 'admin/category'
        });
    })
});

module.exports = router;