var express = require('express');
var request = require('request');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	res.setHeader("Access-Control-Allow-Origin", "*");
  	res.render('index', { title: 'Express' });
});


/*GET Search API to find all elements*/
router.get("/api/search/", function(req, res, next){
	res.setHeader("Access-Control-Allow-Origin", "*");
	var busquedas = [];
	r = {codigo:-98, mensaje:'Acote su busqueda.'};
	res.json(r);
});

/*GET Search API to find elements that match exactly to :term in cassandra and redis*/
router.get("/api/search/:term", function(req, res, next){
	res.setHeader("Access-Control-Allow-Origin", "*");
	var term = req.params.term;
	var busquedas = [];

	var query = identifyQuery(term);
	
	req.cache.get(term, function(err,rs){

		if(err == null && rs!=null){
			console.log("FROM CACHE");
			res.json(JSON.parse(rs));
		}else{

			console.log("FROM CASSANDRA");

			var cql = "SELECT * FROM wikispace.page WHERE lucene = '"+query+"';";
			console.log(cql);

			req.db.execute(cql, function(err, result) {
				if (err){
					console.log(err);
					result = {error:1, mensaje:'Error en la conexion con cassandra.'};
					res.json(result);
				}else{
					if( result.rows!= null && result.rows.length > 0){

						busquedas.push(result.rows);

						req.cache.set(term, JSON.stringify(busquedas));

						res.json(busquedas);
					}else{
						r = {codigo:-99, mensaje:'No Existe Articulo'};
						res.json(r);
					}
				}

			});

		}
	});

});

function identifyQuery(term){
	//if term starts and end with ", then search for 'march', otherwise search for 'contains'
	var regex = new RegExp("\"(.*)\"");
	if(regex.exec(''+term+'')!=null){
		console.log("query match: "+term);
		return '{filter : { type  : "match", field : "page_title", value : '+term+' }}';
	}else{
		console.log("query contains: "+term);
		return '{filter : { type  : "contains", field : "page_title", values : ["'+term+'"] }}';
	}
}

module.exports = router;
