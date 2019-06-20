var terrains = function(){
	this.desert = "desert";//dry, hot, and sandy with little vegetation.
	this.savanna = "savanna";//dry and hot with dry grass and small plants, with very few trees.
	this.jungle = "jungle";//wet, hot, and full of lush green vegetation with many trees.
	this.swamp = "swamp";//wet and muddy with a lot of plant life.
	this.marsh = "marsh";//wet and muddy with little to no plant life.
	this.forestT = "temperate forest";//temperate with a large concentration of trees and plant life.
	this.mountain = "mountain";//a considerably large rocky mountain.
	this.hill = "hill";//a hill of decent size.
	this.plains = "plains";//a temperate flatland.
	this.tundra = "tundra";//cold with little plant life and has perma frost.
	this.sea = "seawater";//the sea
	this.lake = "lakewater";//a lake
	this.beachS = "sandy beach";//a beach made from sand
}

var cityArr = []

var city = function(name,loc,largeLoc,owner){
	
	/*
	this.isInTopRow = (loc) => {
		return loc[0] < 9 ? true : false;
	}
	
	this.isInMiddleRow = (loc) => {
		return loc[0] < 18 ? true : false;
	}
	
	this.assignTopRowSect = (loc) => {
		if(loc[1]<9){
			return 0;
		}
		else if(loc[1]<18){
			return 2;
		}
		else{
			return 3;
		}
	}
	
	this.assignMiddleRowSect = (loc) => {
		if(loc[1]<9){
			return 3;
		}
		else if(loc[1]<18){
			return 4;
		}
		else{
			return 5;
		}
	}
	
	this.assignBottomRowSect = (loc) => {
		if(loc[1]<9){
			return 6;
		}
		else if(loc[1]<18){
			return 7;
		}
		else{
			return 8;
		}
	}
	*/
	
	this.name = name;
	this.loc = loc;
	this.largeLoc = largeLoc;
	this.owner = owner;
	//this.ownedLand = [];
	var sect = 0;
	if(loc[0]<9){
		if(loc[1]<9){
			sect = 0;
		}
		else if(loc[1]<18){
			sect = 3;
		}
		else{
			sect = 6;
		}
	}
	else if(loc[0]<18){
		if(loc[1]<9){
			sect = 1;
		}
		else if(loc[1]<18){
			sect = 4;
		}
		else{
			sect = 7;
		}
	}
	else{
		if(loc[1]<9){
			sect = 2;
		}
		else if(loc[1]<18){
			sect = 5;
		}
		else{
			sect = 8;
		}
	}
	this.sect = sect;
	this.trueCoords = [loc[0]%9,loc[1]%9];
	//this.ownedLand.push([largeLoc[0],largeLoc[1],loc[1],loc[0]]);
	largeMap.getTileOfID(largeLoc).subMap.sectors[sect].getTile(loc[1]%9,loc[0]%9).setCity(this);
	this.growOwnership = () => {
		
	}
	/*largeMap.getTileOfID(largeLoc).subMap.sectors[sect].getTile((loc[0]%9)-1,(loc[1]%9)-1).setOwner(this.owner);
	largeMap.getTileOfID(largeLoc).subMap.sectors[sect].getTile((loc[0]%9)-1,loc[1]%9).setOwner(this.owner);
	largeMap.getTileOfID(largeLoc).subMap.sectors[sect].getTile((loc[0]%9)-1,(loc[1]%9)+1).setOwner(this.owner);
	largeMap.getTileOfID(largeLoc).subMap.sectors[sect].getTile((loc[0]%9),(loc[1]%9)-1).setOwner(this.owner);
	largeMap.getTileOfID(largeLoc).subMap.sectors[sect].getTile((loc[0]%9)+1,(loc[1]%9)+1).setOwner(this.owner);
	largeMap.getTileOfID(largeLoc).subMap.sectors[sect].getTile((loc[0]%9)+1,loc[1]%9).setOwner(this.owner);
	largeMap.getTileOfID(largeLoc).subMap.sectors[sect].getTile((loc[0]%9)+1,(loc[1]%9)-1).setOwner(this.owner);
	largeMap.getTileOfID(largeLoc).subMap.sectors[sect].getTile((loc[0]%9),(loc[1]%9)+1).setOwner(this.owner);*/
}

var smallestPart = function(terrainType){
	this.terrainType = terrainType;
	this.owner = undefined;
	this.development = 0;
	this.isCapital = false;
	
	this.setOwner = (name) => {
		this.owner = name;
	}
	
	this.copy = () => {
		var x = new smallestPart(this.terrainType);
		x.setOwner(this.owner);
		return x;
	}
	
	this.develop = () => {
		this.development++;
	}
}

smallestPart.prototype.getType = function(){
	return "smallestPart";
}

