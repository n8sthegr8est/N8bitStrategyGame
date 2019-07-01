var mL_Content_preset = "<input type=\"radio\" name=\"mapPreset\" id=\"mL_test\" value=\"TestMap\"> Test Map<br>" +
"<input type=\"radio\" name=\"mapPreset\" id=\"mL_IRL\" value=\"IRLMap\"> IRL Map<br>";

var mL_Content_randomize = "<div>" +
"Length <input type=\"text\" id=\"xSize\"> × <input type=\"text\" id=\"ySize\"> Height<br>" +
"" +
"</div>";

function mL_contentify(){
	var z = document.getElementById("mL_menu").value;
	var y = document.getElementById("mL_Content");
	if(z=="Preset"){
		y.innerHTML = mL_Content_preset;
	}
	else if(z=="Random"){
		y.innerHTML = mL_Content_randomize;
	}
	else{
		y.innerHTML = "ERROR! UNABLE TO LOAD MENU!"
	}
}

function mL_loadSelected(){
	var z = document.getElementById("mL_menu").value;
	if(z=="Preset"){
		if(document.getElementById("mL_test").checked){
			LoadTestMap();
		}
		else if(document.getElementById("mL_IRL").checked){
			//throw "Error! Map not currently made!"
			IRLMap.load();
		}
		else{
			throw "Error! No map selected!";
		}
	}
	else{
		throw "Error! Bad settings!"
	}
	var y = document.getElementById("mapLoadBox");
	y.style.display = "none";
	showBlank();
	//openCountryCreate();
}