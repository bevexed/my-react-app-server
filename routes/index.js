const express = require('express');
const router = express.Router();

const {UserModel} = require('../db/models');
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
	const {username, password, type} = req.body;
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
				res.cookie('userid', user._id, {maxAge: 1000 * 60 * 60 * 24 * 7});
				res.send({code: 0, data: {id: 'abc', username, type}})
			})
		}

	})
});

// 登录路由
router.post('/login', function (req, res) {
	const {username, password} = req.body;
	// 根据 username 和 password 查询数据库 users
	UserModel.findOne({username, password}, {password: 0, __v: 0}, function (err, user) {
		if (user) {
			// 生成cookies
			res.cookie('userid', user._id, {maxAge: 1000 * 60 * 60 * 24 * 7});
			res.send({code: 0, data: user})
		} else {
			res.send({code: 1, data: '用户或密码不正确'})
		}
	})
});

// 收集用户信息
router.post('/update', function (req, res) {
	const userid = req.cookies.userid;

	if (!userid) {
		return res.status(200).json({code: 1, msg: '请先登录'})
	}

	const user = req.body;
	UserModel.findByIdAndUpdate({_id: userid}, user, function (error, oldUser) {
		if (!oldUser) {
			res.clearCookie('userid');
			return res.status(200).json({code: 1, msg: '请重新登录'})
		}
		const {_id, username, type} = oldUser;
		const data = Object.assign(user, {_id, username, type});
		return res.status(200).json({code: 0, data})
	})
});

// 根据 cookie 获取 user数据
router.get('/user', function (req, res) {
	const userid = req.cookies.userid
	if (!userid) {
		return res.json({code: 1, msg: '请先登录'})
	}

	UserModel.findById({_id: userid}, function (error, user) {
		if (!user) {
			return res.json({code: 1, msg: '暂无该用户'})
		}
		res.json({code: 0, data: user})
	})
})

// 获取用户列表
router.get('/userlist', function (req, res) {
	const {type} = req.query;
	UserModel.find({type}, function (error, users) {
		if (error) {
			res.json({code: 1, msg: error})
		}
		res.json({code: 0, data: users})
	})
})
module.exports = router;
