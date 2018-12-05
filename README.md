# NODE

### 注册一个路由
1. path 为 ： /register
2. 请求方式 ： post
3. 接收 username 和 password 参数
4. admin 是已注册用户
5. 注册成功 返回 ：{code:1,data:{id:'abc',username:'xxx',password:'123'}
6. 注册失败 返回 ：{code:0,msg:'此用户已存在'}}
```js
/*
1. 获取请求参数
2. 处理
3. 返回响应数据
*/
router.post('/register',function(req,res){
    // 1. 获取请求参数
    const {username, password} = req.body
    // 2. 处理
    if(username === 'admin'){
        // 注册失败
        // 返回响应数据
        res.send({code:1,data:{id:'abc',username:'xxx',password:'123'}})
    }else{
        // 注册成功
        // 返回响应数据
         res.send({code:0,data:{})
    }
})
```

### 后台应用自动重运行
* nodemon
    > npm i -D nodemon
* 配置
    > "start":"nodemon./bin/www"

### mongoose 操作数据库
* 下载依赖包
    > npm i -S mongoose
    > npm i -S blueimp-md5
* 测试数据库
1. 连接数据库
    1. 引入 mongoose
    2. 链接指定数据库 （URL只有数据库是变化的）
    3. 获取链接对象
    4. 绑定连接完成的监听（用来提示链接成功）
2. 得到对应特定集合的 Model
    1. 定义 Schema （描述文档结构）
    2. 定义 Model （与集合对应，可以操作集合）
3. 通过 Model 或其实例对集合数据进行 CRUD (增删改查)操作
    1. 通过 Model 实例的 save() 添加数据
    2. 通过 Model 的 find() / findOne() 查询对个或一个数据
    3. 通过 Model 的 findByIdAndUpdate() 更新莫个数据
    4. 通过 Model 的 remove() 删除匹配的数据
```js

// 1. 连接数据库
    // 1. 引入 mongoose
    const mongoose = require('mongoose')
    // 2. 链接指定数据库 （URL只有数据库是变化的）
        // 终端启动数据库
        // 1. cd /usr/local/mongodb/bin
        // 2. sudo ./mongod
    mongoose.connect('mongodb://127.0.0.1:27017/my-react-app-test')
    // 3. 获取链接对象
    const conn = mongoose.connection
    // 4. 绑定连接完成的监听（用来提示链接成功）
    conn.on('connected',function(){
        // 链接成功后调用
        console.log('数据库链接成功')
    })

//2. 得到对应特定集合的 Model
  // 1. 定义 Schema （描述文档结构）
  const userSchema = mongoose.Schema({
    // 指定文档的结构：属性名 / 属性值的类型，是否是必须的，默认值
    username: {type: String, required: true},
    password: {type: String, required: true},
    type: {type: String, required: true}
  })
  // 2. 定义 Model （与集合对应，可以操作集合）
  const UserModel = mongoose.model('user',userSchema) // 集合名称等为：user
// 3. 通过 Model 或其实例对集合数据进行 CRUD (增删改查)操作
  // 1. 通过 Model 实例的 save() 添加数据
  function testSave(){
    // 创建 userModel 的实例
    const userModel = new UserModel({username: "Tom",password: '123',type: 'ni'})
    // 调用 save()
    userModel.save(function(error,user){
        console.log('save',error,user)
    })
  }
  // 2. 通过 Model 的 find() / findOne() 查询对个或一个数据
  function testFind(){
    // 查多个
        // 得到的是包含所有匹配文档对象的数组，如果没有匹配的就是[]
    UserModel.find({_id:1},function(error,users){
        console.log('find',error,users)
    })
    // 查一个
        // 得到是匹配的文档对象，如果没有对象匹配就是 null
    UserModel.findOne({_id:'5c069c9c3f161d31e678394c'},function(error,user){
        console.log('findOne',error,user)
    })
  }
  testFind()
  // 3. 通过 Model 的 findByIdAndUpdate() 更新莫个数据
  function testUpdate(){
    UserModel.findByIdAndUpdate({_id:'5c069c9c3f161d31e678394c'},{username:'改'},function(error,oldUser){
        console.log('findByIdAndUpdate',error,oldUser)
    })
  }
  testUpdate()
  // 4. 通过 Model 的 remove() 删除匹配的数据
  function testRemove(){
    UserModel.remove({_id:'5c069c9c3f161d31e678394c'},function(error,doc){
        console.log(error,doc) // doc => n 删除数量； ok 是 1成功
    })
    testRemove()
  }

```

### 注册/登录后台
* db/Models
    ```js
     // 1. 链接数据库
     // 1.1 引入mongoose
         const mongoose = require('mongoose')
     // 1.2 链接数据库
        mongoose.connect('mongodb://127.0.0.1:27017/my-react-app-test')
     // 1.3 获取链接对象
        const conn = mongoose.connection
     //  1.4 绑定链接完成的监听
        conn.on('connected',()=>{console.log('success')})

     // 2. 定义出对应特定集合的Model并向外暴露
     // 2.1 字义Schema（描述文档结构）
        const userSchema=mongoose.Schema({
            username:{type:String,require: true},
            password:{type:String,require: true},
            type:{type:String,require: true},
            header:{type:String}, // 头像
            post:{type:String}, // 职位
            info:{type:String}, // 工人或公司简介
            company:{type:String}, // 公司名称
            salary:{type:String}, // 工资
        })
     // 2.2 定义 Model
        const UserModel = mongoose.model('user',userSchema)
     // 2.3 向外暴露 Model
        exports.UserModel = UserModel
    ```
* routes/index

```js
var express = require('express');
var router = express.Router();

const {UserModel} = require('../db/models')
/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

/*
1. 获取请求参数
2. 处理
3. 返回响应数据
*/
router.post('/register', function (req, res) {
    // 1. 获取请求参数
    const {username, password, type} = req.body
    // 2. 处理
    // 2.1 判断用户是否存在，如果存在返回错误信息
    // 2.21 查询 (根据 username)
    UserModel.findOne({username}, (err, user) => {

        if (user) {
            // 如果 user 存在
            // 返回错误信息
            res.send({code: 1, msg: '此用户已存在'})
        } else {
            // 保存
            new UserModel({username, password, type}).save((err, user) => {
                // 生成cookies
                res.cookie('userid', user._id, {maxAge: 1000 * 60 * 60 * 24 * 7})
                res.send({code: 0, data: {id: 'abc', username}})
            })
        }

    })
})

// 登录路由
router.post('/login', function (req, res) {
    const {username, password} = req.body
    // 根据 username 和 password 查询数据库 users
    UserModel.findOne({username, password}, {password: 0,__v:0}, function (err, user) {
        if (user) {
            // 生成cookies
            res.cookie('userid', user._id, {maxAge: 1000 * 60 * 60 * 24 * 7})
            res.send({code: 0, data: user})
        } else {
            res.send({code: 1, data: '用户或密码不正确'})
        }
    })
})
module.exports = router
```
