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
		
		qtools.validateProperties({
			subject:args,
			targetScope: this, //will add listed items to targetScope
			propList:[
				{name:'linkPropertyContainerName', optional:false},
				{name:'attachmentListPropertySpec', optional:false},
				{name:'destPropertyObjectPropertyName', optional:true},
				{name:'finalObjectCustomEditor', optional:true}
			]
		});
		
						
		//LOCAL FUNCTIONS ====================================

		var getLinkPropertyName=function(element){
		
			var linkProperty=element[self.linkPropertyContainerName],
			linkPropertyName;

			var count=0;
			
			for (var i in linkProperty){
				linkPropertyName=i;
				count++;
			}
			
			if (count!==1){
				qtools.die({msg:"object to be assembled has too many or few properties ("+count+") in linkProperty ("+self.linkPropertyContainerName+")", evidence:element});
			}

			return linkPropertyName;
		}
		
		
		
		
		var linkToParent=function(parentObject, element){
			var attachmentPropertyName=element[self.attachmentListPropertySpec],
				parentAttachmentName=parentObject[self.attachmentListPropertySpec];
		
			element[self.linkPropertyContainerName][self.attachmentListPropertySpec]=parentAttachmentName;

			if (qtools.toType(parentObject[attachmentPropertyName])!='array'){
				var tmp=parentObject[attachmentPropertyName];
				parentObject[attachmentPropertyName]=[];
				
				if (typeof(tmp)!='undefined'){
					parentObject[attachmentPropertyName].push(tmp);
				}
			}
				parentObject[attachmentPropertyName].push(element);
			

		}
		
						
		//BUILD RETURN OBJECT ====================================

		this.forceEvent = forceEvent;
		
		

		this.executeAssembling=function(sourceObjectList){ 

			var outList=[],
				element, linkPropName, parentObject, linkValue;
	
			for (var i=0, len=sourceObjectList.length; i<len; i++){
				element=sourceObjectList[i];
				linkPropName=getLinkPropertyName(element);
				linkValue=element[self.linkPropertyContainerName][linkPropName];

			
				if (typeof(linkValue)=='undefined' || qtools.isEmpty(linkValue)){


					outList.push(element); //no parentId value means this is a top-level object
				}
				else{
					parentObject=qtools.getByProperty(sourceObjectList, linkPropName, linkValue); //find the parentObject
					linkToParent(parentObject, element);
				}
				

			}
			
			if (typeof(self.finalObjectCustomEditor)=='function'){
				outList=self.finalObjectCustomEditor(outList);
			}
			
			return outList;
		}



		return this;
	};

//END OF moduleFunction() ============================================================

util.inherits(moduleFunction, events.EventEmitter);
module.exports=moduleFunction;