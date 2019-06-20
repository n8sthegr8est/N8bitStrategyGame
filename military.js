//unit types: infantry, cavalry, artillery, tank, armored, motorized

var infantryDivisionIcon = '♠';
var cavalryDivisionIcon = '♥';
var artilleryDivisionIcon = '♣';
var defaultDivisionIcon = '■';

var division = function(manpower,unitType){
	this.deploy = (city) => {
		this.position = [city.largeLoc[0],city.largeLoc[1],city.sect,city.loc[1]%9,city.loc[0]%9,4];
		let myArr = largeMap.getTileOfID([this.position[0],this.position[1]]).subMap.sectors[this.position[2]].getTile(this.position[3],this.position[4]).troops.slice();
		myArr.splice(this.position[5],1,this);
		let x = this.position.slice();
		x.splice(x.length-1,1);
		largeMap.getTileOfID(city.largeLoc).subMap.sectors[city.sect].getTile(city.loc[1]%9,city.loc[0]%9).setTroops(myArr.slice(),x);
		//redrawTile([city.largeLoc[0],city.largeLoc[1],city.sect,city.loc[1]%9,city.loc[0]%9]);
	}
	
	this.disband = () => {
		var newTroopsArr = largeMap.getTileOfID([this.position[0],this.position[1]]).subMap.sectors[this.position[2]].getTile(this.position[3],this.position[4]).troops.slice();
		newTroopsArr.splice(this.position[5],1,undefined);
		this.manpower = 0;
		let x = this.position.slice();
		this.position = undefined;
		x.splice(x.length-1,1);
		redrawTile(x);
	}
	
	this.setMarchToCity = (city) => {
		this.destination = [city.largeLoc[0],city.largeLoc[1],city.sect,city.loc[1]%9,city.loc[0]%9,4];
		this.path = this.findOptimalPath();
		this.beginMarch();
	}
	
	this.setMarchToPart = (largeRow,largeCol,sect,subX,subY,part) => {
		this.destination = [largeRow,largeCol,sect,subX,subY,part];
		this.path = this.findOptimalPath();
		this.beginMarch();
	}
	
	//Note that armies can move in 8 directions.
	this.findOptimalPath = () => {
		return buildPath(this.position,this.destination);
	}
	
	this.beginMarch = () => {
		this.updater = setTimeout(this.March,1000);//in future, time out will change based on terrain current terrain favorability and maneuver buffness.
	}
	
	this.haltMarch = () => {
		clearTimeout(this.updater);
	}
	
	this.March = () => {
		var newTroopsArr = largeMap.getTileOfID([this.position[0],this.position[1]]).subMap.sectors[this.position[2]].getTile(this.position[3],this.position[4]).troops.slice();
		newTroopsArr.splice(this.position[5],1,undefined);
		let z = this.position.slice();
		z.splice(z.length-1,1);
		largeMap.getTileOfID([this.position[0],this.position[1]]).subMap.sectors[this.position[2]].getTile(this.position[3],this.position[4]).setTroops(newTroopsArr.slice(),z);
		this.position = this.path[0].slice();
		this.path.splice(0,1);
		newTroopsArr = largeMap.getTileOfID([this.position[0],this.position[1]]).subMap.sectors[this.position[2]].getTile(this.position[3],this.position[4]).troops.slice();
		newTroopsArr.splice(this.position[5],1,this);
		z = this.position.slice();
		z.splice(z.length-1,1);
		largeMap.getTileOfID([this.position[0],this.position[1]]).subMap.sectors[this.position[2]].getTile(this.position[3],this.position[4]).setTroops(newTroopsArr.slice(),z);
		if(this.hasReachedDestination()){
			this.destination = undefined;
			return;
		}
		else{
			this.updater = setTimeout(this.March,1000);//in future, time out will change based on terrain current terrain favorability and maneuver buffness.
		}
		//find the next tile in fastest path to destination, then go there.
	}
	
	this.hasReachedDestination = () => {
		for(let i = 0; i < this.destination.length; i++){
			if(this.destination[i]!=this.position[i]){
				return false;
			}
		}
		return true;
	}
	
	this.getIcon = () => {
		if(this.unitType == "infantry"){
			return infantryDivisionIcon;
		}
		else if(this.unitType == "cavalry"){
			return cavalryDivisionIcon;
		}
		else if(this.unitType == "artillery"){
			return artilleryDivisionIcon;
		}
		else{
			return defaultDivisionIcon;
		}
	}
	
	if(typeof manpower != "number"/* || manpower.isNaN()*/){
		throw "Error! Manpower must be a valid number."
	}
	this.manpower = manpower;
	this.destination = undefined;
	this.position = undefined;
	this.updater = undefined;//setTimeoutHandle
	this.path = [];//list of tiles to march to.
	this.unitType = unitType;
	//this.buffness = buffage.defaultBuff();
}

