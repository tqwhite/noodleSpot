'use strict';
var qtools=require('qtools'),
	qtools=new qtools(module),
	qtools=new qtools(module),
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
			var outObj={};
	
			var hoistedPropertyName='maps', destName='targetMap';
				if (typeof(self.definitions[definitionName][hoistedPropertyName])!='undefined' && typeof(self.definitions[definitionName][hoistedPropertyName][this.target])!='undefined'){
					outObj[destName]=self.definitions[definitionName][hoistedPropertyName][this.target];
				}
				else{ outObj[destName]={}; }
			
			var hoistedPropertyName='assembler', destName='targetAssembler';
				if (typeof(self.definitions[definitionName][hoistedPropertyName])!='undefined' && typeof(self.definitions[definitionName][hoistedPropertyName][this.target])!='undefined'){
					outObj[destName]=self.definitions[definitionName][hoistedPropertyName][this.target];
				}
				else{ outObj[destName]={}; }
			
			var hoistedPropertyName='translation', destName='targetTranslation';
				if (typeof(self.definitions[definitionName][hoistedPropertyName])!='undefined' && typeof(self.definitions[definitionName][hoistedPropertyName][this.target])!='undefined'){
					outObj[destName]=self.definitions[definitionName][hoistedPropertyName][this.target];
				}
				else{ outObj[destName]={}; }
			

			outObj.getFieldNamesFrom=qtools.clone(self.definitions[definitionName].getFieldNamesFrom);
			outObj.fieldList=qtools.clone(self.definitions[definitionName].fieldList);
			outObj.sourceFieldList=qtools.clone(self.definitions[definitionName].fieldList);
			
			if (self.firstLineOfFile){ outObj.fieldList="firstLineOfFile" };
			
			outObj.skipFirstLine=self.skipFirstLine;
			
			
			return outObj;
		}
		this.forceEvent = forceEvent;
		return this;
	};

//END OF moduleFunction() ============================================================

util.inherits(moduleFunction, events.EventEmitter);
module.exports=moduleFunction;