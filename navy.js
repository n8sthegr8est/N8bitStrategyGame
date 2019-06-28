//Ship Types: transport, warship, merchant ship?, Flag ship

var transportShipIcon = '☼';
var warshipIcon = '○';
var flagshipIcon = '⌂';
var defaultShipIcon = '■';

//sailPower = manpower, but for boats
var ship = function(sailPower,type){
	
	/*this.deploy = () => {
		
	}*/
	
	this.hasCapacity = () => {
		if(this.type!="transport"){
			return false;
		}
		if(this.unitsAboard.length < this.carryingCap){
			return true;
		}
		return false;
	}
	
	this.letAboard = (troop) => {
		this.unitsAboard.push(troop);
	}
	
	this.getIcon = () => {
		if(this.type == "transport"){
			return transportShipIcon;
		}
		else if(this.type == "warship"){
			return warshipIcon;
		}
		else if(this.type == "flagship"){
			return flagshipIcon;
		}
		else{
			return defaultShipIcon;
		}
	}
	
	this.type = type;
	this.sailPower = sailPower;
	this.attackPower = 0;
	this.defendPower = 0;
	if(this.type=="transport"){
		this.carryingCap = 5;
		this.unitsAboard = [];
		this.attackPower = 1;
		this.defendPower = 1;
	}
	else if(this.type=="warship"){
		this.attackPower = 7;
		this.defendPower = 5;
	}
	else if(this.type=="flagship"){
		this.attackPower = 5;
		this.defendPower = 10;
	}
	var modify = Math.floor(sailPower/20);
	modify = (modify >= 1 ? modify : 1);
	this.attackPower *= modify;
	this.defendPower *= modify;
}