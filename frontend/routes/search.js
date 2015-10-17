var express = require('express');
var request = require('request');
var router = express.Router();

var server = {url: 'http://localhost'};

/* GET root search. */
router.get('/', function(req, res, next) {
	res.send(500);
});

/* GET search results */
router.get('/:query', function(req, res, next) {
	var q = req.params.query;
	result = {codStatus:0, mensaje:'query executed.', query: q};
	res.json(result);
});

module.exports = router;
