var express = require('express');
var request = require('request');
var router = express.Router();
var timeoutGlobal = 10000;

var server = {url: 'http://localhost'};

/* GET root search. */
router.get('/', function(req, res, next) {
	res.send(500);
});

/* GET search results */
router.get('/:query', function(req, res, next) {
	var data = {};
	var q = req.params.query;
	var u = "http://192.168.32.10:3001/api/search/"+q;
	console.log(u);
	request.get({url: u, timeout:timeoutGlobal}, function(err,response,body){
		console.log("Search wikipedia articles...")

		if (!err && response.statusCode == 200) {
			data.resultados = JSON.parse(body);

			res.json(data);
	  	}

	}).on('error', function(){
		//error
		console.log("ERROR");
		data.resultados = {codigo:-1, mensaje: "An error happened :(" };
		res.json(data);
	});

});

module.exports = router;
