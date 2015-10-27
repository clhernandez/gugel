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
	var u = "http://localhost:3001/api/search/"+q;
	console.log(u);
	request.get({url: u, timeout:timeoutGlobal}, function(err,response,body){
		console.log("Search wikipedia articles...")
		console.log(err);
		console.log(response.statusCode);

		if (!err && response.statusCode == 200) {
			data.resultados = JSON.parse(body);
			/*for (var i = 0; i < data.ordenes.length; i++) {
				data.cantidadClientes+=1;
				data.cantidadOrdenesProducto+=1;
				for (var j = 0; j < data.ordenes[i].productos.length; j++) {
					data.cantidadProductos+=1;
				};
			};*/


			res.json(data);
	  	}

	}).on('error', function(){
		//error
		console.log("ERROR");
		data.codigo = -1;
		data.mensaje = "An error happened :(";
		res.render('error', data);
	});

});

module.exports = router;
