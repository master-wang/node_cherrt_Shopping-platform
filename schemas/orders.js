var mongoose=require('mongoose');
//公告表结构
module.exports = new mongoose.Schema({
    u_id:{//订单人
        type:mongoose.Schema.Types.ObjectId,
        ref:'Users'
    },
    c_id:{//订单产品
        type:mongoose.Schema.Types.ObjectId,
        ref:'Cherries'
    },
    is_shopping:{//是否是管理员
        type:Boolean,
        default:false
    },
    g_time:{//订单创建时间
        type:Date,
        default:new Date()
    },
});