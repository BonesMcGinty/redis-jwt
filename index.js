var RedisJWT = require('./dist/index');

var r = new RedisJWT({
	//host: '/tmp/redis.sock', //unix domain
	host: '127.0.0.1', //can be IP or hostname
	port: 6379, // port
	maxretries: 10, //reconnect retries, default 10
	//auth: '123', //optional password, if needed
	db: 0, //optional db selection
	secret: 'secret_key', // secret key for Tokens!
	multiple: false, // single or multiple sessions by user
	KEA: true // Enable notify-keyspace-events KEA
});

var express = require('express');

var app = express();

app.get('/', function (req, res) {

	// Create
	r.sign('507f191e810c19729de860ea', { ttl: '1m', data: { hello: 'world' }, request: req }).then(sign => {

		// Verify
		r.verify(sign, true).then(verify => {

			// Exec
			var rexec = r.exec();

			rexec.rawCall(['keys', `507f191e810c19729de860ea:*`], (err, exec) => {

				// Call
				var rcall = r.call();

				rcall.getValuesByPattern('507f191e810c19729de860ea').then(call => {

					console.log({ sign, verify, exec, call });
					res.json({ sign, verify, exec, call });
				})

			});

		}).catch(err => {
			console.log('error verify-> ', err);
		})
	});

});

app.listen(3000, function () {
	console.log('Server listening on port 3000!');
});