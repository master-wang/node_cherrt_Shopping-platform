$(function(){
    var vm=new Vue({
        delimiters: ['${', '}'],
        el:'#app',
        data:{
            lo_re_cp:"login",
            register_userInfo:{
                username:"",
                password:"",
                repassword:""
            },
            login_userInfo:{
                username:"",
                password:"",
            },
            register_tip:"",
            login_stadus:"",
            userInfo:{},
            cherrtList:[],
            orderCatList:[]
        },
        methods: {
            //注册
            User_resister(){
                var that=this;
                $.ajax({
                    type:'post',
                    url:'/api/user/register',
                    data:that.register_userInfo,
                    dataType:'json',
                    success:function(result){
                        console.log(result)
                        $("#retip").html(result.message);
                        if(!result.code){
                            setTimeout(function(){
                                that.lo_re_cp='login';
                            },1000);
                        }
                    }
                });
            },
            //登录
            User_login(){
                var that=this;
                $.ajax({
                    type:'post',
                    url:'/api/user/login',
                    data:that.login_userInfo,
                    dataType:'json',
                    success:function(result){
                        console.log(result);
                        $("#lotip").html(result.message);
                        that.userInfo=result.userInfo;
                        that.login_stadus='ok';
                        localStorage.setItem('userInfo',JSON.stringify(result.userInfo));
                        if(!result.code){
                            setTimeout(function(){
                                that.lo_re_cp='ok';
                                // window.location.reload();
                            },1000);
                        }
                    }
                });
            },
            //退出登录
            login_out(){
                var that=this;
                $.ajax({
                    type:'get',
                    url:'/api/user/logout',
                    success:function(result){
                        console.log(result);
                        that.loginOut_tip=result.message;
                        that.userInfo=null;
                        localStorage.setItem('userInfo',null);
                        if(!result.code){
                            alert("退出登录成功！");
                            setTimeout(function(){
                                that.login_stadus='login';
                            },1000);
                        }
                    }
                });
            },
            getCherryList(){
                var that = this;
                axios.get('/api/cherrt/getAllList')
                    .then(data=>{
                        console.log(data);
                        that.cherrtList=data.data.cherrtList
                    })
                    .catch(err=>console.log(err));
            },
            //网页刷新 先获取本地存储的数据
            getuserInfo_bylocal(){
                this.userInfo=JSON.parse(localStorage.getItem('userInfo'));
                if(this.userInfo){
                    this.login_stadus='ok';
                }else{
                    this.login_stadus='login';
                }
            },
            addToShopCat(_id){
                if(!this.userInfo){
                    alert("你还没登录，请先登录！")
                    return
                }
                var that = this;
                var data = {
                    c_id:_id,
                    u_id:that.userInfo._id
                }
                console.log(data)
                $.ajax({
                    type:'post',
                    url:'/api/order/add',
                    data:data,
                    dataType:'json',
                    success:function(response){
                        console.log(response);
                        alert("加入购物车成功！")
                    }
                });
            },
            getOrderCatList(){
                var that=this;
                // axios.post('/api/order/getCaiList',{u_id:that.userInfo._id})
                //   .then(function (response) {
                //         console.log(response);
                //         that.orderCatList=response.data.orderCatList
                //   })
                //   .catch(function (error) {
                //     console.log(error);
                //   });
                console.log("进入我的购物车")
                $.ajax({
                    type:'post',
                    url:'/api/order/getAllCatList',
                    data:{u_id:that.userInfo._id},
                    dataType:'json',
                    success:function(response){
                        console.log(response);
                        that.orderCatList=response.orderCatList
                    }
                });
            },
            getOrderCatShopList(){
                var that=this;
                console.log("进入我的购物车")
                $.ajax({
                    type:'post',
                    url:'/api/order/getAllCatShopList',
                    data:{u_id:that.userInfo._id},
                    dataType:'json',
                    success:function(response){
                        console.log(response);
                        that.orderCatList=response.orderCatList
                    }
                });
            },
            deleteCatById(id){
                var that = this;
                axios.get('/api/order/deleteCatById?_id='+id)
                    .then(data=>{
                        console.log(data);
                        that.getOrderCatList();
                    })
                    .catch(err=>console.log(err));
            },
            gobuy(id,title,price){
                var that = this
                if(confirm("确定要购买"+price+"元的"+title+"吗？"))
                {
                    axios.get('/api/order/gobuyCatById?_id='+id)
                        .then(data=>{
                            console.log(data);
                            alert("已购买成功！")
                            that.getOrderCatList();
                        })
                        .catch(err=>console.log(err));
                }
            }
        },
        created(){
            this.getuserInfo_bylocal()
            this.getCherryList()
        }
    });
});