function buildPath(begin,end){
	var directions = [];
	var path = [begin.slice()];
	do{
		directions = getRelativePartLocation(path[path.length-1],end);
		if(directions.indexOf("above")!=-1){
			if(directions.indexOf("left")!=-1){
				let x = assessTerainFavor(getCoordUp(path[path.length-1]));
				let y = assessTerainFavor(getCoordLeft(path[path.length-1]));
				let z = assessTerainFavor(getCoordUpLeft(path[path.length-1]));
				if(x > y && x > z){//x is most favorable
					path.push(getCoordUp(path[path.length-1]));
				}
				else if(y > z && y > x){//y is most favorable
					path.push(getCoordLeft(path[path.length-1]));
				}
				else if(z < x && z < y){//z is less favorable than x and y which are equally favorable to each other.
					let w = Math.floor(Math.random()*2);
					if(w==0){
						path.push(getCoordUp(path[path.length-1]));
					}
					else {
						path.push(getCoordLeft(path[path.length-1]));
					}
				}
				else{//z is most favorable or all are equally favorable.
					path.push(getCoordUpLeft(path[path.length-1]));
				}
			}
			else if(directions.indexOf("right")!=-1){
				let x = assessTerainFavor(getCoordUp(path[path.length-1]));
				let y = assessTerainFavor(getCoordRight(path[path.length-1]));
				let z = assessTerainFavor(getCoordUpRight(path[path.length-1]));
				if(x > y && x > z){//x is most favorable
					path.push(getCoordUp(path[path.length-1]));
				}
				else if(y > z && y > x){//y is most favorable
					path.push(getCoordRight(path[path.length-1]));
				}
				else if(z < x && z < y){//z is less favorable than x and y which are equally favorable to each other.
					let w = Math.floor(Math.random()*2);
					if(w==0){
						path.push(getCoordUp(path[path.length-1]));
					}
					else {
						path.push(getCoordRight(path[path.length-1]));
					}
				}
				else{//z is most favorable or all are equally favorable.
					path.push(getCoordUpRight(path[path.length-1]));
				}
			}
			else{
				let x = assessTerainFavor(getCoordUpLeft(path[path.length-1]));
				let y = assessTerainFavor(getCoordUpRight(path[path.length-1]));
				let z = assessTerainFavor(getCoordUp(path[path.length-1]));
				if(x > y && x > z){//x is most favorable
					path.push(getCoordUpLeft(path[path.length-1]));
				}
				else if(y > z && y > x){//y is most favorable
					path.push(getCoordUpRight(path[path.length-1]));
				}
				else if(z < x && z < y){//z is less favorable than x and y which are equally favorable to each other.
					let w = Math.floor(Math.random()*2);
					if(w==0){
						path.push(getCoordUpLeft(path[path.length-1]));
					}
					else {
						path.push(getCoordUpRight(path[path.length-1]));
					}
				}
				else{//z is most favorable or all are equally favorable.
					path.push(getCoordUp(path[path.length-1]));
				}
			}
			/*check three tiles above to find most favorable terrain*/
			/*if none are favorable, check if faster path exists in other directions*/
			/*if all three are equally favorable, choose the one directly above (this is the default)*/
			/*add this tile to the path*/
		}
		else if(directions.indexOf("below")!=-1){
			if(directions.indexOf("left")!=-1){
				let x = assessTerainFavor(getCoordDown(path[path.length-1]));
				let y = assessTerainFavor(getCoordLeft(path[path.length-1]));
				let z = assessTerainFavor(getCoordDownLeft(path[path.length-1]));
				if(x > y && x > z){//x is most favorable
					path.push(getCoordDown(path[path.length-1]));
				}
				else if(y > z && y > x){//y is most favorable
					path.push(getCoordLeft(path[path.length-1]));
				}
				else if(z < x && z < y){//z is less favorable than x and y which are equally favorable to each other.
					let w = Math.floor(Math.random()*2);
					if(w==0){
						path.push(getCoordDown(path[path.length-1]));
					}
					else {
						path.push(getCoordLeft(path[path.length-1]));
					}
				}
				else{//z is most favorable or all are equally favorable.
					path.push(getCoordDownLeft(path[path.length-1]));
				}
			}
			else if(directions.indexOf("right")!=-1){
				let x = assessTerainFavor(getCoordDown(path[path.length-1]));
				let y = assessTerainFavor(getCoordRight(path[path.length-1]));
				let z = assessTerainFavor(getCoordDownRight(path[path.length-1]));
				if(x > y && x > z){//x is most favorable
					path.push(getCoordDown(path[path.length-1]));
				}
				else if(y > z && y > x){//y is most favorable
					path.push(getCoordRight(path[path.length-1]));
				}
				else if(z < x && z < y){//z is less favorable than x and y which are equally favorable to each other.
					let w = Math.floor(Math.random()*2);
					if(w==0){
						path.push(getCoordDown(path[path.length-1]));
					}
					else {
						path.push(getCoordRight(path[path.length-1]));
					}
				}
				else{//z is most favorable or all are equally favorable.
					path.push(getCoordDownRight(path[path.length-1]));
				}
			}
			else{
				let x = assessTerainFavor(getCoordDownLeft(path[path.length-1]));
				let y = assessTerainFavor(getCoordDownRight(path[path.length-1]));
				let z = assessTerainFavor(getCoordDown(path[path.length-1]));
				if(x > y && x > z){//x is most favorable
					path.push(getCoordDownLeft(path[path.length-1]));
				}
				else if(y > z && y > x){//y is most favorable
					path.push(getCoordDownRight(path[path.length-1]));
				}
				else if(z < x && z < y){//z is less favorable than x and y which are equally favorable to each other.
					let w = Math.floor(Math.random()*2);
					if(w==0){
						path.push(getCoordDownLeft(path[path.length-1]));
					}
					else {
						path.push(getCoordDownRight(path[path.length-1]));
					}
				}
				else{//z is most favorable or all are equally favorable.
					path.push(getCoordDown(path[path.length-1]));
				}
			}
		}
		else if(directions.indexOf("left")!=-1){
			let x = assessTerainFavor(getCoordDownLeft(path[path.length-1]));
			let y = assessTerainFavor(getCoordUpLeft(path[path.length-1]));
			let z = assessTerainFavor(getCoordLeft(path[path.length-1]));
			if(x > y && x > z){//x is most favorable
				path.push(getCoordDownLeft(path[path.length-1]));
			}
			else if(y > z && y > x){//y is most favorable
				path.push(getCoordUpLeft(path[path.length-1]));
			}
			else if(z < x && z < y){//z is less favorable than x and y which are equally favorable to each other.
				let w = Math.floor(Math.random()*2);
				if(w==0){
					path.push(getCoordDownLeft(path[path.length-1]));
				}
				else {
					path.push(getCoordUpLeft(path[path.length-1]));
				}
			}
			else{//z is most favorable or all are equally favorable.
				path.push(getCoordLeft(path[path.length-1]));
			}
		}
		else if(directions.indexOf("right")!=-1){
			let x = assessTerainFavor(getCoordDownRight(path[path.length-1]));
			let y = assessTerainFavor(getCoordUpRight(path[path.length-1]));
			let z = assessTerainFavor(getCoordRight(path[path.length-1]));
			if(x > y && x > z){//x is most favorable
				path.push(getCoordDownRight(path[path.length-1]));
			}
			else if(y > z && y > x){//y is most favorable
				path.push(getCoordUpRight(path[path.length-1]));
			}
			else if(z < x && z < y){//z is less favorable than x and y which are equally favorable to each other.
				let w = Math.floor(Math.random()*2);
				if(w==0){
					path.push(getCoordDownRight(path[path.length-1]));
				}
				else {
					path.push(getCoordUpRight(path[path.length-1]));
				}
			}
			else{//z is most favorable or all are equally favorable.
				path.push(getCoordRight(path[path.length-1]));
			}
		}
		//else if(/*destinationIsUpLeft*/){
			/*check tiles up-left, up, and left*/
			/*process same as above*/
			/*default: up-left*/
		//}
		//...
		//else{//destination is here or is undefined
			//push the current location to the path
		//}
	}while(directions.indexOf("Here")==-1);
	path.splice(0,1);
	return path;
}

