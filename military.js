//unit types: infantry, cavalry, artillery, tank, armored, motorized

var division = function(manpower,unitType){
	if(typeof manpower != "number" || manpower.isNaN()){
		throw "Error! Manpower must be a valid number."
	}
	this.manpower = manpower;
	this.buffness = buffage.defaultBuff();
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