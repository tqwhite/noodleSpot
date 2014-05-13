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
	console.log(module.filename);
		this.args=args;
		
	qtools.message='nestedJson';	
	
// 		qtools.validateProperties({
// 			targetObject:options,
// 			targetScope: this, //will add listed items to targetScope
// 			propList:[
// 				{name:'sliderParms', optional:true}
// 
// 			],
// 			source:this.constructor._fullName
// 		});
//  	
//  	
// 		"linkPropertyName":"Parent",
// 		"destPropertyObjectName":"PropertyName",
// 		"destPropertyObjectPropertyName":""
						
		//BUILD RETURN OBJECT ====================================

		this.forceEvent = forceEvent;
		
		

		this.action=function(sourceObjectList){ 
			var outList=[];
console.log('qtools.message='+qtools.message+'\n');		
			for (var i=0, len=sourceObjectList.length; i<len; i++){
				var element=sourceObjectList[i];
				
				
				

			}
			
		}



		return this;
	};

//END OF moduleFunction() ============================================================

util.inherits(moduleFunction, events.EventEmitter);
module.exports=moduleFunction;