function getCoordUp(unitLoc){
	var bigRow,bigCol,sect,subRow,subCol,part;
	if(isInTopSectorRow(unitLoc[5])){//is in top row of parts
		if(unitLoc[3]==0){//is in top row of current sector
			if(isInTopSectorRow(unitLoc[2])){//is in top row of subMap sectors
				//shouldn't need to ever check if at top of map, since area is impossible to reach, and will be seen as undefined long before this is ever called.
				bigRow = unitLoc[0]-1;//one subMap up.
				bigCol = unitLoc[1];//in the same subMap column
				sect = unitLoc[2]+6;//in the lowest sector of the same column
				subRow = 8;//in the last row of the sector
				subCol = unitLoc[4];//in the same column of the sector
				part = unitLoc[5]+6;//in the lowest part of the same column
			}
			else{
				bigRow = unitLoc[0];//in the same subMap row
				bigCol = unitLoc[1];//in the same subMap column
				sect = unitLoc[2]-3;//one sector up in same column
				subRow = 8;//in the last row of the sector
				subCol = unitLoc[4];//in the same column of the sector
				part = unitLoc[5]+6;//in the lowest part of the same column
			}
		}
		else{
			bigRow = unitLoc[0];//in the same subMap row
			bigCol = unitLoc[1];//in the same subMap column
			sect = unitLoc[2];//in the same sector
			subRow = unitLoc[3]-1;//one row up
			subCol = unitLoc[4];//in the same column of the sector
			part = unitLoc[5]+6;//in the lowest part of the same column
		}
	}
	else{
		bigRow = unitLoc[0];//in the same subMap row
		bigCol = unitLoc[1];//in the same subMap column
		sect = unitLoc[2];//in the same sector
		subRow = unitLoc[3];//in the same row
		subCol = unitLoc[4];//in the same column of the sector
		part = unitLoc[5]-3;//one part up
	}
	return [bigRow,bigCol,sect,subRow,subCol,part];
}

