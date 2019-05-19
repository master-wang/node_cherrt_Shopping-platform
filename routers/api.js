var express=require('express');
var router=express.Router();
var User=require('../models/user');
var Order = require('../models/order')
var Cherry = require('../models/cherry');
var responData;
//上传图片的 multer 配置
const multer = require('multer');
const path = require('path');
const lastdir = path.resolve(__dirname, '..');
var Bod_imgs = [];
var B_path = '/public/upimgs/';

var imgpath = '/public/upimgs/';
var user_img = ''
var storage = multer.diskStorage({
    destination: path.join(lastdir,'/public/upimgs'),

    filename: function (req, file, cb) {
        var str = file.originalname.split('.');
        var imgname = Date.now()+'.'+str[1];
        //处理单张图片
        user_img = imgname;
        //imgpath = imgpath + imgname;
        //处理多张图片
        B_path = B_path + imgname;
        Bod_imgs.push(B_path);
        B_path = '/public/upimgs/';

        cb(null, imgname);
    }
})
var upload = multer({ storage: storage });//存储器

router.use(function(req,res,next){
    responData={
        code:0,
        message:''
    }
    next();
})

router.post('/user/register',function(req,res){
    var username = req.body.username;
    var password= req.body.password;
    var repassword = req.body.repassword;
    console.log(username+"---"+password+"--"+repassword);
    if(username == ''){
        responData.code=1;
        responData.message='账号不能为空';
        res.json(responData);
        return;
    }
    if(password == ''){
        responData.code=2;
        responData.message='密码不能为空';
        res.json(responData);
        return;
    }
    if(password != repassword){
        responData.code=3;
        responData.message='2次密码不一致';
        res.json(responData);
        return;
    }

    User.findOne({
        username:username
    }).then(function(userInfo){
        if(userInfo){
            responData.code=4;
            responData.message='用户已被注册';
            res.json(responData);
            return;
        }
        var user = new User({
            username:username,
            password:password
        });
        return user.save();
    }).then(function(newUserInfo){
        
        responData.message='注册成功,即将返回登录界面';
        res.json(responData);
    })


    
});
router.post('/user/login',function(req,res){
    var username = req.body.username;
    var password= req.body.password;
    console.log(username + '--'+password);
    if(username == '' || password == ''){
        responData.code = 1;
        responData.message = '用户名和密码不能为空';
        res.json(responData);
        return;
    }
    User.findOne({
        username:username,
        password:password
    }).then(function(userInfo){
        if(!userInfo){
            responData.code = 2;
            responData.message = '用户名或密码错误';
            res.json(responData);
            return;
        }
        responData.message = '登陆成功';
        responData.userInfo=userInfo;
        //登录成功设置cookies
        req.cookies.set('userInfo',JSON.stringify(
            {
                _id:userInfo._id,
                username:userInfo.username,
            }
        ));
        console.log(req.cookies.get('userInfo'));
        res.json(responData);
    })

})
// router.post('/user/UpateInfo',function(req,res){
//     var nicheng = req.body.nicheng;
//     var sex = req.body.sex;
//     var disc = req.body.disc;
//     var faculty = req.body.faculty;
//     var Class = req.body.Class;
//     var _id = req.body._id;
//     var danshen = req.body.danshen
//     console.log(nicheng+"--"+sex+"--"+disc+"--"+faculty+"--"+Class+"--"+_id)
//     if(req.body.username == ''){
//         responData.code = 1;
//         responData.message = '用户名为空';
//         res.json(responData);
//         return;
//     }
//     if(req.body.nicheng == ''){
//         responData.code = 2;
//         responData.message = '不能为空';
//         res.json(responData);
//         return;
//     }
    
//     User.update({
//         _id:_id
//     },{
//         nicheng : req.body.nicheng,
//         sex : req.body.sex,
//         disc : req.body.disc,
//         faculty : req.body.faculty,
//         Class : req.body.Class,
//         _id : req.body._id,
//         danshen
//     }).then(function(info){
//         responData.message = '文字上传成功';
//         responData.userInfo = info
//         res.json(responData);
//         return;
//     });
// })
// router.post('/user/UpateInfoImg',upload.single('photo'),function(req,res){
//     var id = req.userInfo._id
//     responData.message = '上传成功';
//     responData.imgpath = imgpath +user_img;
//     console.log("更新个人头像路径："+responData.imgpath);
//     imgpath=imgpath +user_img;
//     console.log();
//     User.update({
//         _id:id
//     },{
//         head_img:imgpath
//     }).then(function(info){
//         imgpath = '/public/upimgs/';
//         user_img = '';
//         Bod_imgs = []
//         if(!info){

