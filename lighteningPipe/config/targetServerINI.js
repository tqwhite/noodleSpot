'use strict';
var qtools=require('qtools'),
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

		this.args=args;
		
		this.loginInfo=function(){
			return{	
				baseUrl: 'http://expressbook.local',
				userId: 'coordinator',
				password: 'test'
			};
		
		}
			
		//BUILD RETURN OBJECT ====================================

		this.forceEvent = forceEvent;
		return this;
	};

//END OF moduleFunction() ============================================================

util.inherits(moduleFunction, events.EventEmitter);
module.exports=moduleFunction;