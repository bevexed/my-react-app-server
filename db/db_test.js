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
conn.on('connected', function () {
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
const UserModel = mongoose.model('user', userSchema) // 集合名称等为：user
// 3. 通过 Model 或其实例对集合数据进行 CRUD (增删改查)操作
// 1. 通过 Model 实例的 save() 添加数据
function testSave() {
    // 创建 userModel 的实例
    const userModel = new UserModel({username: "Tom", password: '123', type: 'ni'})
    // 调用 save()
    userModel.save(function (error, user) {
        console.log('save', error, user)
    })
}

testSave()

// 2. 通过 Model 的 find() / findOne() 查询对个或一个数据
function testFind() {
    // 查一个
    UserModel.find(function (error, users) {
        console.log('find', error, users)
    })
    // 查多个
    UserModel.findOne({_id: '5c069c9c3f161d31e678394c'}, function (error, user) {
        console.log('findOne', error, user)
    })
}

testFind()

// 3. 通过 Model 的 findByIdAndUpdate() 更新莫个数据
function testUpdate() {
    UserModel.findByIdAndUpdate({_id: '5c069c9c3f161d31e678394c'}, {username: '改'}, function (error, oldUser) {
        console.log('findByIdAndUpdate', error, oldUser)
    })
}

testUpdate()

// 4. 通过 Model 的 remove() 删除匹配的数据
function testRemove() {
    UserModel.remove({_id: '5c069c9c3f161d31e678394c'}, function (error, doc) {
        console.log('remove', error, doc)
    })
}

testRemove()
