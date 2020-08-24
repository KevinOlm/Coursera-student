/*La siguiente es una función de jQuery que hace lo mismo que:
document.addEventListener("DOMContentLoaded", function() {});*/
$(function () {
	/*Al agregar como parámetro una cadena de texto a la función $ de jQuery, sería lo mismo que
	llamar a la función: document.querySelector("#navbarToggle")*/
	/*El .blur(function (){}) sería equivalente a .addEventListener("blur", function(){})*/
	$("#navbarToggle").blur(function (event) {
		/*window.innerWidth devuelve el tamaño de la ventana del buscador*/
		var screenWidth = window.innerWidth;
		if (screenWidth < 768) {
			$("#collapsable-nav").collapse('hide');
		}
	});
});

(function (global) {
	var dc = {};
	//variable que guarda el fragmento de código de la página principal
	var homeHtml = "snippets/home-snippet.html";
	//URL donde se obtienen los datos de los menús con el archivo JSON
	var allCategoriesUrl = "https://davids-restaurant.herokuapp.com/categories.json";
	//variable que guarda el fragmento de código del título de las categorías
	var categoriesTitleHtml = "snippets/categories-title-snippet.html";
	//variable que guarda el fragmento de código del contenido de las categorías
	var categoryHtml = "snippets/category-snippet.html";
	//URL donde se obtienen los datos de los items con el archivo JSON
	var menuItemsUrl = "https://davids-restaurant.herokuapp.com/menu_items.json?category=";
	//variable que guarda el fragmento de código del título de los items
	var menuItemsTitleHtml = "snippets/menu-items-title.html";
	//variable que guarda el fragmento de código del contenido de los items
	var menuItemHtml = "snippets/menu-item.html";

	//Inserta código HTML en un selector determinado ("selector")
	var insertHtml = function (selector, html) {
  		var targetElem = document.querySelector(selector);
  		targetElem.innerHTML = html;
	};

	//Muestra un ícono de cargando dentro del las etiquetas con el selector: 'selector'.
	var showLoading = function (selector) {
  		var html = "<div class='text-center'>";
  		html += "<img src='images/ajax-loader.gif'></div>";
  		insertHtml(selector, html);
	};

	//Reemplaza las partes del código que fueron creadas para ser modificadas dinámicamente
	//{{propiedad}}
	var insertProperty = function (string, propName, propValue) {
  		var propToReplace = "{{" + propName + "}}";
  		string = string.replace(new RegExp(propToReplace, "g"), propValue);
  		return string;
	}

	var switchMenuToActive = function () {
  		// Remove 'active' from home button
  		var classes = document.querySelector("#navHomeButton").className;
  		classes = classes.replace(new RegExp("active", "g"), "");
  		document.querySelector("#navHomeButton").className = classes;

  		// Add 'active' to menu button if not already there
  		classes = document.querySelector("#navMenuButton").className;
  		if (classes.indexOf("active") == -1) {
    		classes += " active";
    		document.querySelector("#navMenuButton").className = classes;
  		}
  		console.log("Hello")
	};

	//Hace que los eventos de esta parte carguen antes que cualquier estilo CSS
	document.addEventListener("DOMContentLoaded", function (event) {
		
		//Muestra el ícono de cargando
		showLoading("#main-content");
		//Manda una petición ajax para cargar el fragmento de código de la página principal
		$ajaxUtils.sendGetRequest(homeHtml, function (responseText) {
    		document.querySelector("#main-content").innerHTML = responseText;
  		}, false);
	});

	//Manda una petición ajax para cargar el fragmento de código de la página de categorías
	dc.loadMenuCategories = function () {
		showLoading("#main-content");
		$ajaxUtils.sendGetRequest(allCategoriesUrl, buildAndShowCategoriesHTML);
  	}

  	dc.loadMenuItems = function (categoryShort) {
  		showLoading("#main-content");
  		$ajaxUtils.sendGetRequest(menuItemsUrl + categoryShort, buildAndShowMenuItemsHTML);
	};

  	function buildAndShowCategoriesHTML (categories) {
			//Cargar el fragmento de código del título de la página de categorías
			$ajaxUtils.sendGetRequest(categoriesTitleHtml, function (categoriesTitleHtml) {
  			//Devuelve una sola categóría como fragmento de código
  			$ajaxUtils.sendGetRequest(categoryHtml, function (categoryHtml) {
      			var categoriesViewHtml =
        			buildCategoriesViewHtml(categories, categoriesTitleHtml, categoryHtml);
      			insertHtml("#main-content", categoriesViewHtml);
    		}, false);
		}, false);
	}

	//Crea un fragmento de código para todas las categorías
	function buildCategoriesViewHtml(categories, categoriesTitleHtml, categoryHtml) {
		var finalHtml = categoriesTitleHtml;
			finalHtml += "<section class='row'>";

			//Hace un bucle entre todas las categorías
			for (var i = 0; i < categories.length; i++) {
			//Reemplaza los fragmentos de código que necesitan ser reemplazados y los guarda en un
			//solo fragmento general
			var html = categoryHtml;
			var name = "" + categories[i].name;
			var short_name = categories[i].short_name;
			html = insertProperty(html, "name", name);
			html = insertProperty(html, "short_name", short_name);
			finalHtml += html;
			}
		finalHtml += "</section>";
			return finalHtml;
	}

	function buildAndShowMenuItemsHTML (categoryMenuItems) {
  		// Load title snippet of menu items page
  		$ajaxUtils.sendGetRequest(menuItemsTitleHtml, function (menuItemsTitleHtml) {
      		// Retrieve single menu item snippet
      		$ajaxUtils.sendGetRequest(menuItemHtml, function (menuItemHtml) {
          		var menuItemsViewHtml =
            		buildMenuItemsViewHtml(categoryMenuItems, menuItemsTitleHtml, menuItemHtml);
          		insertHtml("#main-content", menuItemsViewHtml);
        	}, false);
    	}, false);
	}

	// Using category and menu items data and snippets html
	// build menu items view HTML to be inserted into page
	function buildMenuItemsViewHtml(categoryMenuItems, menuItemsTitleHtml, menuItemHtml) {
  		menuItemsTitleHtml = 
  			insertProperty(menuItemsTitleHtml, "name", categoryMenuItems.category.name);
  		menuItemsTitleHtml = 
  			insertProperty(menuItemsTitleHtml,"special_instructions", 
  				categoryMenuItems.category.special_instructions);

  		var finalHtml = menuItemsTitleHtml;
  		finalHtml += "<section class='row'>";

  		// Loop over menu items
  		var menuItems = categoryMenuItems.menu_items;
  		var catShortName = categoryMenuItems.category.short_name;
  		for (var i = 0; i < menuItems.length; i++) {
    		// Insert menu item values
    		var html = menuItemHtml;
    		html = insertProperty(html, "short_name", menuItems[i].short_name);
    		html = insertProperty(html, "catShortName", catShortName);
    		html = insertItemPrice(html, "price_small", menuItems[i].price_small);
    		html = insertItemPortionName(html, "small_portion_name", menuItems[i].small_portion_name);
    		html = insertItemPrice(html, "price_large", menuItems[i].price_large);
    		html = insertItemPortionName(html, "large_portion_name", menuItems[i].large_portion_name);
    		html = insertProperty(html, "name", menuItems[i].name);
    		html = insertProperty(html, "description", menuItems[i].description);

    		// Add clearfix after every second menu item
    		if (i % 2 != 0) {
      			html +=
        		"<div class='clearfix visible-lg-block visible-md-block'></div>";
    		}
    		finalHtml += html;
  		}
  		finalHtml += "</section>";
  		return finalHtml;
	}

	// Appends price with '$' if price exists
	function insertItemPrice(html, pricePropName, priceValue) {
  		// If not specified, replace with empty string
  		if (!priceValue) {
    		return insertProperty(html, pricePropName, "");
  		}
  		priceValue = "$" + priceValue.toFixed(2);
  		html = insertProperty(html, pricePropName, priceValue);
  		return html;
	}


	// Appends portion name in parens if it exists
	function insertItemPortionName(html, portionPropName, portionValue) {
  		// If not specified, return original string
  		if (!portionValue) {
    		return insertProperty(html, portionPropName, "");
  		}
  		portionValue = "(" + portionValue + ")";
  		html = insertProperty(html, portionPropName, portionValue);
  		return html;
	}

	global.$dc = dc;
	
})(window);