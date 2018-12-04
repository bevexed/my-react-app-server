var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

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
        res.send({code:0,data:{id:'abc',username,password}})
    }
})

module.exports = router;
