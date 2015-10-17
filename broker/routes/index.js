var express = require('express');
var request = require('request');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


/*GET Search API to find all elements*/
router.get("/api/search/", function(req, res, next){
	var busquedas = [];
	req.db.execute("select page_id, page_title from wikispace.page;",function(err, result) {
		if (err){
			console.log(err);
		}
		busquedas.push(result);
		res.json(busquedas);

	});
});

/*GET Search API to find elements that match exactly to :term in cassandra and redis*/
router.get("/api/search/match/:term", function(req, res, next){
	var term = req.params.term;
	console.log("buscar: "+term);
	var busquedas = [];
	var cql = " select page_id , page_title, page_text, page_latest from wikispace.page where page_title ='"+term+"';";

	req.db.execute(cql,function(err, result) {
		if (err){
			console.log(err);
		}
		//console.log(result.rows);
		busquedas.push(result.rows[0]);
		res.json(busquedas);

	});

});

/*GET Search API to find elements that contain :term in cassandra and redis*/
router.get("/api/search/contains/:term", function(req, res, next){

});

module.exports = router;
