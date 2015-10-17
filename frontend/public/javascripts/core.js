function get(url, data){
	console.log("function get");

	var request = new XMLHttpRequest();
	request.open('GET', url, true);

	request.onload = function() {
	  if (request.status >= 200 && request.status < 400) {
	    // Success!
	    var resp = request.responseText;
	    console.log(resp);
	  } else {
	  	console.log("error en la consulta");
	    // We reached our target server, but it returned an error
	  }
	};

	request.onerror = function() {
	  // There was a connection error of some sort
	  console.log("conection error");
	};
	
	request.send();
}

function goFind(){
	var term = document.getElementById("busqueda");
	console.log("find");
	console.log(term.value);
	get("/search/"+term.value, "");
}

var btnBusqueda = document.getElementById("btnBuscar");
btnBusqueda.addEventListener("click", goFind, false);