var subMapTile = function(parts){
	function validCheck(parts){
		for(let i = 0; i < parts.length; i++){
			if(parts[i].getType==undefined || parts[i].getType()!="smallestPart"){
				return true;
			}
		}
		return false;
	}
	
	this.getMostPhysical = () => {
		var t_arr = [];
		var n_arr = [];
		for(let i = 0; i < this.parts.length; i++){
			var x = this.parts[i].terrainType
			if(t_arr.indexOf(x) == -1){
				t_arr.push(x);
				n_arr.push(1);
			}
			else{
				n_arr[t_arr.indexOf(x)] += 1;
			}
		}
		let j = -1;
		let a = "";
		for(let i = 0;i < t_arr.length; i++){
			if(j < n_arr[i]){
				a = t_arr[i];
				j = n_arr[i];
			}
		}
		return a;
	}
	
	this.setTroops = (troopArr,tile) => {//tile is an array with the tile's location
		this.troops = troopArr;
		redrawTile(tile);
	}
	
	this.setCity = (city) => {
		this.isCity = true;
		//this.parts[4].isCapital = true;
		this.parts[4].development = 5;
		for(let i = 0; i < 9; i++){
			if(i!=4){
				this.parts[i].development = 3;
			}
		}
		this.setOwner(city.owner);
		//var locale = city.loc;//[y,x]
		var affectLeftOffSubMap = false;
		var affectRightOffSubMap = false;
		var affectUpOffSubMap = false;
		var affectDownOffSubMap = false;
		if((city.sect==0 || city.sect==3 || city.sect==6) && city.loc[0]%9==0){
			affectLeftOffSubMap = true;
		}
		if((city.sect==0 || city.sect==1 || city.sect==2) && city.loc[1]%9==0){
			affectUpOffSubMap = true;
		}
		if((city.sect==2 || city.sect==5 || city.sect==8) && city.loc[0]%9==8){
			affectRightOffSubMap = true;
		}
		if((city.sect==6 || city.sect==7 || city.sect==8) && city.loc[1]%9==8){
			affectDownOffSubMap = true;
		}
		if(affectLeftOffSubMap){
			if(affectUpOffSubMap){
				if(largeMap.getTileOfID([city.largeLoc[0]-1,city.largeLoc[1]-1])!=undefined){
					largeMap.getTileOfID([city.largeLoc[0]-1,city.largeLoc[1]-1]).subMap.sectors[8].getTile(8,8).setSuburb(city);
					//city.ownedLand.push([city.largeLoc[0]-1,city.largeLoc[1]-1,8,8]);
				}
			}
			else if(affectDownOffSubMap){
				if(largeMap.getTileOfID([city.largeLoc[0]+1,city.largeLoc[1]-1])!=undefined){
					largeMap.getTileOfID([city.largeLoc[0]+1,city.largeLoc[1]-1]).subMap.sectors[2].getTile(8,0).setSuburb(city);
					//city.ownedLand.push([city.largeLoc[0]+1,city.largeLoc[1]-1,8,0]);
				}
			}
			if(largeMap.getTileOfID([city.largeLoc[0],city.largeLoc[1]-1])!=undefined){
				if(largeMap.getTileOfID([city.largeLoc[0],city.largeLoc[1]-1]).subMap.sectors[city.sect+2].getTile((city.loc[1]%9)-1,8)!=undefined){
					largeMap.getTileOfID([city.largeLoc[0],city.largeLoc[1]-1]).subMap.sectors[city.sect+2].getTile((city.loc[1]%9)-1,8).setSuburb(city);
					//city.ownedLand.push([city.largeLoc[0],city.largeLoc[1]-1,(city.loc[1]%9)-1,8]);
				}
				if(largeMap.getTileOfID([city.largeLoc[0],city.largeLoc[1]-1]).subMap.sectors[city.sect+2].getTile((city.loc[1]%9),8)!=undefined){
					largeMap.getTileOfID([city.largeLoc[0],city.largeLoc[1]-1]).subMap.sectors[city.sect+2].getTile((city.loc[1]%9),8).setSuburb(city);
					//city.ownedLand.push([city.largeLoc[0],city.largeLoc[1]-1,(city.loc[1]%9)-1,8]);
				}
				if(largeMap.getTileOfID([city.largeLoc[0],city.largeLoc[1]-1]).subMap.sectors[city.sect+2].getTile((city.loc[1]%9)+1,8)!=undefined){
					largeMap.getTileOfID([city.largeLoc[0],city.largeLoc[1]-1]).subMap.sectors[city.sect+2].getTile((city.loc[1]%9)+1,8).setSuburb(city);
				}
			}
		}
		else if(affectRightOffSubMap){
			if(affectUpOffSubMap){
				if(largeMap.getTileOfID([city.largeLoc[0]-1,city.largeLoc[1]+1])!=undefined){
					largeMap.getTileOfID([city.largeLoc[0]-1,city.largeLoc[1]+1]).subMap.sectors[6].getTile(0,8).setSuburb(city);
				}
			}
			else if(affectDownOffSubMap){
				if(largeMap.getTileOfID([city.largeLoc[0]+1,city.largeLoc[1]+1])!=undefined){
					largeMap.getTileOfID([city.largeLoc[0]+1,city.largeLoc[1]+1]).subMap.sectors[0].getTile(0,0).setSuburb(city);
				}
			}
			if(largeMap.getTileOfID([city.largeLoc[0],city.largeLoc[1]+1])!=undefined){
				if(largeMap.getTileOfID([city.largeLoc[0],city.largeLoc[1]+1]).subMap.sectors[city.sect-2].getTile((city.loc[1]%9)-1,0)!=undefined){
					largeMap.getTileOfID([city.largeLoc[0],city.largeLoc[1]+1]).subMap.sectors[city.sect-2].getTile((city.loc[1]%9)-1,0).setSuburb(city);
				}
				if(largeMap.getTileOfID([city.largeLoc[0],city.largeLoc[1]+1]).subMap.sectors[city.sect-2].getTile((city.loc[1]%9),0)!=undefined){
					largeMap.getTileOfID([city.largeLoc[0],city.largeLoc[1]+1]).subMap.sectors[city.sect-2].getTile((city.loc[1]%9),0).setSuburb(city);
				}
				if(largeMap.getTileOfID([city.largeLoc[0],city.largeLoc[1]+1]).subMap.sectors[city.sect-2].getTile((city.loc[1]%9)+1,0)!=undefined){
					largeMap.getTileOfID([city.largeLoc[0],city.largeLoc[1]+1]).subMap.sectors[city.sect-2].getTile((city.loc[1]%9)+1,0).setSuburb(city);
				}
			}
		}
		if(affectUpOffSubMap){
			if(largeMap.getTileOfID([city.largeLoc[0]-1,city.largeLoc[1]])!=undefined){
				if(largeMap.getTileOfID([city.largeLoc[0]-1,city.largeLoc[1]]).subMap.sectors[city.sect+6].getTile((city.loc[1]%9)-1,(city.loc[0]%9)-1)!=undefined){
					largeMap.getTileOfID([city.largeLoc[0]-1,city.largeLoc[1]]).subMap.sectors[city.sect+6].getTile((city.loc[1]%9)-1,(city.loc[0]%9)-1).setSuburb(city);
				}
				if(largeMap.getTileOfID([city.largeLoc[0]-1,city.largeLoc[1]]).subMap.sectors[city.sect+6].getTile((city.loc[1]%9),(city.loc[0]%9)-1)!=undefined){
					largeMap.getTileOfID([city.largeLoc[0]-1,city.largeLoc[1]]).subMap.sectors[city.sect+6].getTile((city.loc[1]%9),(city.loc[0]%9)-1).setSuburb(city);
				}
				if(largeMap.getTileOfID([city.largeLoc[0]-1,city.largeLoc[1]]).subMap.sectors[city.sect+6].getTile((city.loc[1]%9)+1,(city.loc[0]%9)-1)!=undefined){
					largeMap.getTileOfID([city.largeLoc[0]-1,city.largeLoc[1]]).subMap.sectors[city.sect+6].getTile((city.loc[1]%9)+1,(city.loc[0]%9)-1).setSuburb(city);
				}
			}
		}
		else if(affectDownOffSubMap){
			if(largeMap.getTileOfID([city.largeLoc[0]+1,city.largeLoc[1]])!=undefined){
				if(largeMap.getTileOfID([city.largeLoc[0]+1,city.largeLoc[1]]).subMap.sectors[city.sect-6].getTile((city.loc[1]%9)-1,(city.loc[0]%9)-1)!=undefined){
					largeMap.getTileOfID([city.largeLoc[0]+1,city.largeLoc[1]]).subMap.sectors[city.sect-6].getTile((city.loc[1]%9)-1,(city.loc[0]%9)-1).setSuburb(city);
				}
				if(largeMap.getTileOfID([city.largeLoc[0]+1,city.largeLoc[1]]).subMap.sectors[city.sect-6].getTile((city.loc[1]%9),(city.loc[0]%9)-1)!=undefined){
					largeMap.getTileOfID([city.largeLoc[0]+1,city.largeLoc[1]]).subMap.sectors[city.sect-6].getTile((city.loc[1]%9),(city.loc[0]%9)-1).setSuburb(city);
				}
				if(largeMap.getTileOfID([city.largeLoc[0]+1,city.largeLoc[1]]).subMap.sectors[city.sect-6].getTile((city.loc[1]%9)+1,(city.loc[0]%9)-1)!=undefined){
					largeMap.getTileOfID([city.largeLoc[0]+1,city.largeLoc[1]]).subMap.sectors[city.sect-6].getTile((city.loc[1]%9)+1,(city.loc[0]%9)-1).setSuburb(city);
				}
			}
		}
		
		var affectDownOffSector = false;
		var affectLeftOffSector = false;
		var affectRightOffSector = false;
		var affectUpOffSector = false;
		if(city.sect!=0 && city.sect!=3 && city.sect!=6 && city.loc[0]%9==0){
			affectLeftOffSector = true;
		}
		if(city.sect!=0 && city.sect!=1 && city.sect!=2 && city.loc[1]%9==0){
			affectUpOffSector = true;
		}
		if(city.sect!=2 && city.sect!=5 && city.sect!=8 && city.loc[0]%9==8){
			affectRightOffSector = true;
		}
		if(city.sect!=6 && city.sect!=7 && city.sect!=8 && city.loc[1]%9==8){
			affectDownOffSector = true;
		}
		
		if(affectLeftOffSector){
			if(affectUpOffSector){
				largeMap.getTileOfID(city.largeLoc).subMap.sectors[city.sect-4].getTile(8,8).setSuburb(city);
			}
			else if(affectDownOffSector){
				largeMap.getTileOfID(city.largeLoc).subMap.sectors[city.sect+2].getTile(0,8).setSuburb(city);
			}
			if(largeMap.getTileOfID(city.largeLoc).subMap.sectors[city.sect-1].getTile((city.loc[1]%9)-1,8)!=undefined){
				largeMap.getTileOfID(city.largeLoc).subMap.sectors[city.sect-1].getTile((city.loc[1]%9)-1,8).setSuburb(city);
			}
			if(largeMap.getTileOfID(city.largeLoc).subMap.sectors[city.sect-1].getTile((city.loc[1]%9),8)!=undefined){
				largeMap.getTileOfID(city.largeLoc).subMap.sectors[city.sect-1].getTile((city.loc[1]%9),8).setSuburb(city);
			}
			if(largeMap.getTileOfID(city.largeLoc).subMap.sectors[city.sect-1].getTile((city.loc[1]%9)+1,8)!=undefined){
				largeMap.getTileOfID(city.largeLoc).subMap.sectors[city.sect-1].getTile((city.loc[1]%9)+1,8).setSuburb(city);
			}
		}
		else if(affectRightOffSector){
			if(affectUpOffSector){
				largeMap.getTileOfID(city.largeLoc).subMap.sectors[city.sect-2].getTile(8,0).setSuburb(city);
			}
			else if(affectDownOffSector){
				largeMap.getTileOfID(city.largeLoc).subMap.sectors[city.sect+4].getTile(0,0).setSuburb(city);
			}
			if(largeMap.getTileOfID(city.largeLoc).subMap.sectors[city.sect+1].getTile((city.loc[1]%9)-1,0)!=undefined){
				largeMap.getTileOfID(city.largeLoc).subMap.sectors[city.sect+1].getTile((city.loc[1]%9)-1,0).setSuburb(city);
			}
			if(largeMap.getTileOfID(city.largeLoc).subMap.sectors[city.sect+1].getTile((city.loc[1]%9),0)!=undefined){
				largeMap.getTileOfID(city.largeLoc).subMap.sectors[city.sect+1].getTile((city.loc[1]%9),0).setSuburb(city);
			}
			if(largeMap.getTileOfID(city.largeLoc).subMap.sectors[city.sect+1].getTile((city.loc[1]%9)+1,0)!=undefined){
				largeMap.getTileOfID(city.largeLoc).subMap.sectors[city.sect+1].getTile((city.loc[1]%9)+1,0).setSuburb(city);
			}
		}
		if(affectDownOffSector){
			if(largeMap.getTileOfID(city.largeLoc).subMap.sectors[city.sect+3].getTile(0,(city.loc[0]%9)-1)!=undefined && !affectLeftOffSector){
				largeMap.getTileOfID(city.largeLoc).subMap.sectors[city.sect+3].getTile(0,(city.loc[0]%9)-1).setSuburb(city);
			}
			if(largeMap.getTileOfID(city.largeLoc).subMap.sectors[city.sect+3].getTile(0,(city.loc[0]%9))!=undefined){
				largeMap.getTileOfID(city.largeLoc).subMap.sectors[city.sect+3].getTile(0,(city.loc[0]%9)).setSuburb(city);
			}
			if(largeMap.getTileOfID(city.largeLoc).subMap.sectors[city.sect+3].getTile(0,(city.loc[0]%9)+1)!=undefined && !affectRightOffSector){
				largeMap.getTileOfID(city.largeLoc).subMap.sectors[city.sect+3].getTile(0,(city.loc[0]%9)+1).setSuburb(city);
			}
		}
		else if(affectUpOffSector){
			if(largeMap.getTileOfID(city.largeLoc).subMap.sectors[city.sect-3].getTile(8,(city.loc[0]%9)-1)!=undefined && !affectLeftOffSector){
				largeMap.getTileOfID(city.largeLoc).subMap.sectors[city.sect-3].getTile(8,(city.loc[0]%9)-1).setSuburb(city);
			}
			if(largeMap.getTileOfID(city.largeLoc).subMap.sectors[city.sect-3].getTile(8,(city.loc[0]%9))!=undefined){
				largeMap.getTileOfID(city.largeLoc).subMap.sectors[city.sect-3].getTile(8,(city.loc[0]%9)).setSuburb(city);
			}
			if(largeMap.getTileOfID(city.largeLoc).subMap.sectors[city.sect-3].getTile(8,(city.loc[0]%9)+1)!=undefined && !affectRightOffSector){
				largeMap.getTileOfID(city.largeLoc).subMap.sectors[city.sect-3].getTile(8,(city.loc[0]%9)+1).setSuburb(city);
			}
		}
		
		if(largeMap.getTileOfID(city.largeLoc).subMap.sectors[city.sect].getTile((city.loc[1]%9)-1,(city.loc[0]%9)-1)!=undefined && !affectLeftOffSubMap && !affectUpOffSubMap && !affectLeftOffSector && !affectUpOffSector){
			largeMap.getTileOfID(city.largeLoc).subMap.sectors[city.sect].getTile((city.loc[1]%9)-1,(city.loc[0]%9)-1).setSuburb(city);
		}
		if(largeMap.getTileOfID(city.largeLoc).subMap.sectors[city.sect].getTile((city.loc[1]%9)-1,(city.loc[0]%9))!=undefined && !affectUpOffSubMap && !affectUpOffSector){
			largeMap.getTileOfID(city.largeLoc).subMap.sectors[city.sect].getTile((city.loc[1]%9)-1,(city.loc[0]%9)).setSuburb(city);
		}
		if(largeMap.getTileOfID(city.largeLoc).subMap.sectors[city.sect].getTile((city.loc[1]%9)-1,(city.loc[0]%9)+1)!=undefined && !affectRightOffSubMap && !affectUpOffSubMap && !affectUpOffSector && !affectRightOffSector){
			largeMap.getTileOfID(city.largeLoc).subMap.sectors[city.sect].getTile((city.loc[1]%9)-1,(city.loc[0]%9)+1).setSuburb(city);
		}
		if(largeMap.getTileOfID(city.largeLoc).subMap.sectors[city.sect].getTile((city.loc[1]%9),(city.loc[0]%9)-1)!=undefined && !affectLeftOffSubMap && !affectLeftOffSector){
			largeMap.getTileOfID(city.largeLoc).subMap.sectors[city.sect].getTile((city.loc[1]%9),(city.loc[0]%9)-1).setSuburb(city);
		}
		if(largeMap.getTileOfID(city.largeLoc).subMap.sectors[city.sect].getTile((city.loc[1]%9)+1,(city.loc[0]%9)-1)!=undefined && !affectLeftOffSubMap && !affectDownOffSubMap && !affectLeftOffSector  && !affectDownOffSector){
			largeMap.getTileOfID(city.largeLoc).subMap.sectors[city.sect].getTile((city.loc[1]%9)+1,(city.loc[0]%9)-1).setSuburb(city);
		}
		if(largeMap.getTileOfID(city.largeLoc).subMap.sectors[city.sect].getTile((city.loc[1]%9)+1,(city.loc[0]%9))!=undefined && !affectDownOffSubMap && !affectDownOffSector){
			largeMap.getTileOfID(city.largeLoc).subMap.sectors[city.sect].getTile((city.loc[1]%9)+1,(city.loc[0]%9)).setSuburb(city);
		}
		if(largeMap.getTileOfID(city.largeLoc).subMap.sectors[city.sect].getTile((city.loc[1]%9)+1,(city.loc[0]%9)+1)!=undefined && !affectRightOffSubMap && !affectDownOffSubMap && !affectRightOffSector && !affectDownOffSector){
			largeMap.getTileOfID(city.largeLoc).subMap.sectors[city.sect].getTile((city.loc[1]%9)+1,(city.loc[0]%9)+1).setSuburb(city);
		}
		if(largeMap.getTileOfID(city.largeLoc).subMap.sectors[city.sect].getTile((city.loc[1]%9),(city.loc[0]%9)+1)!=undefined && !affectRightOffSubMap && !affectRightOffSector){
			largeMap.getTileOfID(city.largeLoc).subMap.sectors[city.sect].getTile((city.loc[1]%9),(city.loc[0]%9)+1).setSuburb(city);
		}
		largeMap.getTileOfID(city.largeLoc).subMap.sectors[city.sect].hasCity = true;
		//largeMap.getTileOfID(city.largeLoc).subMap.sectors[city.sect+2].getTile((city.loc[1]%9)-1,8).setSuburb(city);
		/*if(largeMap.getTileOfID(largeLoc).subMap.sectors[sect].getTile((city.loc[0]%9)-1,(city.loc[1]%9)-1)!=undefined){
			largeMap.getTileOfID(largeLoc).subMap.sectors[sect].getTile((city.loc[0]%9)-1,(city.loc[1]%9)-1).setSuburb(city);
		}*/
		cityArr.push(city);
	}
	
	this.setSuburb = (city) => {
		this.isSuburb = true;
		this.setOwner(city.owner);
		this.parts.forEach(function(elem){
			elem.develop();
		});
	}
	
	this.copy = () => {
		var copiedParts = [];
		this.parts.forEach(function(elem){
			copiedParts.push(elem.copy());
		});
		var x = new subMapTile(copiedParts);
		x.isCity = this.isCity;
		x.isSuburb = this.isSuburb;
		return x;
	}
	
	this.setOwner = (owner) => {
		this.owner = owner;
		this.parts.forEach(function(elem){
			elem.setOwner(owner);
		});
	}
	
	if(parts.length != 9){
		throw "Error! a subMapTile is a 3x3 grid, thus must have 9 parts.";
	}
	else if(validCheck(parts)){
		throw "Error! a subMapTile must be constructed from \"smallestParts\".";
	}
	
	this.parts = parts;
	this.troops = [undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined];
	this.isCity = false;
	this.isSuburb = false;
	this.owner = undefined;
}

