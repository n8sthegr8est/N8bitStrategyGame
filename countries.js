var countriesInGame = [];
var countryColors = [];
var countryNames = [];
var countryTags = [];
var maxCountries = 300;//temporary number

var country = function(name){
	this.name = name;
	this.color = genCountryColor();
	this.tag = countryTags[countryTags.length-1];
}

function genCountryColor(){
	var R,G,B,R_HEX,G_HEX,B_HEX,FULL_HEX;
	do{
		R = Math.floor(Math.random() * 255)+1;
		G = Math.floor(Math.random() * 255)+1;
		B = Math.floor(Math.random() * 255)+1;
		R_HEX = R.toString(16);
		G_HEX = G.toString(16);
		B_HEX = B.toString(16);
		FULL_HEX = R_HEX + G_HEX + B_HEX;
	}while(FULL_HEX=="ffffff" || FULL_HEX=="0000ff" || FULL_HEX=="7fffd4" || countryColors.indexOf(FULL_HEX)!=-1);
	countryColors.push(FULL_HEX);
	return FULL_HEX;
}

function registerCountry(name){
	if(countryTags.length >= maxCountries){
		throw "Error! Country limit has been reached!";
	}
	else{
		var nextTag = "C";
		if(countryTags.length < 10){
			nextTag += "0";
		}
		nextTag += "" + countryTags.length;
		countryTags.push(nextTag);
		countryNames.push(name);
		countriesInGame.push(new country(name));
	}
	return countriesInGame[countriesInGame.length-1];
}

function findCountry(countryTag){
	var i = countryTags.indexOf(countryTag);
	if(i==-1){
		return;
	}
	return countriesInGame[i];
}

function findCountryByName(name){
	var i = countryNames.indexOf(name);
	if(i==-1){
		return;
	}
	return countriesInGame[i];
}