(function (global) {
	//Namespace
	var ajaxUtils = {};

	//Retorna una petición Ajax al servidor
	function getRequestObject() {
		//Verifica que haya soporte de Ajax y devuelve la petición o nulo dependiendo
		//de si existe o no
		if (global.XMLHttpRequest) {
			return (new XMLHttpRequest());
		} 
		//Petición opcional para buscadores antiguos
		else if (global.ActiveXObject) {
			return (new ActiveXObject("Microsoft.XMLHTTP"));
		}
		//En caso de que no exista un soporte Ajax
		else {
			global.alert("Ajax is not supported!");
			return(null);
		}
	}


	//Hace una petición a la URL designada (requestURL)
	ajaxUtils.sendGetRequest = function(requestUrl, responseHandler, isJSONResponse) {
		var request = getRequestObject();
		request.onreadystatechange = function() { 
		    handleResponse(request, responseHandler, isJSONResponse); 
		};
		request.open("GET", requestUrl, true);
		request.send(null); // for POST only
	};

	// Solo llama la respuesta del usuario en caso de que la respuesta esté lista y no haya errores
	function handleResponse(request, responseHandler, isJSONResponse) {
	  	if ((request.readyState == 4) && (request.status == 200)) {
	  		if (isJSONResponse == undefined) {
	  			isJSONResponse = true;
	  		}
	  		if (isJSONResponse) {
	  			responseHandler(JSON.parse(request.responseText));
	  		}
	  		else {
	  			responseHandler(request.response);
	  		}
	  	}
	}

	//Exporta la utilidad al objeto global
	global.$ajaxUtils = ajaxUtils;

})(window);