/*var subMapRow = function(tiles){
	this.tiles = tiles;
}*/

var subMapSector = function(tiles){//a subMapSector is a 9x9 area of subMapTiles.
	this.getMostPhysical = () => {
		var t_arr = [];
		var n_arr = [];
		for(let i = 0; i < tiles.length; i++){
			var x = this.tiles[i].getMostPhysical();
			if(t_arr.indexOf(x) == -1){
				t_arr.push(x);
				n_arr.push(1);
			}
			else{
				n_arr[t_arr.indexOf(x)] += 1;
			}
		}
		let j = -1;
		let a = "";
		for(let i = 0;i < t_arr.length; i++){
			if(j < n_arr[i]){
				a = t_arr[i];
				j = n_arr[i];
			}
		}
		return a;
	}
	
	this.getOwnerNeeded = () => {
		var t_arr = [];
		var n_arr = [];
		for(let i = 0; i < tiles.length; i++){
			if(t_arr.indexOf(tiles[i].owner)==-1){
				t_arr.push(tiles[i].owner);
				n_arr.push(1);
			}
			else{
				n_arr[t_arr.indexOf(tiles[i].owner)]+=1;
			}
		}
		var visOwner = [];
		var curHigh = -1;
		for(let i = 0; i < tiles.length; i++){
			if(n_arr[i]>curHigh && t_arr[i]!=undefined){
				visOwner.splice(0,visOwner.length);
				curHigh = n_arr[i];
				visOwner.push(t_arr[i]);
			}
			else if(n_arr[i]==curHigh){
				visOwner.push(t_arr[i]);
			}
		}
		if(visOwner.length > 1){
			return "";
		}
		else{
			return visOwner[0];
		}
	}
	
	this.getTile = (row,col) => {
		var trueIndex = row*9;
		trueIndex += col;
		if(this.tiles[trueIndex]==undefined){
			return undefined;
		}
		return this.tiles[trueIndex];
	}
	
	this.copy = () => {
		var copiedTiles = [];
		this.tiles.forEach(function(elem){
			copiedTiles.push(elem.copy());
		});
		var x = new subMapSector(copiedTiles);
		return x;
	}
	
	this.tiles = tiles;
	this.hasCity = false;
}

