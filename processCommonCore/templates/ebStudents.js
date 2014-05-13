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
		//this is a working exemplar extracted from the UI.
		this.rawJsonString='{"RefId":"5ddb2c37-7644-4526-8bc5-91586ef27456","Realm":[{"$type":"DatabaseModel.Models.Realm","AbbrevTitle":"realm","DepthCount":"2","DepthNames":[{"RefId":"d768434a-0eef-42b5-8e24-7518a6d1786c","Sequence":10,"Title":"Level 1","Delete":false,"SequenceNum":0},{"RefId":"2fcc7906-3819-4960-b14a-f07f5d5c2e8b","Sequence":20,"Title":"Level 2","Delete":false,"SequenceNum":10}],"Description":"","IsDetailed":true,"Standards":[{"$type":"DatabaseModel.Models.Standard","AbbrevTitle":"","Activities":[],"Applicability":[],"Components":[{"$type":"DatabaseModel.Models.Standard","AbbrevTitle":"","Activities":[{"$type":"DatabaseModel.Models.Activity","AbbrevTitle":"","Activities":[],"Applicability":[],"CompulsionLevel":{"RefId":"37f28d0b-d763-4585-a2ff-13381d7a5cbc"},"Description":"","IsDetailed":true,"MarkScale":{"RefId":"54cf207d-c4bc-4d01-a763-c02f13de92bc"},"RefId":"35bab809-ec96-43b7-bb9f-5534b71cf966","SequenceNum":1000,"Standard":{},"Terms":[{"RefId":"042b7f04-3a82-4c35-b928-e4f134b7f35a"},{"RefId":"8fe7914b-0fe9-4d2d-af1f-a0de7be8b816"},{"RefId":"f48d9c47-3a04-4402-8c1d-af4414e077eb"}],"Title":"nested activity","CanDelete":true,"CreateNew":true,"_dirty":1,"_new":true,"_fresh":2,"ExportCode":"","ImportCode":"","SuppressDisplay":false}],"Applicability":[{"RefId":"e443d58f-df7d-4ed3-9030-784ac3263159"},{"RefId":"9acf0f03-d28a-44de-b212-b6984c02ead7"},{"RefId":"7f1df983-3fc0-4264-9c5f-0fb7add9f560"},{"RefId":"ae5e8d0b-6ff3-4b6f-a756-bdd4f55cbe2f"},{"RefId":"323699f2-b039-484d-8486-8211fb7460cb"},{"RefId":"db342d23-59f7-491e-96d3-5050938ace27"},{"RefId":"f49f5032-fc53-4764-8597-dda0c2e2f627"}],"Components":[],"Description":"","IsDetailed":true,"MarkScale":{},"ParentStandard":{},"Title":"second complex standard","RefId":"64bd0e61-dd5a-45fa-8c07-df1c3dbb5b75","SequenceNum":"1000","Specialties":[{"RefId":"04acf1b9-5b34-4d22-9f1b-e8dfea6a35c5"}],"Terms":[{"RefId":"042b7f04-3a82-4c35-b928-e4f134b7f35a"},{"RefId":"8fe7914b-0fe9-4d2d-af1f-a0de7be8b816"},{"RefId":"f48d9c47-3a04-4402-8c1d-af4414e077eb"}],"CanDelete":true,"CreateNew":true,"_dirty":1,"_new":true,"_fresh":0,"ExportCode":"","SuppressDisplay":false}],"Description":"","IsDetailed":true,"MarkScale":{},"ParentStandard":{},"Title":"first complex standard","RefId":"2b996be4-7bd7-40e5-ad40-785dc805abec","SequenceNum":"1000","Specialties":[{"RefId":"04acf1b9-5b34-4d22-9f1b-e8dfea6a35c5"}],"Terms":[{"RefId":"042b7f04-3a82-4c35-b928-e4f134b7f35a"},{"RefId":"8fe7914b-0fe9-4d2d-af1f-a0de7be8b816"},{"RefId":"f48d9c47-3a04-4402-8c1d-af4414e077eb"}],"CanDelete":true,"CreateNew":true,"_dirty":2,"_new":true,"_fresh":0,"ExportCode":"","SuppressDisplay":false},{"$type":"DatabaseModel.Models.Standard","AbbrevTitle":"","Activities":[{"$type":"DatabaseModel.Models.Activity","AbbrevTitle":"","Activities":[],"Applicability":[{"RefId":"e443d58f-df7d-4ed3-9030-784ac3263159"},{"RefId":"9acf0f03-d28a-44de-b212-b6984c02ead7"},{"RefId":"7f1df983-3fc0-4264-9c5f-0fb7add9f560"},{"RefId":"ae5e8d0b-6ff3-4b6f-a756-bdd4f55cbe2f"},{"RefId":"323699f2-b039-484d-8486-8211fb7460cb"},{"RefId":"db342d23-59f7-491e-96d3-5050938ace27"},{"RefId":"f49f5032-fc53-4764-8597-dda0c2e2f627"}],"CompulsionLevel":{"RefId":"37f28d0b-d763-4585-a2ff-13381d7a5cbc"},"Description":"","IsDetailed":true,"MarkScale":{"RefId":"54cf207d-c4bc-4d01-a763-c02f13de92bc"},"RefId":"e59b29cd-f955-4864-81a2-2f42fa137304","SequenceNum":1000,"Standard":{},"Terms":[{"RefId":"042b7f04-3a82-4c35-b928-e4f134b7f35a"},{"RefId":"8fe7914b-0fe9-4d2d-af1f-a0de7be8b816"},{"RefId":"f48d9c47-3a04-4402-8c1d-af4414e077eb"}],"Title":"mon PM1 activity","CanDelete":true,"CreateNew":true,"_dirty":1,"_new":true,"_fresh":2,"ExportCode":"","ImportCode":"","SuppressDisplay":false}],"Applicability":[{"RefId":"e443d58f-df7d-4ed3-9030-784ac3263159"},{"RefId":"9acf0f03-d28a-44de-b212-b6984c02ead7"},{"RefId":"7f1df983-3fc0-4264-9c5f-0fb7add9f560"},{"RefId":"ae5e8d0b-6ff3-4b6f-a756-bdd4f55cbe2f"},{"RefId":"323699f2-b039-484d-8486-8211fb7460cb"},{"RefId":"db342d23-59f7-491e-96d3-5050938ace27"},{"RefId":"f49f5032-fc53-4764-8597-dda0c2e2f627"}],"Components":[],"Description":"","IsDetailed":true,"MarkScale":{},"ParentStandard":{},"Title":"mon PM2 standard","RefId":"5b826431-1d6a-4a1e-99fb-856e434e249f","SequenceNum":"1000","Specialties":[{"RefId":"04acf1b9-5b34-4d22-9f1b-e8dfea6a35c5"},{"RefId":"342c5412-8e09-4d2d-b11a-f76a3ead9a93"}],"Terms":[{"RefId":"042b7f04-3a82-4c35-b928-e4f134b7f35a"},{"RefId":"8fe7914b-0fe9-4d2d-af1f-a0de7be8b816"},{"RefId":"f48d9c47-3a04-4402-8c1d-af4414e077eb"}],"CanDelete":true,"CreateNew":true,"_dirty":2,"_new":true,"_fresh":0,"ExportCode":"","SuppressDisplay":false}],"Title":"Common Core DemoX","RefId":"dd537a35-f1dc-4e75-9b0a-54310cc0e3d0","CanDelete":true,"CreateNew":true,"_new":true,"_fresh":1,"SuppressDisplay":false}]}';

		this.completeObject=JSON.parse(this.rawJsonString);
		
		
		var tmp=qtools.clone(this.completeObject);
		
		this.defaultStandard=qtools.clone(tmp.Realm[0].Standards[0]);
		
		delete this.defaultStandard.Components;
		delete this.defaultStandard.Activities;
		this.defaultStandard.RefId='';
		
		this.defaultActivity=qtools.clone(tmp.Realm[0].Standards[0].Components[0].Activities[0]);
		delete this.defaultActivity.Activitie;
		this.defaultActivity.RefId='';
		
		this.wrapper=qtools.clone(this.completeObject);
		this.wrapper.Realm[0].RefId=qtools.newGuid();
		delete this.wrapper.Realm[0].Standards;
		
		this.topLevelElements={
			Applicability:this.defaultStandard.Applicability,
			Terms:this.defaultStandard.Terms,
			Specialties:this.defaultStandard.Specialties,
		}


		this.args=args;
			
		//BUILD RETURN OBJECT ====================================
		
		this.wrapWithRealm=function(goodies){
			var wrapper=qtools.clone(this.wrapper);
			wrapper.Realm[0].Standards=goodies;
			return wrapper;
		}

		this.forceEvent = forceEvent;
		return this;
	};

//END OF moduleFunction() ============================================================

util.inherits(moduleFunction, events.EventEmitter);
module.exports=moduleFunction;