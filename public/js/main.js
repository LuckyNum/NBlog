/**
 * Created by Lenovo on 2017/3/25.
 */

$(function(){
    var $registerBox = $('#regsiter');
    var $loginBox = $('#login');
    var $userInfoBox = $('#userInfo');
    var $login_register = $('#login_register');

    //切换面板
    $('#to-login').on('click', function() {
        $registerBox.hide();
        $loginBox.show();
    });
    $('#to-register').on('click', function() {
        $registerBox.show();
        $loginBox.hide();
    });

    //注册
    $registerBox.find('button').on('click',function(){
        //通过ajax请求
        $.ajax({
            type: 'post',
            url: 'api/user/register',
            data: {
                username: $registerBox.find('[name="username"]').val(),
                password: $registerBox.find('[name="password"]').val(),
                repassword: $registerBox.find('[name="repassword"]').val()
            },
            dataType: 'json',
            success: function(result){
                $registerBox.find('.msg').html(result.message);

                if(!result.code){
                    //注册成功
                    setTimeout(function(){
                        $registerBox.hide();
                        $loginBox.show();
                    }, 1000);
                }
            }
        });
    });

    //登录
    $loginBox.find('button').on('click',function(){
        //通过ajax请求
        $.ajax({
            type: 'post',
            url: 'api/user/login',
            data: {
                username: $loginBox.find('[name="username"]').val(),
                password: $loginBox.find('[name="password"]').val()
            },
            dataType: 'json',
            success: function(result){
                $loginBox.find('.msg').html(result.message);
                if(!result.code){
                    /*$registerBox.hide();
                    $loginBox.hide();
                    $login_register.hide();
                    $userInfoBox.show();
                    //显示用户名称
                    $userInfoBox.find('#user_name').html(result.userInfo.username);
                    $userInfoBox.find('#user_info').html('你好，欢迎登录我的博客！');*/
                    //登陆成功
                    window.location.reload();
                }
            }
        });
    });

    //退出登录
    $('#logout').on('click',function(){
        $.ajax({
            url: '/api/user/logout',
            success: function (result) {
                if(!result.code){
                    window.location.reload();
                }
            }
        });
    });
});