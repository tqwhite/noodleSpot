'use strict';
var qtools=require('qtools'),
	events = require('events'), 
	util=require('util');

//START OF moduleFunction() ============================================================

var moduleFunction=function(args){
		events.EventEmitter.call(this);
		var self = this,
			forceEvent = function(eventName, outData) {
				this.emit(eventName, {
					eventName: eventName,
					data: outData
				});
			}

		//INITIALIZE OBJECT ====================================
		
		var filePath="./"+args.dictionaryName+".js";
		this.definitions=require(filePath);
			
		//BUILD RETURN OBJECT ====================================
		this.target=args.target;
	
		if (args.skipFirstLine){
				this.skipFirstLine=true;
			}
			else{
				this.skipFirstLine=false;
			}

		this.get=function(definitionName){
			self.definitions[definitionName].targetMap=self.definitions[definitionName].maps[this.target];
		
			if (typeof(self.definitions[definitionName].translation)!='undefined' && typeof(self.definitions[definitionName].translation[this.target])!='undefined'){
			self.definitions[definitionName].targetTranslation=self.definitions[definitionName].translation[this.target];
			}
			else{
				self.definitions[definitionName].targetTranslation={};
			}
			self.definitions[definitionName].sourceFieldList=qtools.clone(self.definitions[definitionName].fieldList);
			
			if (self.firstLineOfFile){
				self.definitions[definitionName].fieldList="firstLineOfFile"
			}
			var outObj=self.definitions[definitionName];
			outObj.skipFirstLine=self.skipFirstLine;
			return outObj;
		}
		this.forceEvent = forceEvent;
		return this;
	};

//END OF moduleFunction() ============================================================

util.inherits(moduleFunction, events.EventEmitter);
module.exports=moduleFunction;