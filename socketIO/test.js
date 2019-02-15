module.exports = function (server) {
	const io = require('socket.io')(server);
	io.on('connection',function (socket) {
		console.log('链接成功');
		socket.on('sendMsg',function (data) {
			console.log('服务器接受到浏览器消息',data.name+'_'+data);
			io.emit('receiveMsg',data)
			console.log('服务器向浏览器发消息');
		})
	})
}