function getCoordDown(unitLoc){
	var bigRow,bigCol,sect,subRow,subCol,part;
	if(isInBottomSectorRow(unitLoc[5])){//is in bottom row of parts
		if(unitLoc[3]==8){//is in bottom row of current sector
			if(isInBottomSectorRow(unitLoc[2])){//is in bottom row of subMap sectors
				//shouldn't need to ever check if at bottom of map, since area is impossible to reach, and will be seen as undefined long before this is ever called.
				bigRow = unitLoc[0]+1;//one subMap down.
				bigCol = unitLoc[1];//in the same subMap column
				sect = unitLoc[2]-6;//in the highest sector of the same column
				subRow = 0;//in the first row of the sector
				subCol = unitLoc[4];//in the same column of the sector
				part = unitLoc[5]-6;//in the highest part of the same column
			}
			else{
				bigRow = unitLoc[0];//in the same subMap row
				bigCol = unitLoc[1];//in the same subMap column
				sect = unitLoc[2]+3;//one sector down in same column
				subRow = 0;//in the first row of the sector
				subCol = unitLoc[4];//in the same column of the sector
				part = unitLoc[5]-6;//in the highest part of the same column
			}
		}
		else{
			bigRow = unitLoc[0];//in the same subMap row
			bigCol = unitLoc[1];//in the same subMap column
			sect = unitLoc[2];//in the same sector
			subRow = unitLoc[3]+1;//one row down
			subCol = unitLoc[4];//in the same column of the sector
			part = unitLoc[5]-6;//in the highest part of the same column
		}
	}
	else{
		bigRow = unitLoc[0];//in the same subMap row
		bigCol = unitLoc[1];//in the same subMap column
		sect = unitLoc[2];//in the same sector
		subRow = unitLoc[3];//in the same row
		subCol = unitLoc[4];//in the same column of the sector
		part = unitLoc[5]+3;//one part down
	}
	return [bigRow,bigCol,sect,subRow,subCol,part];
}

