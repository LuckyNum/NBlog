/**
 * Created by Lenovo on 2017/3/25.
 */

var mongoose = require('mongoose');

//�û���ṹ
module.exports = new mongoose.Schema({

    //�û���
    username: String,
    //����
    password: String
});