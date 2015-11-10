var cassandra = require('cassandra-driver');
var mysql      = require('mysql');

var client = new cassandra.Client({ contactPoints: ['192.168.1.200', '192.168.1.11', '192.168.33.12']});

var db_config = {
  host     : 'localhost',
  user     : 'root',
  database : 'wiki'
};
var con = mysql.createPool(db_config);

var abc = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
for (var i = 0; i < abc.length; i++) {
	exeLetter(abc[i]);
};

function exeLetter(termino){

	var sql = 'SELECT p.page_id, p.page_title, p.page_latest, t.old_id, t.old_text FROM page p INNER JOIN text t ON p.page_latest = t.old_id WHERE p.page_title like "' + termino + '%";';
	con.getConnection(function(err, con) {

		//Ejecutar consulta sql
		var query = con.query(sql);
		console.log("Procesando: "+termino);
		query
		.on('error', function(err) {
		// Handle error, an 'end' event will be emitted after this as well
			console.log(err);
		})
		.on('result', function(row) {
		// Pausing the connnection is useful if your processing involves I/O
		con.pause();

		processRow(row, function() {
			con.resume();
		});

		})
		.on('end', function() {
		// all rows have been received
		console.log("end");
		});

	});
}

function processRow(row, f){
	exeCql(row.page_id, row.page_title, row.page_latest, row.old_text.toString('utf-8'), f);
	
}
function exeCql(id, title, latest, text, f){
	console.log("id: ",id, "title: ", title, "latest: ", latest);
	client.execute("INSERT INTO wikispace.page (page_id,  page_title, page_latest, page_text)VALUES (?, ?, ?, ?);",[id,title,latest,text],{prepare:true}, function(err, result) {
		if (err){
			console.log(err);
		}else{
			f();	
		}
	});
}

/*
//old_id = page_id
//old_text


//Z: 1.3 min
//X: 7257 rows in set (51.02 sec)
//Y: 13689 rows in set (1 min 40.39 sec)

SELECT p.page_id, p.page_title, p.page_latest, t.old_id, t.old_flags
FROM page p
INNER JOIN text t
ON p.page_latest = t.old_id
WHERE p.page_title like "X%";'

//select   from page p, text t where p.page_id = 51676 and p.page_latest = t.old_id;

//select * from page where page_title like "Chile" order by page_latest desc;

//select * from revision where rev_id = 84831203;
//select * from text where old_id = 84831203;
*/