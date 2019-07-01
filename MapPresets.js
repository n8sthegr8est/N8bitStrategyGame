var MapPreset = function(map,cities){//should be the map and an array of abstractCities.
	this.map = map;
	this.cities = cities;
	
	this.load = () => {
		largeMap = this.map;
		for(let i = 0; i < this.cities.length; i++){
			this.cities[i].realize();
		}
		curView = "BLANK";
		drawMap();
	}
}

var IRLMap;
var IRLMapMajorNationCapitals;
var IRLMapMajorNationMajorCities;
var IRLMapPlusCapitals;
var IRLMapPlusMajorCities;

window.onload = function(){//ready map presets
	/*var x = new smallestPart("seawater");
	var y4 = new subMapTile([x.copy(),x.copy(),x.copy(),x.copy(),x.copy(),x.copy(),x.copy(),x.copy(),x.copy()]);
	var z2 = new subMapSector([y4.copy(),y4.copy(),y4.copy(),y4.copy(),y4.copy(),y4.copy(),y4.copy(),y4.copy(),y4.copy(),
							  y4.copy(),y4.copy(),y4.copy(),y4.copy(),y4.copy(),y4.copy(),y4.copy(),y4.copy(),y4.copy(),
							  y4.copy(),y4.copy(),y4.copy(),y4.copy(),y4.copy(),y4.copy(),y4.copy(),y4.copy(),y4.copy(),
							  y4.copy(),y4.copy(),y4.copy(),y4.copy(),y4.copy(),y4.copy(),y4.copy(),y4.copy(),y4.copy(),
							  y4.copy(),y4.copy(),y4.copy(),y4.copy(),y4.copy(),y4.copy(),y4.copy(),y4.copy(),y4.copy(),
							  y4.copy(),y4.copy(),y4.copy(),y4.copy(),y4.copy(),y4.copy(),y4.copy(),y4.copy(),y4.copy(),
							  y4.copy(),y4.copy(),y4.copy(),y4.copy(),y4.copy(),y4.copy(),y4.copy(),y4.copy(),y4.copy(),
							  y4.copy(),y4.copy(),y4.copy(),y4.copy(),y4.copy(),y4.copy(),y4.copy(),y4.copy(),y4.copy(),
							  y4.copy(),y4.copy(),y4.copy(),y4.copy(),y4.copy(),y4.copy(),y4.copy(),y4.copy(),y4.copy()]);
	var s = new subMap([z2.copy(),z2.copy(),z2.copy(),z2.copy(),z2.copy(),z2.copy(),z2.copy(),z2.copy(),z2.copy()]);
	var j = new tile(s.copy());
	var b = new row([j]);*/
	/*var seaPart = new smallestPart("seawater");
	var holdArr = [];
	var seaSubMapTile;
	for(let i = 0; i < 9; i++){
		holdArr.push(seaPart.copy());
	}
	seaSubMapTile = new subMapTile(holdArr);
	IRLMap = new MapPreset(new map([b]),[]);*/
	readyIRLs();
}

