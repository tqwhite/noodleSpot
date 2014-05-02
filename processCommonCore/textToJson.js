'use strict';
/*

This absorbs a tab delimited spreadsheet file with field names in the first row.
The data can be manipulated in a couple of ways and then converted to a simple
Javascript object list. A JSON version is also maintained.

Give a new lineByLine a file name and it will grab the contents for processing
	var lineByLine=require('./lineByLine.js'),
		fileName = "coreOrig.txt";
	lineByLine=new lineByLine(fileName, [definition | 'getFieldNamesFrom']);
	
"definition" is an entry from a dictionary (eg, uffDictionary.js)

The file read is ASYNCHRONOUS and is reported via the 'gotData' event.

	lineByLine.on('gotData', 
		function(){
		lineByLine.processLines(function(){ ... });
		lineByLine.mapFieldNames({ ... }, 'exclusive');
		lineByLine.convert();
		console.log(lineByLine.finishedObject);
	});

You can run a function on each line in the file, eg, this adds a newline to each line
	var transformations=function(item, inx, entire){
		return item+"\n";
	};
	lineByLine.processLines(transformations);
	
You can also shape the final object by mapping the field names and, optionally, discarding columns 
that are not listed in the map. The name of each property corresponds to a name in the header row
of the incoming data. The value of the property is the name that will be used for the corresponding 
property in the output data. Adding the exclusive flag causes columns to be discarded. If it
is omitted, names are mapped and other columns become properties using their original names.

	lineByLine.mapFieldNames(
		{ 
			GUID:'RefId', 
			Number:'Number', 
			'Parent GUID':'ParentStandardRefId'
		}, 
		'exclusive');

Once you've translated everything, you can convert into and array of simple javascript objects, ie, [{fieldNameA:'dataA', fieldNameB, 'dataB'}]
	lineByLine.convert();

You can access the results from these properties:

	lineByLine.finishedObject
	
*/
var qtools=require('qtools'),
	events = require('events'),
	util = require('util'),
	fs = require("fs");
	