var subMap = function(sectors){//submaps are 27x27 subMapTiles, with each part of a normal tile being 9x9 subMapTiles.
	this.sectors = sectors;
}

var part = function(sector){
	this.overAllPhysical = () => {
		return this.sector.getMostPhysical();
	}
	
	this.overAllOwner = () => {
		return this.sector.getOwnerNeeded();
	}
	
	this.sector = sector;
	this.type = this.overAllPhysical();
}

var tile = function(subMap){
	this.subMap = subMap;
	this.parts = [new part(this.subMap.sectors[0]),new part(this.subMap.sectors[1]),new part(this.subMap.sectors[2]),
				  new part(this.subMap.sectors[3]),new part(this.subMap.sectors[4]),new part(this.subMap.sectors[5]),
				  new part(this.subMap.sectors[6]),new part(this.subMap.sectors[7]),new part(this.subMap.sectors[8])];
}

var row = function(tiles){
	this.getTileOfID = (ID) => {//id: Col#
		if(this.tiles[ID]==undefined){
			return undefined;
		}
		return this.tiles[ID];
	}
	this.tiles = tiles;
}

var map = function(rows){
	this.getTileOfID = (ID) => {//id: [Row#,Col#]
		if(this.rows[ID[0]]==undefined){
			return undefined;
		}
		return this.rows[ID[0]].getTileOfID(ID[1]);
	}
	this.rows = rows;
}

