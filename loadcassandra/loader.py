from cassandra.cluster import Cluster
import MySQLdb as mdb
import sys

abc = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","Y","Z","X"];
abc = list(reversed(abc))

con = mdb.connect('IP_MYSLQ', 'usrbd', '´passwd', 'dbname')

cluster = Cluster(['IP1_CASSANDRA', 'IP2_CASSANDRA'])

session = cluster.connect()
session.set_keyspace('wikispace')

for i in abc:
	with con:
		cur = con.cursor()
		termino = i
		print "Obteniendo resultados: {0}".format(termino)
		cur.execute('SELECT p.page_id, p.page_title, p.page_latest, t.old_id, t.old_text FROM page p INNER JOIN text t ON p.page_latest = t.old_id WHERE p.page_title like "' + termino + '%";')
		print "Se obtuvieron: {0} resultados".format(cur.rowcount)
		print "Cargando registros a cassandra..."
		cantidadRegistros = cur.rowcount
		for i in range(cur.rowcount):
			row = cur.fetchone()
			#cql = 'INSERT INTO wikispace.page (page_id,  page_title, page_latest, page_text)VALUES ({0}, "{1}", {2}, "{3}");'.format(row[0], row[1], row[2], row[4])
			#print cql
			query = "INSERT INTO wikispace.page (page_id, page_title, page_latest, page_text) VALUES (?,?,?,?)"
			try:
				prepared = session.prepare(query)
				bound_stmt = prepared.bind((row[0], row[1], row[2], row[4]))
				session.execute(bound_stmt)
			except Exception, e:
				cantidadRegistros=cantidadRegistros-1
			
		print "{0} registros cargados de {1} exitosamente".format(cantidadRegistros, cur.rowcount)


#rows = session.execute("select count(*) from wikispace.page;")
#print rows

#for user_row in rows:
#    print user_row.name, user_row.age, user_row.email