//START OF moduleFunction() ============================================================
var moduleFunction = function(fileName, definition) {
		events.EventEmitter.call(this);
		var self = this,
			forceEvent = function(eventName, outData) {
				this.emit(eventName, {
					eventName: eventName,
					data: outData
				});
			},
			
			init=function(fileName, self){
				if (!fs.existsSync(fileName)) {
					qtools.die('ERROR: *** file does NOT EXIST: '+fileName + ' ***');
				} else {
					fs.stat(fileName, function(error, stats) {
						fs.open(fileName, "r", function(error, fd) {
							var buffer = new Buffer(stats.size);
							fs.read(fd, buffer, 0, buffer.length, null, function(error, bytesRead, buffer) {
								var data = buffer.toString("utf8", 0, buffer.length);
						//		self.rawFileContent=data;
								self.lineList=data.split("\n");
								fs.close(fd);
				
		
								if (self.definition.getFieldNamesFrom=='firstLineOfFile'){
									self.headerList=self.lineList.splice(0, 1)[0].split('\t');
									self.skipFirstLine=true;
								} else {
									self.headerList=self.definition.fieldList;
								}
								self.rawHeaderList=qtools.clone(self.headerList);
								self.emit('gotData');
								
							});
						});
					});
		}
		},
		
			defaultTransformations=function(element, i, list){
				element=element.replace(/<!newGuid!>/g, qtools.newGuid()); //note: I have subsequently learned that Expressbook generates the RefId if none is supplied for a new object
				return element;
			},
		
			processLines=function(callback, suppressDefaultTransformations){
			
				suppressDefaultTransformations=(typeof(suppressDefaultTransformations)!='undefined')?applyDefaultTransformations:false
			
				var list=self.lineList,
					outArray=[];
				
				if (self.skipFirstLine){ var start=1; }else {var start=0;}
		
				for (var i=start, len=list.length; i<len; i++){
					var element=list[i];
					if (typeof(callback)=='function'){
						element=callback(element, i, list);
					}
					
					if (!suppressDefaultTransformations){
						element=defaultTransformations(element, i, list);
					}
					outArray.push(element);
				}
				
					self.lineList=outArray;
			},
			
			convert=function(){
				self.sourceObjectList=[];;
					
				var outArray=[];
				var list=self.lineList;
		
				for (var i=0, len=list.length; i<len; i++){

					var element=list[i].split('\t');
					
					
					
					
					var sourceItem={};
					var len2=self.rawHeaderList.length;
					for (var j=0, len2; j<len2; j++){
						sourceItem[self.rawHeaderList[j]]=element[j];
					}
					
					
					self.sourceObjectList.push(sourceItem);
					
					
					
					
					var itemString='';
				
					var len2=element.length;
					if (len2===1 && element[0]===''){ break; } //ignore empty lines
					
					var itemObj={};
					for (var j=0, len2; j<len2; j++){
						if (self.headerList[j]){						
						itemObj[self.headerList[j]]=element[j];
						}

					}
					
				
					var list2=self.definition.targetTranslation;
					for (var j in list2){
						
						var translator=list2[j];
						var type=typeof(translator),
						outValue;
						switch (type){
							case 'function':
								outValue=translator(itemObj, sourceItem);
							break;
							default:
								outValue=translator;
							break;
							break;

						}
						
						if(outValue!="<!omitProperty!>"){
							itemObj[j]=outValue;
						}

						
					}
					
						outArray.push(itemObj);
				}

				self.finishedObject=objectTransform(outArray);
			},
			
			objectTransform=function(inObj){
				//this changes compound field names, eg, term.RefId, into sub objects
				var outList=[];
				for (var i=0, len=inObj.length; i<len; i++){
					var workingObj=inObj[i];
					
					for (var key in workingObj){
						var element=workingObj[key];

						if (key.match(/\./)){
							var propertyValue=element,
								resultObj;
							var subKeyList=key.split(/\./);
							for (var j=0, len2=subKeyList.length; j<len2; j++){
								resultObj={};
								var subKey=subKeyList[len2-j-1];
								resultObj[subKey]=propertyValue;
								propertyValue=resultObj;
							}
							delete workingObj[key];
							qtools.extend(workingObj, propertyValue);
						}
					}
					
				outList.push(workingObj);
				}
				return outList;
			},
			
			mapFieldNames=function(map){
				var exclusive=true; //could add control later that allows non-mapped fields to be retained
				var removeEmpty=false; //!(typeof(removeEmpty)=='undefined' || removeEmpty==='' || removeEmpty===false);
				
				map=typeof(map)!='undefined'?map:self.definition.targetMap;

				if (qtools.isNotEmpty(map)){
					self.headerList.map(function(item, inx, entire){
		
						if (typeof(map[item])=='function'){
							entire[inx]=map[item](item, inx, entire);
						}
						else{
					
							var newName=map[item];
							if (typeof(map[item])!='undefined'){
								entire[inx]=map[item];
							}
							else{
								if (exclusive){
									entire[inx]='';
								}
							}
						}
					
					});
				}

				if (removeEmpty){
				self.headerList=qtools.removeNullElements(self.headerList);
				}
			
			},
			
			writeLines=function(){
console.log("WRITELINES");				
// 				var list=self.outList;
// 				for (var i=0, len=list.length; i<len; i++){
// 					var element=list[i];
// 					process.stdout.write(element);
// 				}
			}

		//INITIALIZE OBJECT ====================================
			this.definition=definition;
			this.skipFirstLine=definition.skipFirstLine;
			
			init(fileName, this);
			
		//BUILD RETURN OBJECT ====================================
		this.processLines=processLines;
		this.convert=convert;
		this.mapFieldNames=mapFieldNames;
		this.writeLines=writeLines;
		this.forceEvent = forceEvent;
		return this;
	};
//END OF moduleFunction() ============================================================
util.inherits(moduleFunction, events.EventEmitter);
module.exports = moduleFunction;