var largeMap;
var curView = "BLANK";

function drawMap(){
	var myHTML = "";
	var rows = largeMap.rows;
	for(let i = 0; i < rows.length; i++){
		for(let j = 0; j < rows[i].tiles.length; j++){
			myHTML+="<div id=\"MapTile\" class=\"expandable\" onclick=\"openSubMap([" + i + "," + j + "])\">";
			/*if(rows[i].tiles[j].parts.length==0){
				myHTML += "<span id=\"coastland\">.</span><span id=\"coastland\">.</span><span id=\"coastland\">.</span><br><span id=\"coastland\">.</span><span id=\"coastland\">.</span><span id=\"coastland\">.</span><br><span id=\"coastland\">.</span><span id=\"coastland\">.</span><span id=\"coastland\">.</span>";
			}*/
			for(let k = 0; k < rows[i].tiles[j].parts.length; k++){
				if(rows[i].tiles[j].parts[k].type=="seawater"){
					myHTML+="<span id=\"seawater\">■</span>";
				}
				else if(rows[i].tiles[j].parts[k].type=="lakewater"){
					myHTML+="<span id=\"lakewater\">■</span>";
				}
				else{
					if(curView=="CITIES"){
						if(rows[i].tiles[j].parts[k].sector.hasCity){
							myHTML+="<span id=\"city\">■</span>"
						}
						else{
							myHTML+="<span id=\"noCity\">■</span>"
						}
					}
					else if(curView=="POLITICAL"){
						myHTML+="<span class=\"" + rows[i].tiles[j].parts[k].overAllOwner() + "\">■</span>"
					}
					else if(curView=="PHYSICAL"){
						myHTML+="<span id=\"" + rows[i].tiles[j].parts[k].type + "\">■</span>"
					}
					else{
						if(rows[i].tiles[j].parts[k-3]!=undefined && rows[i].tiles[j].parts[k-3].type=="seawater" ||
						   rows[i].tiles[j].parts[k+3]!=undefined && rows[i].tiles[j].parts[k+3].type=="seawater" ||
						   (k%3!=0 && rows[i].tiles[j].parts[k-1]!=undefined && rows[i].tiles[j].parts[k-1].type=="seawater") ||
						   (k%3!=2 && rows[i].tiles[j].parts[k+1]!=undefined && rows[i].tiles[j].parts[k+1].type=="seawater") ||
						   (k%3==0 && rows[i].tiles[j-1]!=undefined && rows[i].tiles[j-1].parts[k+2]!=undefined && rows[i].tiles[j-1].parts[k+2].type=="seawater") ||
						   (k%3==2 && rows[i].tiles[j+1]!=undefined && rows[i].tiles[j+1].parts[k-2]!=undefined && rows[i].tiles[j+1].parts[k-2].type=="seawater") ||
						   (k<3 && rows[i-1]!=undefined && rows[i-1].tiles[j]!=undefined && rows[i-1].tiles[j].parts[k+6]!=undefined && rows[i-1].tiles[j].parts[k+6].type=="seawater") ||
						   (k>5 && rows[i+1]!=undefined && rows[i+1].tiles[j]!=undefined && rows[i+1].tiles[j].parts[k-6]!=undefined && rows[i+1].tiles[j].parts[k-6].type=="seawater")){
							   myHTML+="<span id=\"coastland\">■</span>";
						}
						/*else if(i==0 && k<3){
							myHTML+="<span id=\"coastland\">.</span>";
						}*/
						else{
							myHTML+="<span id=\"inland\">■</span>";
						}
					}
				}
				if(((k+1)%3==0)&&((k+1) < rows[i].tiles[j].parts.length)){
					myHTML+="<br>";
				}
			}
			myHTML+="</div>"
		}
		myHTML+="<br>"
	}
	myHTML += "<div id=\"subMapBox\"></div>"
	document.getElementById("map").innerHTML = myHTML;
	if(subMapOpen){
		openSubMap(curSubMap);
	}
}

function openSubMap(id){//view is centered on id
	var myHTML = "";
	//var myFullMap = "";// = "<div id=\"subMapDisplay\">";
	for(let h = 0; h < largeMap.rows.length; h++){
		var mySubMapRows = "<div id=\"subMapRow\">";
	for(let i = 0; i < largeMap.rows[h].tiles.length; i++){
		var mySubMaps = "<div id=\"subMapDisplay\">";
	for(let j = 0; j < 9; j++){
		var myBigRow = "";
		for(let k = 0; k < 9; k++){
			var myRow = "";
			for(let l = 0; l < 9; l++){//class=tile*largeMapRow**largeMapCol**subMapSector**sectorRow**sectorCol* 
				var myTile = "<div id=\"MapTile\" class=\"tile" + h + "" + i + "" + j + "" + k + "" + l + "\">";
				for(let m = 0; m < 9; m++){
					if(largeMap.getTileOfID([h,i]).subMap.sectors[j].getTile(k,l).troops[m]!=undefined){
						myTile += "<span class=\"troops\">" + largeMap.getTileOfID([h,i]).subMap.sectors[j].getTile(k,l).troops[m].getIcon() + "</span>";
					}
					else if(curView=="DEVELOPMENT"){
						if(largeMap.getTileOfID([h,i]).subMap.sectors[j].getTile(k,l).parts[m].terrainType=="seawater" || largeMap.getTileOfID(id).subMap.sectors[j].getTile(k,l).parts[m].terrainType=="lakewater"){
							myTile += "<span id=\"" + largeMap.getTileOfID([h,i]).subMap.sectors[j].getTile(k,l).parts[m].terrainType + "\">■</span>"
						}
						else{
							myTile += "<span id=\"dev" + largeMap.getTileOfID([h,i]).subMap.sectors[j].getTile(k,l).parts[m].development + "\">■</span>"
						}
					}
					else if(curView=="CITIES"){
						if(largeMap.getTileOfID([h,i]).subMap.sectors[j].getTile(k,l).parts[m].terrainType=="seawater" || largeMap.getTileOfID(id).subMap.sectors[j].getTile(k,l).parts[m].terrainType=="lakewater"){
							myTile += "<span id=\"" + largeMap.getTileOfID([h,i]).subMap.sectors[j].getTile(k,l).parts[m].terrainType + "\">■</span>"
						}
						else if(largeMap.getTileOfID([h,i]).subMap.sectors[j].getTile(k,l).isCity){
							myTile += "<span id=\"city\">■</span>";
						}
						else if(largeMap.getTileOfID([h,i]).subMap.sectors[j].getTile(k,l).isSuburb){
							myTile += "<span id=\"suburb\">■</span>";
						}
						else{
							myTile += "<span id=\"noCity\">■</span>";
						}
					}
					else if(curView=="PHYSICAL"){
						myTile += "<span id=\"" + largeMap.getTileOfID([h,i]).subMap.sectors[j].getTile(k,l).parts[m].terrainType + "\">■</span>"
					}
					else if(curView=="POLITICAL"){
						if(largeMap.getTileOfID([h,i]).subMap.sectors[j].getTile(k,l).parts[m].terrainType=="seawater" || largeMap.getTileOfID(id).subMap.sectors[j].getTile(k,l).parts[m].terrainType=="lakewater"){
							myTile += "<span id=\"" + largeMap.getTileOfID([h,i]).subMap.sectors[j].getTile(k,l).parts[m].terrainType + "\">■</span>"
						}
						else{
							myTile += "<span class=\"" + largeMap.getTileOfID([h,i]).subMap.sectors[j].getTile(k,l).parts[m].owner + "\">■</span>"
						}
					}
					else{
						if(largeMap.getTileOfID([h,i]).subMap.sectors[j].getTile(k,l).parts[m].terrainType=="seawater" || largeMap.getTileOfID(id).subMap.sectors[j].getTile(k,l).parts[m].terrainType=="lakewater"){
							myTile += "<span id=\"" + largeMap.getTileOfID([h,i]).subMap.sectors[j].getTile(k,l).parts[m].terrainType + "\">■</span>"
						}
						else{
							myTile+="<span id=\"inland\">■</span>";
						}
					}
					if(m+1 < 9 && (m+1)%3==0){
						myTile += "<br>";
					}
				}
				myRow += myTile + "</div>";
				myTile = "<div id=\"MapTile\">";
			}
			myBigRow += myRow + "<br>";
			myRow = "";
		}
		mySubMaps += "<div id=\"subMapSector\">" + myBigRow + "</div>";
		if(j+1 < 9 && (j+1)%3==0){
			mySubMaps += "<br>";
		}
		myBigRow = "";
	}
	//myHTML = myFullMap
	mySubMapRows += mySubMaps + "</div>"
	mySubMaps = "<div id=\"subMapDisplay\">";
	}
	myHTML += mySubMapRows + "<br>";
	mySubMapRows = "<div id=\"subMapRow\">";
	}
	document.getElementById("map").innerHTML = myHTML;
	subMapOpen = true;
}