//         }
//         return User.findOne({
//             _id:id
//         })
//     }).then(function(userInfo){
//         console.log(userInfo);
//         responData.message = '信息上传成功';
//         responData.userInfo = userInfo;
//         res.json(responData);
//         return;
//     })
// })
//获取所有的用户的信息
router.get('/user/getAllList',function(req,res){
    User.find().sort({_id:-1}).then(function(usersList){
        console.log(usersList,"11111111111111111111");
        responData.message = '请求公告数据成功！';
        responData.usersList = usersList;
        res.json(responData);
    })
})
router.get('/user/logout',function(req,res){
    req.cookies.set('userInfo',null);
    responData.message = '退出成功！';
    res.json(responData);
})
//删除user
router.get('/user/delete',function(req,res){
    var id=req.query._id || '';
    console.log(id);
    User.remove({
        _id:id
    }).then(function(){
        return User.find().sort({_id:-1});
    }).then(function(usersList){
        console.log(usersList,"11111111111111111111");
        responData.message = '删除成功，获取新的用户列表';
        responData.usersList = usersList;
        res.json(responData);
    })
    
})

//商品的添加
router.post('/cherry/add',upload.single('file'),function(req,res){
    
    var title = req.body.title;
    var desc = req.body.desc;
    var price = req.body.price;

    console.log("---------------------------------------------------");
    console.log(title+"---"+desc+"--"+price);
    responData.message = '上传成功';
    responData.imgpath = imgpath +user_img;
    console.log("更新个人头像路径："+responData.imgpath);
    imgpath=imgpath +user_img;

    new Cherry({
        title:title,
        desc:desc,
        price:price,
        c_img:imgpath,
    }).save().then(function(info){
        console.log(info)
        imgpath = '/public/upimgs/';
        user_img = '';
        Bod_imgs = []
        if(!info){
            return
        }
        responData.message = '商品添加成功！';
        res.json(responData);
    })
})
router.get('/cherrt/getAllList',function(req,res){
    Cherry.find().sort({_id:-1}).then(function(cherrtList){
        console.log(cherrtList,"11111111111111111111");
        responData.message = '请求产品列表成功';
        responData.cherrtList = cherrtList;
        res.json(responData);
    })
})
router.get('/cherry/delete',function(req,res){
    var id=req.query._id || '';
    console.log(id);
    Cherry.remove({
        _id:id
    }).then(function(){
        responData.message = '删除商品成功！';
        res.json(responData);
    })
    
})
//订单的添加
router.post('/order/add',function(req,res){
    
    var c_id = req.body.c_id;
    var u_id = req.body.u_id;
    console.log(c_id+"====="+u_id)
    new Order({
        c_id:c_id,
        u_id:u_id
    }).save().then(function(info){
        console.log(info)
        if(!info){
            return
        }
        responData.message = '购物车添加成功！';
        res.json(responData);
    })
})
router.post('/order/getAllCatList',function(req,res){
    var u_id = req.body.u_id
    console.log(u_id);
    Order.find({u_id:u_id,is_shopping : false,}).sort({_id:-1}).populate(['u_id','c_id']).then(function(orderCatList){
        console.log(orderCatList,"11111111111111111111");
        responData.message = '请求产品列表成功';
        responData.orderCatList = orderCatList;
        res.json(responData);
    })
})
router.post('/order/getAllCatShopList',function(req,res){
    var u_id = req.body.u_id
    console.log(u_id);
    Order.find({u_id:u_id,is_shopping : true,}).sort({_id:-1}).populate(['u_id','c_id']).then(function(orderCatList){
        console.log(orderCatList,"11111111111111111111");
        responData.message = '请求产品列表成功';
        responData.orderCatList = orderCatList;
        res.json(responData);
    })
})
router.get('/order/deleteCatById',function(req,res){
    var id=req.query._id || '';
    console.log(id);
    Order.remove({
        _id:id
    }).then(function(){
        responData.message = '删除购物车成功！';
        res.json(responData);
    })
    
})
router.get('/order/gobuyCatById',function(req,res){
    var id=req.query._id || '';
    console.log(id);
    Order.updateOne({
        _id:id
    },{
        is_shopping:true
    }).then(function(info){

        responData.message = '购买成功';
        res.json(responData);
    })
    
})
router.get('/order/getAllUserShopList',function(req,res){
    Order.find({is_shopping : true,}).sort({_id:-1}).populate(['u_id','c_id']).then(function(orderCatList){
        console.log(orderCatList,"11111111111111111111");
        responData.message = '请求产品列表成功';
        responData.orderCatList = orderCatList;
        res.json(responData);
    })
    
})















module.exports = router;