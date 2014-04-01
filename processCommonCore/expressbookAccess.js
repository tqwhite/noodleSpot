'use strict';
var qtools=require('qtools'),
	events = require('events'), 
	util=require('util'),
	qs=require('qs'),
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

	wrapDataForServer=function(args){
		var outObj, today;
		outObj={};

		if (args && (args.data || args.Data)){
			outObj.Data= args.data || args.Data;
		}
		else{
			outObj.Data={empty:true};
		}

		outObj.Date = new Date();
		outObj.postData=JSON.stringify(outObj);

		self.document(outObj);

		return outObj;
	},

	login=function(userId, password, callback){

		var payload={"Data":{"UserName":userId,"Password":password}};
		
		var wrappedPayload=wrapDataForServer(payload);
			self.document(wrappedPayload);


// var payload={"Data":{"UserName":"coordinator","Password":"test"},"Date":"2014-03-03T22:10:19.511Z"};
// var jsonPayload=JSON.stringify(payload);
// var wrappedPayload={postData:jsonPayload};

		if(self.dryRun){
			setTimeout(function(){callback('', {}, 'dry run', self);}, 500); //process.nextTick() beat the file system callback in the outer universe
			return;
		}


		self.request.post({
			headers:{
				'Content-Type' : 'application/x-www-form-urlencoded'
			},
			uri: self.baseUrl+"/data/UserState/Login",
			form:    wrappedPayload
			}, function(error, response, body){
				self.isLoggedIn=true;
				self.document(response);
				
				
				var ebErrorStatus=extractEbErrorStatus(response);
				var statusCode=ebErrorStatus.statusCode;
				var errorMessage=ebErrorStatus.errorMessage;
		
				if (typeof(callback)=='function'){ callback(errorMessage, response, body);}
			});
	},
	
	executePost=function(path, payload, callback){
		self.payload=payload;
		var wrappedPayload=wrapDataForServer({data:payload});
			self.document(wrappedPayload);
	
		if (self.dryRun){
			console.log('\n\n\n=======================================================\n');
			console.log('payload length='+wrappedPayload.postData.length+'');
			if (self.dumpJson){console.log(JSON.stringify(self.payload));}
			console.log('\n==============  NOT WRITING TO EB (add --forReal )  ======================\n'); return;
		}
		
		self.request.post({
			headers:{
				'Content-Type' : 'application/x-www-form-urlencoded'
			},
			uri: self.baseUrl+path,
			form:    wrappedPayload
			}, function(error, response, body){

				self.document(response);
				if (typeof(callback)=='function'){ callback(response);}
			});
	
	},

	init=function(args){
		self.dryRun=args.dryRun||false;
		self.dumpJson=args.dumpJson||false;
		self.baseUrl=args.baseUrl;
		login(args.userId, args.password, args.loginCallback);
	},
	
	extractEbErrorStatus=function(response){
		return {
			statusCode:response.body.match(/("StatusCode": .*?),/),
			errorMessage:response.body.match(/<title>.*?</)
		}
	}

//BUILD RETURN OBJECT ====================================

	this.document=function(item){
			if (!self.transcript){self.transcript=[];}
			self.transcript.push(item);
		};
	
	this.saveList=function(saveObj, callback){

		var list=saveObj.standardsList;
		for (var i=0, len=list.length; i<len; i++){
			var element=list[i];

			var data=saveObj.wrapperFunction(element);

			var destPath='/data/District/SaveRealms';
			executePost(destPath, data, callback);
		}
		
	}
	
	this.saveStudents=function(saveObj, callback){
	
		console.log('savingStudents');
	}
	
	this.writeResultMessages=function(response){
		var ebErrorStatus=extractEbErrorStatus(response);
		var statusCode=ebErrorStatus.statusCode;
		var errorMessage=ebErrorStatus.errorMessage;
		var outString;
		
		var time=new Date();
		if (self.dumpJson){
			outString+='\n\n\n=======================================================\n'+time+'/n/n';
			outString+=JSON.stringify(self.payload);
		}
		outString+='\n\n\n=======================================================\n'+time+'/n';
		outString+='response.statusCode='+response.statusCode;
		outString+='response.statusMessage='+response.statusMessage;
		if (errorMessage){outString+='errorMessage='+errorMessage;}
		outString+='expressbook.statusCode='+statusCode;
		outString+='\n'+time+'\n=======================================================\n\n\n';
		
		console.log(outString);
	}

	this.forceEvent = forceEvent;

//INITIALIZE OBJECT ====================================

	this.args=args;
	this.request=request.defaults({jar: true})
	init(this.args);

	return this;
	};

//END OF moduleFunction() ============================================================

util.inherits(moduleFunction, events.EventEmitter);
module.exports=moduleFunction;