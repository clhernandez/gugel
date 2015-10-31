var alert = document.getElementById("alert");
var table = document.getElementById("resultTable");

function get(url, data){

	var request = new XMLHttpRequest();
	console.log(url);
	request.open('GET', url, true);

	request.onload = function() {
	  if (request.status >= 200 && request.status < 400) {
	    // Success!
	    var resp = request.responseText;
	    var j = JSON.parse(resp);

	    if(j.resultados.codigo!=null){
	    	console.log("Desplegar mensaje");
	    	
	    	alert.innerHTML = j.resultados.mensaje;
	    	alert.style="display:block";
	    }else{
			console.log("HAY RESULTADOS");
			
			for (var i = 0; i < j.resultados[0].length; i++) {
				var tuple = document.createElement("tr");
				tuple.className="tupla"
				tuple.innerHTML = "<td>"+j.resultados[0][i].page_id+"</td><td>"+j.resultados[0][i].page_title+"</td><td>"+j.resultados[0][i].page_text+"</td>";
				table.appendChild(tuple);
			};

			table.style = "display:block";
	    }
	  } else {
	    alert.innerHTML = "Error, try again later.";
		alert.style="display:block";
	  }
	};

	request.onerror = function() {
		alert.innerHTML = "Error, try again later.";
		alert.style="display:block";
	};
	
	request.send();
}

function goFind(){
	alert.style="display:none";
	table.style = "display:none";
	removeElements();

	var term = document.getElementById("busqueda");
	console.log("Search: " + term.value);
	get("/search/"+term.value, "");
}
function removeElements(){
	var tuplas = document.getElementsByClassName("tupla");
	for (var i = 0; i < tuplas.length; i++) {
		tuplas[i].remove();
	};

}

var btnBusqueda = document.getElementById("btnBuscar");
btnBusqueda.addEventListener("click", goFind, false);