function getCoordLeft(unitLoc){
	var bigRow,bigCol,sect,subRow,subCol,part;
	if(isInLeftSectorColumn(unitLoc[5])){//is in left column of parts
		if(unitLoc[4]==0){//is in left column of current sector
			if(isInLeftSectorColumn(unitLoc[2])){//is in left column of subMap sectors
				//shouldn't need to ever check if at left of map, since area is impossible to reach, and will be seen as undefined long before this is ever called.
				bigRow = unitLoc[0];//in the same subMap row
				bigCol = unitLoc[1]-1;//one subMap to the left
				sect = unitLoc[2]+2;//in the right-most sector of the same row
				subRow = unitLoc[3];//in the same row of the sector;
				subCol = 8;//in the last column of the sector
				part = unitLoc[5]+2;//in the right-most part of the same row
			}
			else{
				bigRow = unitLoc[0];//in the same subMap row
				bigCol = unitLoc[1];//in the same subMap column
				sect = unitLoc[2]-1;//one sector left in the same row
				subRow = unitLoc[3];//in the same row of the sector
				subCol = 8;//in the last column of the sector
				part = unitLoc[5]+2;//in the right-most part of the same row
			}
		}
		else{
			bigRow = unitLoc[0];//in the same subMap row
			bigCol = unitLoc[1];//in the same subMap column
			sect = unitLoc[2];//in the same sector
			subRow = unitLoc[3];//in the same row of the sector
			subCol = unitLoc[4]-1;//one column left
			part = unitLoc[5]+2;//in the right-most part of the same sector
		}
	}
	else{
		bigRow = unitLoc[0];//in the same subMap row
		bigCol = unitLoc[1];//in the same subMap column
		sect = unitLoc[2];//in the same sector
		subRow = unitLoc[3];//in the same row
		subCol = unitLoc[4];//in the same column of the sector
		part = unitLoc[5]-1;//one part left
	}
	return [bigRow,bigCol,sect,subRow,subCol,part];
}

