var curC_BoxSide = "right";

var prevMapMode;

var selectedTile = [];
var prevSelected = [];
var timeOutHold;

function OpenCityBuilder(){
	var x = document.getElementById("cityCreateBox");
	x.style.display = "block";
	prevMapMode = curView;
	showCityBuildMode();
}

function switchCityCreateBoxSide(){
	var x = document.getElementById("cityCreateBox");
	//var y = document.getElementById("C_moveButton");
	if(curC_BoxSide == "right"){
		x.style.right = "unset";
		x.style.left = "0%";
		//y.style.left = "unset";
		//y.style.right = "1%";
		curC_BoxSide = "left";
	}
	else{
		x.style.left = "unset";
		x.style.right = "0%";
		//y.style.right = "unset";
		//y.style.left = "1%";
		curC_BoxSide = "right";
	}
}

function errorizeCityCreate(msg){
	var x = document.getElementById("C_ErrorMsg");
	x.innerHTML = msg;
}

function C_flashError(msg){
	errorizeCityCreate(msg);
	timeOutHold = setTimeout(function(){
		errorizeCityCreate("");
	},
	5000);
}

function highlightTile(TileCoords){
	var h, i, j, k, l;
	h = document.getElementById("C_Coord_h");
	i = document.getElementById("C_Coord_i");
	j = document.getElementById("C_Coord_j");
	k = document.getElementById("C_Coord_k");
	l = document.getElementById("C_Coord_l");
	if(selectedTile.length == 0){
		h.value = TileCoords[0];
		i.value = TileCoords[1];
		j.value = TileCoords[2];
		k.value = TileCoords[3];
		l.value = TileCoords[4];
	}
	/*highlightedTile = TileCoords.slice();
	var w,z;
	if(prevhighlightedTile.length > 0 && prevhighlightedTile_not_Selected()){
		w = "tile" + prevhighlightedTile[0] + "" + prevhighlightedTile[1] + "" + prevhighlightedTile[2] +
		"" + prevhighlightedTile[3] + "" + prevhighlightedTile[4];
		z = document.getElementsByClassName(w)[0];
	}
	var x = "tile" + TileCoords[0] + "" + TileCoords[1] + "" + TileCoords[2] + "" + TileCoords[3] + "" + TileCoords[4];
	var y = document.getElementsByClassName(x)[0];
	if(z!=undefined && prevhighlightedTile_not_Selected()){
		z.classList.remove("cityBuildTarget");
	}
	y.classList.add("cityBuildTarget");
	prevhighlightedTile = highlightedTile.slice();*/
}

function SelectTile(TileCoords){
	selectedTile = TileCoords;
	var w,z;
	if(prevSelected.length > 0){
		w = "tile" + prevSelected[0] + "" + prevSelected[1] + "" + prevSelected[2] + "" + prevSelected[3] + "" + prevSelected[4];
		z = document.getElementsByClassName(w)[0];
	}
	var x = "tile" + TileCoords[0] + "" + TileCoords[1] + "" + TileCoords[2] + "" + TileCoords[3] + "" + TileCoords[4];
	var y = document.getElementsByClassName(x)[0];
	y.classList.add("cityBuildSelected");
	if(z!=undefined){
		z.classList.remove("cityBuildSelected");
	}
	prevSelected = selectedTile.slice();
	
	var h, i, j, k, l;
	h = document.getElementById("C_Coord_h");
	i = document.getElementById("C_Coord_i");
	j = document.getElementById("C_Coord_j");
	k = document.getElementById("C_Coord_k");
	l = document.getElementById("C_Coord_l");
	h.value = TileCoords[0];
	i.value = TileCoords[1];
	j.value = TileCoords[2];
	k.value = TileCoords[3];
	l.value = TileCoords[4];
}

/*function prevhighlightedTile_not_Selected(){
	if(selectedTile.length==0){
		return true;
	}
	for(let i = 0; i < selectedTile.length; i++){
		if(selectedTile[i]!=prevhighlightedTile[i]){
			return true;
		}
	}
	return false;
}*/

function BuildCity(){
	if(selectedTile.length == 0){
		C_flashError("No Tile Selected!");
		return;
	}
	var name,owner,h,i,j,k,l;
	name = document.getElementById("C_name").value;
	owner = document.getElementById("C_own").value;
	h = parseInt(document.getElementById("C_Coord_h").value);
	i = parseInt(document.getElementById("C_Coord_i").value);
	j = parseInt(document.getElementById("C_Coord_j").value);
	k = parseInt(document.getElementById("C_Coord_k").value);
	l = parseInt(document.getElementById("C_Coord_l").value);
	var t = largeMap.getTileOfID([h,i]).subMap.sectors[j].getTile(k,l);
	if(t!=undefined){
		if(!t.isSettlableLand()){
			C_flashError("Selected tile is unsettleable");
			return;
		}
		if(t.owner!=undefined){
			C_flashError("Selected tile is already owned!");
			return;
		}
	}
	else{
		C_flashError("Cannot find selected tile!");
		return;
	}
	if(name == ""){
		C_flashError("Give the city a name!");
		return;
	}
	if(owner == ""){
		C_flashError("The city needs an owner!");
		return;
	}
	createNewCity(name,owner,[h,i,j,k,l]);
	CloseCityBuilder();
	//C_flashError("Test MSG");
}

function CloseCityBuilder(){
	var x = document.getElementById("cityCreateBox");
	selectedTile = [];
	highlightedTile = [];
	prevhighlightedTile = [];
	
	var name,owner,h,i,j,k,l;
	name = document.getElementById("C_name");
	owner = document.getElementById("C_own");
	h = document.getElementById("C_Coord_h");
	i = document.getElementById("C_Coord_i");
	j = document.getElementById("C_Coord_j");
	k = document.getElementById("C_Coord_k");
	l = document.getElementById("C_Coord_l");
	name.value = "";
	owner.value = "";
	h.value = "";
	i.value = "";
	j.value = "";
	k.value = "";
	l.value = "";
	clearTimeout(timeOutHold);
	errorizeCityCreate("");
	
	x.style.display = "none";
	curView = prevMapMode;
	drawMap();
}