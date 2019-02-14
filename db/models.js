// 1. 链接数据库
// 1.1 引入mongoose
const mongoose = require('mongoose');
// 1.2 链接数据库
mongoose.connect('mongodb://127.0.0.1:27017/my-react-app-test');
// 1.3 获取链接对象
const conn = mongoose.connection;
//  1.4 绑定链接完成的监听
conn.on('connected', () => {
	console.log('success')
});

// 2. 定义出对应特定集合的Model并向外暴露
// 2.1 字义Schema（描述文档结构）
const userSchema = mongoose.Schema({
	username: {type: String, require: true},
	password: {type: String, require: true},
	type: {type: String, require: true},
	header: {type: String}, // 头像
	post: {type: String}, // 职位
	info: {type: String}, // 工人或公司简介
	company: {type: String}, // 公司名称
	salary: {type: String}, // 工资
});
// 2.2 定义 Model
const UserModel = mongoose.model('user', userSchema);
// 2.3 向外暴露 Model
exports.UserModel = UserModel;
