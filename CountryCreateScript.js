var country_create_content_preset = "Country:"+
"<select id=\"country_create_presets_countries\" onchange=\"country_create_presets_contentify()\">"+
"<option value=\"USA\">United States</option><!--Washington,FDR,Lincoln-->"+
"<option value=\"UKN\">United Kingdom</option><!---->"+
"<option value=\"FRA\">France</option><!---->"+
"<option value=\"GER\">Germany</option><!---->"+
"<option value=\"ITA\">Italy</option><!---->"+
"<option value=\"RUS\">Russia</option><!---->"+
"<option value=\"CHI\">China</option><!---->"+
"<option value=\"JAP\">Japan</option><!---->"+
"</select>"+
"<br>"+
"Leader:"+
"<select id=\"country_create_presets_countries_leaders\">"+
"<option value=\"Washington\">George Washington</option>"+
"<option value=\"Lincoln\">Abraham Lincoln</option>"+
"<option value=\"FDR\">Franklin D. Roosevelt</option>"+
"</select>"

var USA_Leaders = "<option value=\"Washington\">George Washington</option>"+
"<option value=\"Lincoln\">Abraham Lincoln</option>"+
"<option value=\"FDR\">Franklin D. Roosevelt</option>";

var Japan_Leaders = "<option value=\"Tokugawa\">Ieyasu Tokugawa</option>";

function openCountryCreate(){
	var z = document.getElementById("countryCreateBox");
	z.style.display = "block";
}

function country_create_contentify(){
	var z = document.getElementById("country_create_menu").value;
	var y = document.getElementById("country_create_content");
	if(z=="Preset"){
		y.innerHTML = country_create_content_preset;
	}
	else{
		y.innerHTML = "ERROR! UNABLE TO LOAD MENU!"
	}
}

function country_create_presets_contentify(){
	var z = document.getElementById("country_create_presets_countries").value;
	var y = document.getElementById("country_create_presets_countries_leaders");
	if(z=="USA"){
		y.innerHTML = USA_Leaders;
	}
	else if(z=="JAP"){
		y.innerHTML = Japan_Leaders;
	}
	else{
		y.innerHTML = "ERROR! UNABLE TO LOAD MENU!"
	}
}