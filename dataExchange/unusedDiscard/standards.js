'use strict';
var qtools=require('qtools'),
	qtools=new qtools(module),
	events = require('events'),
	util = require('util');

//START OF moduleFunction() ============================================================
var moduleFunction = function(InObj, templates) {
		events.EventEmitter.call(this);
		var self = this,
			forceEvent = function(eventName, outData) {
				this.emit(eventName, {
					eventName: eventName,
					data: outData
				});
			},
			
			initApplicability=function(item){
					
					item.Applicability=[];
					switch(item.Grade){
						case 'College- and Career-Readiness Anchor Standards':
								item.Applicability.push({RefId:'a455f664-b75e-4752-b02b-f345e8bbbf29'});
								item.Applicability.push({RefId:'9ACF0F03-D28A-44DE-B212-B6984C02EAD7'});
								item.Applicability.push({RefId:'7F1DF983-3FC0-4264-9C5F-0FB7ADD9F560'});
								item.Applicability.push({RefId:'fff171ae-9a93-4f50-b7e1-f88e4df41230'});
								item.Applicability.push({RefId:'241248e6-dac0-400f-81ec-50679b692929'});
								item.Applicability.push({RefId:'9f6850c1-e96c-45e2-afa8-2a897ea622ca'});
								item.Applicability.push({RefId:'5981aeff-134a-4adf-ab4b-5319ca339396'});
								break;
						case 'Kindergarten':
								item.Applicability.push({RefId:'a455f664-b75e-4752-b02b-f345e8bbbf29'});
								break;
						case 'Grade 1':
								item.Applicability.push({RefId:'9ACF0F03-D28A-44DE-B212-B6984C02EAD7'});
								break;
						case 'Grade 2':
								item.Applicability.push({RefId:'7F1DF983-3FC0-4264-9C5F-0FB7ADD9F560'});
								break;
						case 'Grade 3':
								item.Applicability.push({RefId:'fff171ae-9a93-4f50-b7e1-f88e4df41230'});
								break;
					}
				
			},
			
			linkToParent = function(privateKey, foreignKey, destinationArgs) {


				self.objectList.map(

				function(item, inx, entire) {
				
					var invalidObject=function(item){
qtools.dump({'\n\n===== item =====\n':item});
						return item.Title=='1E340900-8F24-11E0-B7E9-55FE9CFF4B22'
					}
				
					var targetProperty, targetPropertyName, targetDefaults, destSwitchValue;			
					if (qtools.isEmpty(item) || invalidObject(item)){ 
						item[foreignKey]='badItem'; //this will cause it to be removed
					return; }
					
					destSwitchValue=item[destinationArgs.switchFieldName]
					targetProperty=destinationArgs.destPropertyMap[destSwitchValue];
					
					if (typeof(targetProperty)=='undefined'){
						targetProperty=destinationArgs.destPropertyMap['default'];
					}
					targetPropertyName=targetProperty.targetPropertName;
					targetDefaults=targetProperty.defaultObject;
					
					if (!item.Title){ 
						var abbrev=item.Description?item.Description.match(/^.{1,20}/):item.RefId;
						var grade=item.Grade?' '+item.Grade.match(/^.{1,10}/):''; 
						var number=item.Number?item.Number:item.RefId; 
						
						item.Title=number;

						if (abbrev!=null){
							item.AbbrevTitle=abbrev[0]+grade;
						} 
						else {
							item.AbbrevTitle='object was missing both Number and RefId, impossible';
							}
						}

					if (item[foreignKey]) {
						var targetObj = qtools.getByProperty(entire, privateKey, item[foreignKey]);

						if (invalidObject(targetObj) || invalidObject(item)){return}; //do not link bad objects
						
						if (typeof(targetObj[targetPropertyName]) == 'undefined') {
							targetObj[targetPropertyName] = []; //establish destination list property
						}

						var outObj=createMergedObject(item, targetDefaults);
						targetObj[targetPropertyName].push(outObj);
			

					}
					else {
							var list=destinationArgs.topLevelElements;
							for (var i in list){
								var element=list[i];
								item[i]=element;
							}
							initApplicability(item);
							
							if (!self.topLevelList){self.topLevelList=[];}
							self.topLevelList.push(item);
						
					}

				});
				
	
				return qtools.removeNullElements(self.objectList, '', destinationArgs.keepFunction);
				
			},
			
			createMergedObject=function(data, defaultObj){
				
				for (var i in defaultObj){

					if (typeof(data[i])!='undefined'){
						if (typeof(i)=='string' && data[i].length>255){data[i]=data[i].substring(0,255);}
						data[i]=data[i];
					}
					else{
						data[i]=defaultObj[i];
					}
					
				}
				
				initApplicability(data);
				
				return data;
			}

		//INITIALIZE OBJECT ====================================
			this.templates=templates;
			

			this.objectList = InObj;

			this.objectList=linkToParent('RefId', 'ParentStandardRefId', 
				{
					switchFieldName:"$Type", //The common core field, Children, is mapped to type. Activities have zero Children
					destPropertyMap:{
					
					'default':{
							targetPropertName:'Components', //within a Standard, subordinate standards are stored in the Component property
							defaultObject:this.templates.defaultStandard
						},
					'0':{
							targetPropertName:'Activities',
							defaultObject:this.templates.defaultActivity
						}
					
					}, 
					keepFunction:function(element) {return element.ParentStandardRefId == '';}, //only want to keep the top level items, others were embedded in their context					
					topLevelElements:this.templates.topLevelElements
				});
				

			this.finalObject={wrapperFunction:this.templates.wrapWithRealm.bind(this.templates), standardsList:[this.objectList]};

		//BUILD RETURN OBJECT ====================================
			this.forceEvent = forceEvent;
			this.linkToParent = linkToParent;
			return this;
	};

//END OF moduleFunction() ============================================================
util.inherits(moduleFunction, events.EventEmitter);
module.exports = moduleFunction;