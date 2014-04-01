"use strict";
var qtools=require('qtools');

//node processCommonCore.js --standards coreOrig.txt

var program = require('commander');
program
	.version('tqTEst')
	.option('-x, --standards', 'upload standards')
	.option('-y, --students', 'upload students')
	.option('-R, --forReal', 'for [R]eal')
	.option('-j, --dumpJson', 'dump json')
	.parse(process.argv);
	
	if (!(program.students || program.standards)){
		console.log('\n\n=== you need to choose something to upload ===');
		program.outputHelp();
		process.exit(1);
	}

var finishedOutputObject;

var converter=require('./textToJson.js'),
	fileName = process.argv[process.argv.length-1]; //"coreOrig.txt";
var sourceData=new converter(fileName, 'firstLineIsHeader');

if (program.standards){
	var saveFunctionName='saveList';
	var conversionFunction=function(){
		sourceData.mapFieldNames(
			{
				Children:"$Type", 
				GUID:'RefId', 
				Number:'Number', 
				Label:'Label', 
				'Parent GUID':'ParentStandardRefId', 
				'Description':'Description', 
				'Grade':'Grade'
			}, 
			'exclusive');
		sourceData.convert();
	
		var templates=require('./templates/ebStudents.js'); templates=new templates();	
		var builder=require('./assemblers/students.js'); builder=new builder(sourceData.finishedObject, templates);
		finishedOutputObject=builder.finalObject;
	};
}
else if(program.students){
	var saveFunctionName='saveStudents';
	var conversionFunction=function(){
		console.log('should do students');
	}
/*	
	NEXT:
		rename or reorganize builder and template to accomodate students and other 
		structures
		
		or
		
		refactor this to be standards only and make a separate app to conduct the students
		experience since that will need to look up schools and such???
	
	ALSO
		figure out how to organize 'getData' and the skip login callback to coordinate properly.
		waiting an half second is a hack.
	
*/	
	
	
}

sourceData.on('gotData', conversionFunction);


var loginFoundFunction=function(error, response, body){

		if (error){
			console.log('\n\n\n=======================================================\n');
			console.log('LOGIN ERROR ='+error+'\n');
		}
		else{
		
			ebAccess[saveFunctionName](finishedOutputObject, ebAccess.writeResultMessages);
		}
}
	
var ebAccess=require('./expressbookAccess.js');
	ebAccess=new ebAccess({
		baseUrl:'http://expressbook.local',
		userId:'coordinator', 
		password:'test', 
		loginCallback:loginFoundFunction,
		
		dryRun:!program.forReal,
		dumpJson:program.dumpJson
	});

