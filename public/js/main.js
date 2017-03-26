/**
 * Created by Lenovo on 2017/3/25.
 */

$(function(){
    var $registerBox = $('#regsiter');
    var $loginBox = $('#login');

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
                alert(result);
            }
        });
    });
});