function redrawTile(coords){//[largeMapRow,largeMapCol,subMapSector,sectorRow,sectorCol]
	if(!subMapOpen){
		return;
	}
	var h = coords[0];
	var i = coords[1];
	var j = coords[2];
	var k = coords[3];
	var l = coords[4];
	var tileNeeded = "tile" + h;
	tileNeeded += "" + i;
	tileNeeded += "" + j;
	tileNeeded += "" + k;
	tileNeeded += "" + l;
	var x = document.getElementsByClassName(tileNeeded)[0];
	var myTile = "";
	for(let m = 0; m < 9; m++){
		if(largeMap.getTileOfID([h,i]).subMap.sectors[j].getTile(k,l).troops[m]!=undefined){
			myTile += "<span class=\"troops\">" + largeMap.getTileOfID([coords[0],coords[1]]).subMap.sectors[coords[2]].getTile(coords[3],coords[4]).troops[m].getIcon() + "</span>";
		}
		else if(curView=="DEVELOPMENT"){
			if(largeMap.getTileOfID([h,i]).subMap.sectors[j].getTile(k,l).parts[m].terrainType=="seawater" || largeMap.getTileOfID([h,i]).subMap.sectors[j].getTile(k,l).parts[m].terrainType=="lakewater"){
				myTile += "<span id=\"" + largeMap.getTileOfID([h,i]).subMap.sectors[j].getTile(k,l).parts[m].terrainType + "\">■</span>"
			}
			else{
				myTile += "<span id=\"dev" + largeMap.getTileOfID([h,i]).subMap.sectors[j].getTile(k,l).parts[m].development + "\">■</span>"
			}
		}
		else if(curView=="CITIES"){
			if(largeMap.getTileOfID([h,i]).subMap.sectors[j].getTile(k,l).parts[m].terrainType=="seawater" || largeMap.getTileOfID([h,i]).subMap.sectors[j].getTile(k,l).parts[m].terrainType=="lakewater"){
				myTile += "<span id=\"" + largeMap.getTileOfID([h,i]).subMap.sectors[j].getTile(k,l).parts[m].terrainType + "\">■</span>"
			}
			else if(largeMap.getTileOfID([h,i]).subMap.sectors[j].getTile(k,l).isCity){
				myTile += "<span id=\"city\">■</span>";
			}
			else if(largeMap.getTileOfID([h,i]).subMap.sectors[j].getTile(k,l).isSuburb){
				myTile += "<span id=\"suburb\">■</span>";
			}
			else{
				myTile += "<span id=\"noCity\">■</span>";
			}
		}
		else if(curView=="PHYSICAL"){
			myTile += "<span id=\"" + largeMap.getTileOfID([h,i]).subMap.sectors[j].getTile(k,l).parts[m].terrainType + "\">■</span>"
		}
		else if(curView=="POLITICAL"){
			if(largeMap.getTileOfID([h,i]).subMap.sectors[j].getTile(k,l).parts[m].terrainType=="seawater" || largeMap.getTileOfID([h,i]).subMap.sectors[j].getTile(k,l).parts[m].terrainType=="lakewater"){
				myTile += "<span id=\"" + largeMap.getTileOfID([h,i]).subMap.sectors[j].getTile(k,l).parts[m].terrainType + "\">■</span>"
			}
			else{
				myTile += "<span class=\"" + largeMap.getTileOfID([h,i]).subMap.sectors[j].getTile(k,l).parts[m].owner + "\">■</span>"
			}
		}
		else{
			if(largeMap.getTileOfID([h,i]).subMap.sectors[j].getTile(k,l).parts[m].terrainType=="seawater" || largeMap.getTileOfID([h,i]).subMap.sectors[j].getTile(k,l).parts[m].terrainType=="lakewater"){
				myTile += "<span id=\"" + largeMap.getTileOfID([h,i]).subMap.sectors[j].getTile(k,l).parts[m].terrainType + "\">■</span>"
			}
			else{
				myTile+="<span id=\"inland\">■</span>";
			}
		}
		if(m+1 < 9 && (m+1)%3==0){
			myTile += "<br>";
		}
	}
	x.innerHTML = myTile;
}

