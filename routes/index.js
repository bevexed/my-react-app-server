const express = require('express');
const router = express.Router();

const {UserModel, ChatModel} = require('../db/models');
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

// 获取当前用户聊天列表
router.get('/msglist', function (req, res) {
	const userid = req.cookies.userid

	UserModel.find(function (err, userDocs) {
		if (err) {
			return res.json({code: 1, msg: '服务器错误'})
		}
		// const users = {};
		// userDocs.forEach(doc => {
		// 	users[doc._id] = {username: doc.username, header: doc.header}
		// })

		const users = userDocs.reduce((users, user) => {
			users[user._id] = {username: user.username, header: user.header};
			return users
		}, {})
		ChatModel.find({'$or': [{from: userid}, {to: userid}]}, function (err, chatMsgs) {
			res.json({
				code: 0,
				data: {users, chatMsgs}
			})
		})
	})
});

// 指定消息已读
router.post('/readmsg',function (req,res) {
	const from = req.body.from;
	const to = req.cookies.userid;

	ChatModel.update({from,to,read:false},{read:true},{multi:true},function (err,doc) {
		res.json({
			code:0,
			data:doc.nModified
		})
	})

})

module.exports = router;
