var mongoose=require('mongoose');
//用户表结构
module.exports = new mongoose.Schema({
    title:String,//标题
    desc:String,//描述
    price:String,//价格
    c_img:String
});