/*function openSubMap(id){
	document.getElementById("subMapBox").style.display = "block";
	curSubMap = id;
	var myHtml = "";
	//for(let i = 0; i < 3; i++){
		for(let j = 0; j < 9; j++){
			var myBigRow = "";
			for(let k = 0; k < 9; k++){
				var myRow = "";
				for(let l = 0; l < 9; l++){
					var myTile = "<div id=\"MapTile\">";
					//myHtml += ""
					for(let m = 0; m < 9; m++){
						if(largeMap.getTileOfID(id).subMap.sectors[j].getTile(k,l).troops[m]!=undefined){
							myTile += "<span class=\"troops\">.</span>";
						}
						else if(curView=="DEVELOPMENT"){
							if(largeMap.getTileOfID(id).subMap.sectors[j].getTile(k,l).parts[m].terrainType=="seawater" || largeMap.getTileOfID(id).subMap.sectors[j].getTile(k,l).parts[m].terrainType=="lakewater"){
								myTile += "<span id=\"" + largeMap.getTileOfID(id).subMap.sectors[j].getTile(k,l).parts[m].terrainType + "\">.</span>"
							}
							else{
								myTile += "<span id=\"dev" + largeMap.getTileOfID(id).subMap.sectors[j].getTile(k,l).parts[m].development + "\">.</span>"
							}
						}
						else if(curView=="CITIES"){
							if(largeMap.getTileOfID(id).subMap.sectors[j].getTile(k,l).parts[m].terrainType=="seawater" || largeMap.getTileOfID(id).subMap.sectors[j].getTile(k,l).parts[m].terrainType=="lakewater"){
								myTile += "<span id=\"" + largeMap.getTileOfID(id).subMap.sectors[j].getTile(k,l).parts[m].terrainType + "\">.</span>"
							}
							else if(largeMap.getTileOfID(id).subMap.sectors[j].getTile(k,l).isCity){
								myTile += "<span id=\"city\">.</span>";
							}
							else if(largeMap.getTileOfID(id).subMap.sectors[j].getTile(k,l).isSuburb){
								myTile += "<span id=\"suburb\">.</span>";
							}
							else{
								myTile += "<span id=\"noCity\">.</span>";
							}
						}
						else if(curView=="PHYSICAL"){
							myTile += "<span id=\"" + largeMap.getTileOfID(id).subMap.sectors[j].getTile(k,l).parts[m].terrainType + "\">.</span>"
						}
						else if(curView=="POLITICAL"){
							if(largeMap.getTileOfID(id).subMap.sectors[j].getTile(k,l).parts[m].terrainType=="seawater" || largeMap.getTileOfID(id).subMap.sectors[j].getTile(k,l).parts[m].terrainType=="lakewater"){
								myTile += "<span id=\"" + largeMap.getTileOfID(id).subMap.sectors[j].getTile(k,l).parts[m].terrainType + "\">.</span>"
							}
							else{
								myTile += "<span class=\"" + largeMap.getTileOfID(id).subMap.sectors[j].getTile(k,l).parts[m].owner + "\">.</span>"
							}
						}
						else{
							if(largeMap.getTileOfID(id).subMap.sectors[j].getTile(k,l).parts[m].terrainType=="seawater" || largeMap.getTileOfID(id).subMap.sectors[j].getTile(k,l).parts[m].terrainType=="lakewater"){
								myTile += "<span id=\"" + largeMap.getTileOfID(id).subMap.sectors[j].getTile(k,l).parts[m].terrainType + "\">.</span>"
							}
							else{
								myTile+="<span id=\"inland\">.</span>";
							}
						}
						if(m+1 < 9 && (m+1)%3==0){
							myTile += "<br>";
						}
					}
				myRow += myTile + "</div>";
				myTile = "<div id=\"MapTile\">";
				}
				myBigRow += myRow + "<br>";
				myRow = "";
			}
			myHtml += "<div id=\"subMapSector\">" + myBigRow + "</div>";
			if(j+1 < 9 && (j+1)%3==0){
				myHtml += "<br>";
			}
			myBigRow = "";
		}
		//myHtml += myRow;
		//myRow = "";
	//}
	document.getElementById("subMapBox").innerHTML = myHtml;
	subMapOpen = true;
}*/

function closeSubmap(){
	//document.getElementById("subMapBox").style.display = "none";
	subMapOpen = false;
	drawMap();
}

var subMapOpen = false;
var curSubMap = [0,0];

function showPolitical() {
	curView = "POLITICAL";
	drawMap();
}

function showBlank() {
	curView = "BLANK";
	drawMap();
}

function showPhysical() {
	curView = "PHYSICAL";
	drawMap();
}

function showCities() {
	curView = "CITIES";
	drawMap();
}

function showDevelopment() {
	curView = "DEVELOPMENT";
	drawMap();
}
//Tests
function TestShowingTroops() {//just tests to ensure troops visible
	var t = new division(500,"infantry");
	var u = new division(500,"cavalry");
	var v = new division(500,"artillery");
	largeMap.getTileOfID([0,0]).subMap.sectors[2].getTile(3,3).setTroops([t,undefined,u,undefined,v,undefined,t,undefined,u],[0,0,2,3,3])
	drawMap();
}

function TestShowingTroops2() {//tests deploying troops
	var t = new division(500,"infantry");
	t.deploy(cityArr[3]);
}

function TestMarchNY2PHIL() {//tests troops marching
	var t = new division(500,"infantry");
	t.deploy(cityArr[1]);
	t.setMarchToCity(cityArr[0]);
}

function TestMarchNY2MOS() {//tests troops marching around water
	var t = new division(500,"artillery");
	t.deploy(cityArr[1]);
	t.setMarchToCity(cityArr[4]);
}

