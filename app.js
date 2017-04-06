/**
 * Created by Lenovo on 2017/3/24.
 * 应用程序入口文件
 */

/**
 * 01.加载模块
 */
//加载express模块
var express = require('express');
//加载模版处理模块
var swig = require('swig');
//加载mongoose模块
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
//加载body-parser,处理提交的数据
var bodyParser = require('body-parser');
//加载cookie模块
var Cookies = require('cookies');
//创建用户对象
var User = require('./models/User');
//创建app应用 => NodeJS的Http.createServer();
var app = express();

/**
 * 配置bodyParser
 */
app.use(bodyParser.urlencoded({extended: true}));

/**
 * 配置cookie
 */
app.use(function(req, res, next){
    req.cookies = new Cookies(req, res);
    //解析cookie信息
    req.userInfo = {};
    if(req.cookies.get('userInfo')){
        try{
            req.userInfo = JSON.parse(req.cookies.get('userInfo'));
            //获取当前用户的类型，是否为管理员
            User.findById(req.userInfo._id).then(function(userInfo){
                req.userInfo.isAdmin = Boolean(userInfo.isAdmin);
                next();
            });
        }catch(e){
            next();
        }
    }else{
        next();
    }
});

/**
 * 02.设置静态文件托管(用户访问的url以/public开始)
 */
app.use('/public', express.static(__dirname + '/public'));

/**
 * 03.配置应用模版
 */
//定义当前应用使用的模版引擎
//第一个参数：模版参数名称，也是模版后缀
//第二个参数：解析处理模版的方法
app.engine('html', swig.renderFile);
//设置模版存放位置
app.set('views', './views');
//注册使用的模版引擎，第一个参数为view engine,第二个参数为app.engine定义的html
app.set('view engine', 'html');
//关闭缓存，便于开发
swig.setDefaults({cache:false});

/**
 * 04.划分模块
 */
//根据请求，划分成不同模块（前台，后台，ajax请求《api》）
app.use('/admin', require('./routers/admin'));
app.use('/api', require('./routers/api'));
app.use('/', require('./routers/main'));

/**
 * 05.连接数据库
 */
mongoose.connect('mongodb://localhost:27018/NBlog', function(err){
    if(err){
        console.log('数据库连接失败');
    } else {
        console.log('数据库连接成功');
        //06.监听端口
        app.listen(8383);
    }
});

/**
 * 用户请求 -> url -> 解析路由 -> 找到匹配规则 -> 指定绑定函数，返回给用户
 * /public -> 静态 ->直接读取指定目录下的文件，返回给用户
 *         -> 动态 -> 处理业务逻辑，加载模版，解析模版 -> 返回数据
 */
/**
 * 首页
 *  req > request对象
 *  res > response对象
 *  next > 下一个处理函数
 */
//app.get('/', function(req, res, next){
//    //res.send('<h1>欢迎登录NBlog!</h1>');
//
//    /**
//     * 读取views目录下的指定文件,解析并返回给客户端
//     * 第一个参数：模版文件(默认：index)
//     * 第二个参数：传递给模版的参数
//     */
//    res.render('index');
//});