'use strict';
var qtools=require('qtools'),
	qtools=new qtools(module),
	events = require('events'), 
	util=require('util'),
	qs=require('qs'),
	request = require("request");

//START OF moduleFunction() ============================================================

var moduleFunction=function(){
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
			callback();
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
				var errorMessage=ebErrorStatus.errorMessage;
				
				if (typeof(callback)=='function'){ callback(ebErrorStatus.success?false:ebErrorStatus, response, body);}
			});
	},
	
	executePost=function(path, payload, callback){
		self.payload=payload;
		var wrappedPayload=wrapDataForServer({data:payload}); //<--- NOTE: Wraps payload
			self.document(wrappedPayload);
	
		if (self.dryRun){
			console.log('\n\n\n=======================================================\n');
			console.log('payload length='+wrappedPayload.postData.length+'');
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
				
				var ebErrorStatus=extractEbErrorStatus(response);
				
				if (typeof(callback)=='function'){ callback(response);}
				
				if (!ebErrorStatus.success){
					qtools.die(ebErrorStatus);
				}
			});
	
	},
	
	extractEbErrorStatus=function(response){
		var ebExtract=response.body.match(/"StatusCode": (.*?),/);
		 var ebStatusCode=ebExtract?ebExtract[1]:'no application data';
		var responseStatusCode=response.statusCode;
		var errorMsgExtract=response.body.match(/<title>(.*?)</);
		 var errorMessage=errorMsgExtract?errorMsgExtract[1]:'';
		 
		var processWorked=(ebStatusCode=='1' && responseStatusCode=='200');
		return {
			success:processWorked,
			responseStatusCode:responseStatusCode,
			errorMessage:errorMessage,
			ebStatusCode:ebStatusCode
		}
	}

//BUILD RETURN OBJECT ====================================

	this.start=function(args){
		self.dryRun=args.dryRun||false;
		self.baseUrl=args.baseUrl;
		login(args.userId, args.password, args.loginCallback);
	};
	
	this.document=function(item){
			if (!self.transcript){self.transcript=[];}
			self.transcript.push(item);
		};
	
	this.saveList=function(saveObj, destPath, callback){

		var list=saveObj.standardsList;
		for (var i=0, len=list.length; i<len; i++){
			var element=list[i];

			var data=saveObj.wrapperFunction(element);
qtools.displayJson(data);
			executePost(destPath, data, callback);
		}
		
	}
	
	this.saveStudentsORIG=function(saveObj, destPath, callback){

		var list=saveObj;
		for (var i=0, len=list.length; i<len; i++){
			var element=list[i];

			var data=element;

			executePost(destPath, data, callback);
		}
		
	}
	
	this.saveCompletedObject=function(saveObj, destPath, callback){
	
			executePost(destPath, saveObj, callback);
		
	}
	
	this.pingApiEndpoint=function(controlObj){
			var pingCallback=function(response){
				self.writeResultMessages(response);
				qtools.die();
			}

			executePost(controlObj.apiEndpoint, {ping:'expressbookAccess.js sent me'}, pingCallback);
	}
	
	this.writeResultMessages=function(response){
		var ebErrorStatus=extractEbErrorStatus(response);
		var statusCode=ebErrorStatus.ebStatusCode;
		var errorMessage=ebErrorStatus.errorMessage;
		var outString='';
		
		var time=new Date();

		outString+='\n\n\n=======================================================\n'+time+'/n';
		outString+='\nresponse.statusCode='+response.statusCode;
		outString+='\nresponse.statusMessage='+response.statusMessage;
		outString+='\nresponse.Data='+response.Data;
		if (errorMessage){outString+='\nerrorMessage='+errorMessage;}
		outString+='\nexpressbook.statusCode='+statusCode;
		if (!errorMessage){
		outString+='\nresponse.body='+util.inspect(JSON.parse(response.body), {colors:true});}
		outString+='\n'+time+'\n=======================================================\n\n\n';

		console.log(outString);
	}

	this.forceEvent = forceEvent;

//INITIALIZE OBJECT ====================================


	this.request=request.defaults({jar: true});

	return this;
	};

//END OF moduleFunction() ============================================================

util.inherits(moduleFunction, events.EventEmitter);
module.exports=moduleFunction;