function getCoordRight(unitLoc){
	var bigRow,bigCol,sect,subRow,subCol,part;
	if(isInRightSectorColumn(unitLoc[5])){//is in right column of parts
		if(unitLoc[4]==8){//is in right column of current sector
			if(isInRightSectorColumn(unitLoc[2])){//is in right column of subMap sectors
				//shouldn't need to ever check if at right of map, since area is impossible to reach, and will be seen as undefined long before this is ever called.
				bigRow = unitLoc[0];//in the same subMap row
				bigCol = unitLoc[1]+1;//one subMap to the right
				sect = unitLoc[2]-2;//in the left-most sector of the same row
				subRow = unitLoc[3];//in the same row of the sector;
				subCol = 0;//in the first column of the sector
				part = unitLoc[5]-2;//in the left-most part of the same row
			}
			else{
				bigRow = unitLoc[0];//in the same subMap row
				bigCol = unitLoc[1];//in the same subMap column
				sect = unitLoc[2]+1;//one sector right in the same row
				subRow = unitLoc[3];//in the same row of the sector
				subCol = 0;//in the first column of the sector
				part = unitLoc[5]-2;//in the left-most part of the same row
			}
		}
		else{
			bigRow = unitLoc[0];//in the same subMap row
			bigCol = unitLoc[1];//in the same subMap column
			sect = unitLoc[2];//in the same sector
			subRow = unitLoc[3];//in the same row of the sector
			subCol = unitLoc[4]+1;//one column right
			part = unitLoc[5]-2;//in the left-most part of the same sector
		}
	}
	else{
		bigRow = unitLoc[0];//in the same subMap row
		bigCol = unitLoc[1];//in the same subMap column
		sect = unitLoc[2];//in the same sector
		subRow = unitLoc[3];//in the same row
		subCol = unitLoc[4];//in the same column of the sector
		part = unitLoc[5]+1;//one part right
	}
	return [bigRow,bigCol,sect,subRow,subCol,part];
}

function getCoordUpLeft(unitLoc){
	return getCoordLeft(getCoordUp(unitLoc));
}
function getCoordDownLeft(unitLoc){
	return getCoordLeft(getCoordDown(unitLoc));
}
function getCoordUpRight(unitLoc){
	return getCoordRight(getCoordUp(unitLoc));
}
function getCoordDownRight(unitLoc){
	return getCoordRight(getCoordDown(unitLoc));
}