window.onload = function(){
	var x = new smallestPart("seawater");
	var x2 = new smallestPart("beachS");
	var x3 = new smallestPart("plains");
	var x4 = new smallestPart("mountain");
	var y = new subMapTile([x2.copy(),x2.copy(),x2.copy(),x.copy(),x2.copy(),x2.copy(),x.copy(),x.copy(),x2.copy()]);
	var y2 = new subMapTile([x2.copy(),x2.copy(),x2.copy(),x2.copy(),x2.copy(),x2.copy(),x2.copy(),x2.copy(),x2.copy()]);
	var y3 = new subMapTile([x3.copy(),x3.copy(),x3.copy(),x3.copy(),x3.copy(),x3.copy(),x3.copy(),x3.copy(),x3.copy()]);
	var y4 = new subMapTile([x.copy(),x.copy(),x.copy(),x.copy(),x.copy(),x.copy(),x.copy(),x.copy(),x.copy()]);
	var z = new subMapSector([y.copy(),y2.copy(),y2.copy(),y2.copy(),y2.copy(),y2.copy(),y2.copy(),y2.copy(),y2.copy(),
							 y4.copy(),y.copy(),y2.copy(),y2.copy(),y2.copy(),y2.copy(),y2.copy(),y2.copy(),y2.copy(),
							 y4.copy(),y4.copy(),y.copy(),y2.copy(),y2.copy(),y2.copy(),y2.copy(),y2.copy(),y2.copy(),
							 y4.copy(),y4.copy(),y4.copy(),y.copy(),y2.copy(),y2.copy(),y2.copy(),y2.copy(),y2.copy(),
							 y4.copy(),y4.copy(),y4.copy(),y4.copy(),y.copy(),y2.copy(),y2.copy(),y2.copy(),y2.copy(),
							 y4.copy(),y4.copy(),y4.copy(),y4.copy(),y4.copy(),y.copy(),y2.copy(),y2.copy(),y2.copy(),
							 y4.copy(),y4.copy(),y4.copy(),y4.copy(),y4.copy(),y4.copy(),y.copy(),y2.copy(),y2.copy(),
							 y4.copy(),y4.copy(),y4.copy(),y4.copy(),y4.copy(),y4.copy(),y4.copy(),y.copy(),y2.copy(),
							 y4.copy(),y4.copy(),y4.copy(),y4.copy(),y4.copy(),y4.copy(),y4.copy(),y4.copy(),y.copy()]);
	var z2 = new subMapSector([y4.copy(),y4.copy(),y4.copy(),y4.copy(),y4.copy(),y4.copy(),y4.copy(),y4.copy(),y4.copy(),
							  y4.copy(),y4.copy(),y4.copy(),y4.copy(),y4.copy(),y4.copy(),y4.copy(),y4.copy(),y4.copy(),
							  y4.copy(),y4.copy(),y4.copy(),y4.copy(),y4.copy(),y4.copy(),y4.copy(),y4.copy(),y4.copy(),
							  y4.copy(),y4.copy(),y4.copy(),y4.copy(),y4.copy(),y4.copy(),y4.copy(),y4.copy(),y4.copy(),
							  y4.copy(),y4.copy(),y4.copy(),y4.copy(),y4.copy(),y4.copy(),y4.copy(),y4.copy(),y4.copy(),
							  y4.copy(),y4.copy(),y4.copy(),y4.copy(),y4.copy(),y4.copy(),y4.copy(),y4.copy(),y4.copy(),
							  y4.copy(),y4.copy(),y4.copy(),y4.copy(),y4.copy(),y4.copy(),y4.copy(),y4.copy(),y4.copy(),
							  y4.copy(),y4.copy(),y4.copy(),y4.copy(),y4.copy(),y4.copy(),y4.copy(),y4.copy(),y4.copy(),
							  y4.copy(),y4.copy(),y4.copy(),y4.copy(),y4.copy(),y4.copy(),y4.copy(),y4.copy(),y4.copy()]);
	var z3 = new subMapSector([y2.copy(),y2.copy(),y2.copy(),y2.copy(),y2.copy(),y2.copy(),y2.copy(),y2.copy(),y2.copy(),
							  y2.copy(),y2.copy(),y2.copy(),y2.copy(),y2.copy(),y2.copy(),y2.copy(),y2.copy(),y2.copy(),
							  y2.copy(),y2.copy(),y2.copy(),y2.copy(),y2.copy(),y2.copy(),y2.copy(),y2.copy(),y2.copy(),
							  y2.copy(),y2.copy(),y2.copy(),y2.copy(),y2.copy(),y2.copy(),y2.copy(),y2.copy(),y2.copy(),
							  y2.copy(),y2.copy(),y2.copy(),y2.copy(),y2.copy(),y2.copy(),y2.copy(),y2.copy(),y2.copy(),
							  y2.copy(),y2.copy(),y2.copy(),y2.copy(),y2.copy(),y2.copy(),y2.copy(),y2.copy(),y2.copy(),
							  y2.copy(),y2.copy(),y2.copy(),y2.copy(),y2.copy(),y2.copy(),y2.copy(),y2.copy(),y2.copy(),
							  y2.copy(),y2.copy(),y2.copy(),y2.copy(),y2.copy(),y2.copy(),y2.copy(),y2.copy(),y2.copy(),
							  y2.copy(),y2.copy(),y2.copy(),y2.copy(),y2.copy(),y2.copy(),y2.copy(),y2.copy(),y2.copy()]);
	var z4 = new subMapSector([y3.copy(),y3.copy(),y3.copy(),y3.copy(),y3.copy(),y3.copy(),y3.copy(),y3.copy(),y3.copy(),
							  y2.copy(),y3.copy(),y3.copy(),y3.copy(),y3.copy(),y3.copy(),y3.copy(),y3.copy(),y3.copy(),
							  y2.copy(),y2.copy(),y3.copy(),y3.copy(),y3.copy(),y3.copy(),y3.copy(),y3.copy(),y3.copy(),
							  y2.copy(),y2.copy(),y2.copy(),y3.copy(),y3.copy(),y3.copy(),y3.copy(),y3.copy(),y3.copy(),
							  y2.copy(),y2.copy(),y2.copy(),y2.copy(),y3.copy(),y3.copy(),y3.copy(),y3.copy(),y3.copy(),
							  y2.copy(),y2.copy(),y2.copy(),y2.copy(),y2.copy(),y3.copy(),y3.copy(),y3.copy(),y3.copy(),
							  y2.copy(),y2.copy(),y2.copy(),y2.copy(),y2.copy(),y2.copy(),y3.copy(),y3.copy(),y3.copy(),
							  y2.copy(),y2.copy(),y2.copy(),y2.copy(),y2.copy(),y2.copy(),y2.copy(),y3.copy(),y3.copy(),
							  y2.copy(),y2.copy(),y2.copy(),y2.copy(),y2.copy(),y2.copy(),y2.copy(),y2.copy(),y3.copy()]);
	//var y = new subMapTile([x,x,x,x,x,x,x,x,x]);
	//var y2 = new subMapTile([x2,x2,x2,x2,x2,x2,x2,x2,x2]);
	//var z = new subMapSector([y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y,y]);
	//var z2 = new subMapSector([y2,y2,y2,y2,y2,y2,y2,y2,y2,y2,y2,y2,y2,y2,y2,y2,y2,y2,y2,y2,y2,y2,y2,y2,y2,y2,y2,y2,y2,y2,y2,y2,y2,y2,y2,y2,y2,y2,y2,y2,y2,y2,y2,y2,y2,y2,y2,y2,y2,y2,y2,y2,y2,y2,y2,y2,y2,y2,y2,y2,y2,y2,y2,y2,y2,y2,y2,y2,y2,y2,y2,y2,y2,y2,y2,y2,y2,y2,y2,y2,y2]);
	var v = new subMap([z.copy(),z3.copy(),z4.copy(),z2.copy(),z.copy(),z3.copy(),z2.copy(),z2.copy(),z.copy()]);
	var q = new subMap([z3.copy(),z3.copy(),z3.copy(),z3.copy(),z2.copy(),z3.copy(),z3.copy(),z2.copy(),z3.copy()]);
	var a = new tile(v);
	var e = new tile(q);
	var b = new row([a,e]);
	largeMap = new map([b]);
	var c = new city("Philadelphia",[20,3],[0,0],"USA");
	var d = new city("New York",[0,20],[0,1],"USA");
	var f = new city("Chicago",[26,5],[0,0],"USA");
	var g = new city("Ontario",[18,8],[0,0],"Canada");
	var h = new city("Moscow",[26,0],[0,1],"Russia");
	//var d = new city("testia2",[9,7],[0,0]);
	//var e = new city("testia3",[2,0],[0,0]);
	drawMap();
	//openSubMap([0,0]);
	//var z = new subMapTile([x,x,x,x,x,x,x,x]);
	//var v = new subMapTile([x,x,x,x,x,x,x,x,w]);
}