function readyIRLs(){
	var seaPart = new smallestPart("seawater");
	var tundraPart = new smallestPart("tundra");
	var mountainPart = new smallestPart("mountain");
	var icePart = new smallestPart("ice");
	var holdArr = [];
	var seaSubMapTile;
	var tempySector,tempySector2,tempySector3,tempySector4,tempySector5,tempySector6,tempySector7,tempySector8,tempySector9;
	for(let i = 0; i < 9; i++){
		holdArr.push(seaPart.copy());
	}
	seaSubMapTile = new subMapTile(holdArr.slice());
	holdArr = [];
	var seaSubMapSector;
	for(let i = 0; i < 9; i++){
		for(let j = 0; j < 9; j++){
			holdArr.push(seaSubMapTile.copy());
		}
	}
	seaSubMapSector = new subMapSector(holdArr.slice());
	holdArr = [];
	var fullSeaSubMap;
	for(let i = 0; i < 9; i++){
		holdArr.push(seaSubMapSector.copy());
	}
	fullSeaSubMap = new subMap(holdArr.slice());
	holdArr = [];
	var fullSeaTile = new tile(fullSeaSubMap.copy());
	
	var EllesmereIsle_1;
	for(let i = 0; i < 8; i++){
		for(let j = 0; j < 9; j++){
			holdArr.push(seaSubMapTile.copy());
		}
	}
	for(let i = 0; i < 8; i++){
		holdArr.push(seaSubMapTile.copy());
	}
	var McClintocBay_NWOpen = new subMapTile([seaPart.copy(),mountainPart.copy(),seaPart.copy(),
											  seaPart.copy(),mountainPart.copy(),mountainPart.copy(),
											  mountainPart.copy(),mountainPart.copy(),mountainPart.copy()]);
	holdArr.push(McClintocBay_NWOpen.copy());
	tempySector = new subMapSector(holdArr.slice());
	holdArr = [];
	for(let i = 0; i < 8; i++){
		holdArr.push(seaSubMapSector.copy());
	}
	holdArr.push(tempySector.copy());
	EllesmereIsle_1 = new tile(new subMap(holdArr.slice()));
	holdArr = [];
	var EllesmereIsle_2,wardHuntIsland,NorthernBromleyIsland,IceSubMapTile;//submap&tile,submaptile,submapTile
	wardHuntIsland = new subMapTile([tundraPart.copy(),tundraPart.copy(),tundraPart.copy(),
									 tundraPart.copy(),tundraPart.copy(),tundraPart.copy(),
									 seaPart.copy(),seaPart.copy(),seaPart.copy()]);
	NorthernBromleyIsland = new subMapTile([seaPart.copy(),seaPart.copy(),seaPart.copy(),
											seaPart.copy(),tundraPart.copy(),seaPart.copy(),
											tundraPart.copy(),tundraPart.copy(),tundraPart.copy()]);
	IceSubMapTile = new subMapTile([icePart.copy(),icePart.copy(),icePart.copy(),//ignoring ice, so never used
									icePart.copy(),icePart.copy(),icePart.copy(),
									icePart.copy(),icePart.copy(),icePart.copy()]);
	//first five sectors are seaSubMapSectors
	
	/*sector 5
	for(let i = 0; i < 5; i++){//first four rows pure sea
		for(let j = 0; j < 9; j++){
			holdArr.push(seaSubMapTile.copy());
		}
	}
	for(let i = 0; i < 9; i++){//next row starts ward hunt ice shelf
		if(i < 7){
			holdArr.push(seaSubMapTile.copy());
		}
		else{
			holdArr.push(IceSubMapTile.copy());
		}
	}
	for(let i = 0; i < 9; i++){//more ice shelf
		if(i < 6){
			holdArr.push(seaSubMapTile.copy());
		}
		else{
			holdArr.push(IceSubMapTile.copy());
		}
	}
	for(let i = 0; i < 9; i++){//more ice shelf
		if(i < 6){
			holdArr.push(seaSubMapTile.copy());
		}
		else{
			holdArr.push(IceSubMapTile.copy());
		}
	}
	for(let i = 0; i < 9; i++){//more ice shelf
		if(i < 5){
			holdArr.push(seaSubMapTile.copy());
		}
		else{
			holdArr.push(IceSubMapTile.copy());
		}
	}
	tempySector = new subMapSector(holdArr.slice());
	holdArr = [];*/
	//sector 6
	for(let i = 0; i < 6; i++){//first five rows pure sea
		for(let j = 0; j < 9; j++){
			holdArr.push(seaSubMapTile.copy());
		}
	}
	for(let i = 0; i < 8; i++){//row is mostly pure sea except for its last tile
		holdArr.push(seaSubMapTile.copy());
	}
	holdArr.push(wardHuntIsland.copy());
	for(let i = 0; i < 2; i++){//last few rows pure sea
		for(let j = 0; j < 9; j++){
			holdArr.push(seaSubMapTile.copy());
		}
	}
	tempySector = new subMapSector(holdArr.slice());
	holdArr = [];
	
	//sector 7
	for(let i = 0; i < 8; i++){//first seven rows pure sea
		for(let j = 0; j < 9; j++){
			holdArr.push(seaSubMapTile.copy());
		}
	}
	for(let i = 0; i < 3; i++){//first three tiles of last row sea
		holdArr.push(seaSubMapTile.copy());
	}
	holdArr.push(NorthernBromleyIsland.copy());
	for(let i = 0; i < 5; i++){
		holdArr.push(seaSubMapTile.copy());
	}
	tempySector2 = new subMapSector(holdArr.slice());
	holdArr = [];
	
	//sector 8
	//var tileA = 
	
	EllesmereIsle_2 = new tile(new subMap([seaSubMapSector.copy(),seaSubMapSector.copy(),seaSubMapSector.copy(),
										   seaSubMapSector.copy(),seaSubMapSector.copy(),tempySector.copy(),
										   tempySector2.copy(),seaSubMapSector.copy(),seaSubMapSector.copy()]));
										   //last two are placeholders.
	
	var Row0;
	for(let i = 0; i < 16; i++){
		holdArr.push(fullSeaTile.copy());
	}
	holdArr.push(EllesmereIsle_1.copy());
	holdArr.push(EllesmereIsle_2.copy());
	
	Row0 = new row(holdArr.slice());
	holdArr = [];
	IRLMap = new MapPreset(new map([Row0]),[]);
	var myAbstractCities = [];
	//add major capitals
	IRLMapMajorNationCapitals = new MapPreset(new map([Row0]),myAbstractCities.slice());
	var myAbstractCities2 = myAbstractCities.slice();
	//add all major nation major cities
	IRLMapMajorNationMajorCities = new MapPreset(new map([Row0]),myAbstractCities2.slice());
}