function getRelativePartLocation(unitLoc,partLoc){//locations are organized as [largeMapRow,largeMapCol,sectorOfThisMapTile,sectorRow,sectorColumn,partOfThisSubMapTile]
	var isAbove, isBelow, isLeft, isRight;
	isAbove = false;
	isBelow = false;
	isLeft = false;
	isRight = false;
	if(partLoc[0]<unitLoc[0]){
		isAbove = true;
	}
	else if(partLoc[0]>unitLoc[0]){
		isBelow = true;
	}
	
	if(partLoc[1]<unitLoc[1]){
		isLeft = true;
	}
	else if(partLoc[1]>unitLoc[1]){
		isRight = true;
	}
	
	if(!isAbove && !isBelow){
		if(isInBottomSectorRow(unitLoc[2]) && !isInBottomSectorRow(partLoc[2])){
			isAbove = true;
		}
		else if(isInMiddleSectorRow(unitLoc[2]) && isInTopSectorRow(partLoc[2])){
			isAbove = true;
		}
		else if(isInTopSectorRow(unitLoc[2]) && !isInTopSectorRow(partLoc[2])){
			isBelow = true;
		}
		else if(isInMiddleSectorRow(unitLoc[2]) && isInBottomSectorRow(partLoc[2])){
			isBelow = true;
		}
	}
	
	if(!isLeft && !isRight){
		if(isInLeftSectorColumn(unitLoc[2]) && !isInLeftSectorColumn(partLoc[2])){
			isRight = true;
		}
		else if(isInMiddleSectorColumn(unitLoc[2]) && isInRightSectorColumn(partLoc[2])){
			isRight = true;
		}
		else if(isInRightSectorColumn(unitLoc[2]) && !isInRightSectorColumn(partLoc[2])){
			isLeft = true;
		}
		else if(isInMiddleSectorColumn(unitLoc[2]) && isInLeftSectorColumn(partLoc[2])){
			isLeft = true;
		}
	}
	
	if(!isAbove && !isBelow){
		if(partLoc[3]<unitLoc[3]){
			isAbove = true;
		}
		else if(partLoc[3]>unitLoc[3]){
			isBelow = true;
		}
	}
	
	if(!isLeft && !isRight){
		if(partLoc[4]<unitLoc[4]){
			isLeft = true;
		}
		else if(partLoc[4]>unitLoc[4]){
			isRight = true;
		}
	}
	
	if(!isAbove && !isBelow){
		if(isInBottomSectorRow(unitLoc[5]) && !isInBottomSectorRow(partLoc[5])){
			isAbove = true;
		}
		else if(isInMiddleSectorRow(unitLoc[5]) && isInTopSectorRow(partLoc[5])){
			isAbove = true;
		}
		else if(isInTopSectorRow(unitLoc[5]) && !isInTopSectorRow(partLoc[5])){
			isBelow = true;
		}
		else if(isInMiddleSectorRow(unitLoc[5]) && isInBottomSectorRow(partLoc[5])){
			isBelow = true;
		}
	}
	
	if(!isLeft && !isRight){
		if(isInLeftSectorColumn(unitLoc[5]) && !isInLeftSectorColumn(partLoc[5])){
			isRight = true;
		}
		else if(isInMiddleSectorColumn(unitLoc[5]) && isInRightSectorColumn(partLoc[5])){
			isRight = true;
		}
		else if(isInRightSectorColumn(unitLoc[5]) && !isInRightSectorColumn(partLoc[5])){
			isLeft = true;
		}
		else if(isInMiddleSectorColumn(unitLoc[5]) && isInLeftSectorColumn(partLoc[5])){
			isLeft = true;
		}
	}
	
	var endRes = []
	if(!isAbove && !isBelow && !isLeft && !isRight){
		endRes.push("Here");
	}
	else{
		if(isAbove){
			endRes.push("above");
		}
		else if(isBelow){
			endRes.push("below");
		}
		if(isLeft){
			endRes.push("left");
		}
		else if(isRight){
			endRes.push("right");
		}
	}
	
	return endRes;
}

function isInBottomSectorRow(sect){//these also work for parts!
	if(sect < 6){
		return false;
	}
	return true;
}

function isInMiddleSectorRow(sect){
	if(sect < 3 || sect > 5){
		return false;
	}
	return true;
}

function isInTopSectorRow(sect){
	if(sect > 2){
		return false;
	}
	return true;
}

function isInLeftSectorColumn(sect){
	if(sect%3==0){
		return true;
	}
	return false;
}

function isInMiddleSectorColumn(sect){
	if(sect%3==1){
		return true;
	}
	return false;
}

function isInRightSectorColumn(sect){
	if(sect%3==2){
		return true;
	}
	return false;
}

function assessTerainFavor(tile){
	//add later. It depends on development and terrain.
	var x = largeMap.getTileOfID([tile[0],tile[1]]).subMap.sectors[tile[2]].getTile(tile[3],tile[4]).parts[tile[5]].terrainType;
	if(x=="seawater"||x=="lakewater"){
		return 0;
	}
	else{
		return 1;//1 is best favorability, 0 is worst.
	}
}

var buffage = function(){
	this.applyStrength = (unitStrength) => {
		for(let i = 0; i < unitStrength.length; i++){
			unitStrength[i] *= (this.strengths[i]/100);
		}
	}
	
	this.defaultBuff = () => {
		var hold = new buffage();
		return hold;
	}
	
	this.applyBuffs = (buffs) => {
		for(let i = 0; i < buffs.length; i++){
			this.strengths[i] += buffs[i];
		}
	}
	
	this.strengths = [100,100,100];//attack,defense,maneuver
}