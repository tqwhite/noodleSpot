'use strict';
/*
	var testCallback=function(inData){console.log('**** '+inData);}
	var someVarName=new whateverThisIsCalled(100, 50, testCallback);
	whateverThisIsCalled.on('test' function(inData){console.dir(inData);}); whateverThisIsCalled.forceEvent('test');
	..and, obviously, remove a, b, c and add in the real world
*/

var events = require('events'), 
util=require('util');

//START OF moduleFunction() ============================================================

var moduleFunction=function(){
	events.EventEmitter.call(this);

var self=this,

	validPassword=function(password){
		if (password==self.password){
			return true
		}
		else{
			return false;
		}
	},
	
	userList={
		USERX:{username:'USERX', password:'PASSX'},
		tqwhite:{username:'tqwhite', password:'password'}
	},

	findOne=function(loginUser, callback){
		var user=userList[loginUser.username];
		this.username=user.username;
		this.password=user.password;
		return callback('', self);
	},
	
	forceEvent=function(eventName, outData){
		this.emit(eventName, {eventName:eventName, data:outData});
	}

//BUILD RETURN OBJECT ====================================

	this.findOne=findOne;
	this.validPassword=validPassword;

	this.forceEvent=forceEvent;
	
return this;


};

//END OF moduleFunction() ============================================================

util.inherits(moduleFunction, events.EventEmitter);
module.exports=moduleFunction;