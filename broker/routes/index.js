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
	req.db.execute("select page_id, page_title from wikispace.page;",function(err, result) {
		if (err){
			console.log(err);
		}else{
			busquedas.push(result);
			res.json(busquedas);
		}
	});
});

/*GET Search API to find elements that match exactly to :term in cassandra and redis*/
router.get("/api/search/:term", function(req, res, next){
	res.setHeader("Access-Control-Allow-Origin", "*");
	var term = req.params.term;
	var busquedas = [];
	//var j = '{filter : { type  : "match", field : "page_title", value : "Xen" }}';
	var query = identifyQuery(term);
	console.log(query);
	var cql = "SELECT * FROM wikispace.page WHERE lucene = '"+query+"';";
	console.log(cql);

	req.db.execute(cql, function(err, result) {
		if (err){
			console.log(err);
			result = {error:1, mensaje:'Error en la conexion con cassandra.'};
			res.json(result);
		}else{
			if( result.rows!= null && result.rows.length > 0){
				console.log(result);

				busquedas.push(result.rows);
				//var html = wiky.process(result.rows[0], {});
				//busquedas.push(html);
				res.json(busquedas);
				//res.send(html);
			}else{
				r = {error:-99, mensaje:'No Existe Articulo'};
				res.json(r);
			}
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

/*
SELECT * FROM page WHERE lucene = '{filter : { type  : "match", field : "page_title", value : "Xen" }}';

SELECT * FROM wikispace.page WHERE lucene = '{filter : { type   : "contains", field  : "page_title", values : ["X"] }}';

SELECT * FROM page WHERE lucene = '{filter : { type   : "contains", field  : "page_title", values : ["le"] }}';
SELECT * FROM page WHERE lucene = '{filter : { type   : 'contains', field  : 'page_title', values : ['Argentina'] }}';
SELECT * FROM page WHERE lucene = '{filter : { type  : "match", field : "page_title", value : "Xen" }}';

*/
