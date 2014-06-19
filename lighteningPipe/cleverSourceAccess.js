'use strict';
var qtools=require('qtools'),
	qtools=new qtools(module),
	events = require('events'), 
	util=require('util'),
	qs = require('qs'),
	request = require("request");

//START OF moduleFunction() ============================================================

var moduleFunction=function(args){
		events.EventEmitter.call(this);
		var self = this,
			forceEvent = function(eventName, outData) {
				this.emit(eventName, {
					eventName: eventName,
					data: outData
				});
			},
		
		executeGet=function(){
			self.request.get({
			uri:'https://api.clever.com/v1.1/schools',
			json:{},
			headers:{
				Authorization: 'Bearer DEMO_TOKEN'
			}
			},
			function(err, response){
				qtools.dump(response.body);
			})
		}
		

		//INITIALIZE OBJECT ====================================

		this.args=args;
		
		this.executeGet=executeGet;
		
		this.request = request.defaults({
			jar: true
		});
		
		this.ping=function(){
			console.log('hello');
		}
			
		//BUILD RETURN OBJECT ====================================

		this.forceEvent = forceEvent;
		return this;
	};

//END OF moduleFunction() ============================================================

util.inherits(moduleFunction, events.EventEmitter);
module.exports=moduleFunction;