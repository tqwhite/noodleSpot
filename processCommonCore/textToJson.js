'use strict';
/*

This absorbs a tab delimited spreadsheet file with field names in the first row.
The data can be manipulated in a couple of ways and then converted to a simple
Javascript object list. A JSON version is also maintained.

Give a new lineByLine a file name and it will grab the contents for processing
	var lineByLine=require('./lineByLine.js'),
		fileName = "coreOrig.txt";
	lineByLine=new lineByLine(fileName, 'firstLineIsHeader');

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
	lineByLine.entireJson
	
*/
var qtools=require('qtools'),
	events = require('events'),
	util = require('util'),
	fs = require("fs");
	
//START OF moduleFunction() ============================================================
var moduleFunction = function(fileName, firstLineIsHeader) {
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
					throw '\n\nERROR: *** '+fileName + ' *** does NOT EXIST\n\n';
				} else {
					fs.stat(fileName, function(error, stats) {
						fs.open(fileName, "r", function(error, fd) {
							var buffer = new Buffer(stats.size);
							fs.read(fd, buffer, 0, buffer.length, null, function(error, bytesRead, buffer) {
								var data = buffer.toString("utf8", 0, buffer.length);
						//		self.rawFileContent=data;
								self.lineList=data.split("\n");
								fs.close(fd);
								
								if (self.firstLineIsHeader){
									self.headerList=self.lineList.splice(0, 1)[0].split('\t');
								}
								self.emit('gotData');
								
							});
						});
					});
		}
		},
		
			processLines=function(callback){
			
				var list=self.lineList;
				for (var i=0, len=list.length; i<len; i++){
					var element=list[i];
					self.lineList[i]=callback(element, i, list);
				}
				self.outList=self.lineList
			},
			
			convert=function(){
				self.outList=[];
				self.jsonList=[];
				self.entireJson='';
				var list=self.lineList;
				for (var i=0, len=list.length; i<len; i++){
					var element=list[i].split('\t');
					var itemString='';
					
					for (var j=0, len2=element.length; j<len2; j++){
						if (self.headerList[j]){
						itemString+='"'+self.headerList[j]+'":"'+element[j]+'",\n';
						}
					}
					
					itemString=itemString.replace(/,\n$/,'\n');
					itemString='{'+itemString+'}';
					
					self.outList.push(itemString);
					self.jsonList.push(itemString);
					self.entireJson+=itemString+', ';
				}
				self.entireJson=self.entireJson.replace(/, $/, '');
				self.entireJson='['+self.entireJson+']';
				self.finishedObject=JSON.parse(self.entireJson);
			},
			
			mapFieldNames=function(map, exclusive, removeEmpty){
				exclusive=!(typeof(exclusive)=='undefined' || exclusive==='' || exclusive===false);
				removeEmpty=!(typeof(removeEmpty)=='undefined' || removeEmpty==='' || removeEmpty===false);

				self.headerList.map(function(item, inx, entire){
					var newName=map[item];
					if (typeof(map[item])!='undefined'){
						entire[inx]=map[item];
					}
					else{
						if (exclusive){
							entire[inx]='';
						}
					}
					
					
				});
				if (removeEmpty){
				self.headerList=qtools.removeNullElements(self.headerList);
				}
			
			},
			
			writeLines=function(){
				
				var list=self.outList;
				for (var i=0, len=list.length; i<len; i++){
					var element=list[i];
					process.stdout.write(element);
				}
			}

		//INITIALIZE OBJECT ====================================
			this.firstLineIsHeader=typeof(firstLineIsHeader)!='undefined';
			
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