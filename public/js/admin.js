$(function(){
    var vm=new Vue({
        delimiters: ['${', '}'],
        el:'#app',
        data:{
            userInfo:{},
            main_stadus:"1",
            usersList:[],
            cherrtList:[],
            orderCatList:[],
            addCherryInfo:{
                title:"",
                desc:"",
                price:""
            },
            cherryAddStadus:"no"
        },
        methods: {

            //网页刷新 先获取本地存储的数据
            getuserInfo_bylocal(){
                this.userInfo=JSON.parse(localStorage.getItem('userInfo'));
                if(this.userInfo){
                   
                }else{
                    alert("你好！，你不是管理员！")
                    window.location.href="/"
                }
            },
            //获取用户的所有信息
            getUsersList(){
                this.main_stadus=2;
                var that = this;
                axios.get('/api/user/getAllList')
                    .then(data=>{
                        console.log(data);
                        that.usersList=data.data.usersList
                    })
                    .catch(err=>console.log(err));
                
            },
            deleteUserById(_id){
                var that = this;
                if(confirm("确定要删除吗？")){
                axios.get('/api/user/delete?_id='+_id)
                    .then(data=>{
                        console.log(data);
                        that.usersList=data.data.usersList
                    })
                    .catch(err=>console.log(err));
                }
            },
            cherryAdd(){
                var that=this;
                let x = document.getElementById('cherryImg').files[0];
                if(this.addCherryInfo.title==''||this.addCherryInfo.desc==''||this.addCherryInfo.price==''){
                    alert("不能为空！");
                }else{
                    if(!x){
                        alert("照片未选择！")
                    }else{
                        if($('#cherryImg')[0].files.length>1){
                            alert("图片最多可以上传1张！");
                        }else{
                            var formData = new FormData();
                            for(var index = 0; index < $('#cherryImg')[0].files.length; index++){
                                formData.append('file', $('#cherryImg')[0].files[index]);
                            }
                            formData.append('title', that.addCherryInfo.title);
                            formData.append('desc', that.addCherryInfo.desc);
                            formData.append('price', that.addCherryInfo.price);
                            console.log(formData);
                            $.ajax({
                                type:'post',
                                url:'/api/cherry/add',
                                data:formData,
                                dataType: 'JSON',  
                                cache: false,  
                                processData: false, 
                                contentType: false,
                                success:function(result){
                                    that.cherryAddStadus="ok"
                                    console.log(result);
                                    that.getCherryList();
                                }
                            });
                        }
                    }
                }
            },
            getCherryList(){
                var that=this;
                this.main_stadus=3;
                var that = this;
                axios.get('/api/cherrt/getAllList')
                    .then(data=>{
                        console.log(data);
                        that.cherrtList=data.data.cherrtList
                    })
                    .catch(err=>console.log(err));
            },
            deleteCherryById(_id){
                var that = this;
                axios.get('/api/cherry/delete?_id='+_id)
                    .then(data=>{
                        console.log(data);
                        that.getCherryList();
                    })
                    .catch(err=>console.log(err));
            },
            getOrderShopList(){
                var that = this
                this.main_stadus=4;
                axios.get('/api/order/getAllUserShopList')
                    .then(data=>{
                        console.log(data);
                        that.orderCatList=data.data.orderCatList
                    })
                    .catch(err=>console.log(err));
            },
            deleteCatById(id){
                var that = this;
                if(confirm("确定要删除吗？"))
                {
                axios.get('/api/order/deleteCatById?_id='+id)
                    .then(data=>{
                        console.log(data);
                        that.getOrderShopList();
                    })
                    .catch(err=>console.log(err));
                }
            },
        },
        created(){
            this.getuserInfo_bylocal()
        }
    });
});