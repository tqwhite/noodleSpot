"use strict";
var qtools=require('qtools');

//node loadCommonCore.js --standards dataFiles/coreOrig.txt
//node loadCommonCore.js --standards --forReal dataFiles/coreOrig.txt

var program = require('commander');
program
	.version('tqTEst')
	.option('-x, --standards', 'upload standards')
	.option('-R, --forReal', 'for [R]eal')
	.option('-j, --dumpJson', 'dump json')
	.parse(process.argv);
	
	if (!(program.standards)){
		console.log('\n\n=== you need to choose something to upload ===');
		program.outputHelp();
		process.exit(1);
	}

var converter=require('./textToJson.js'),
	fileName = process.argv[process.argv.length-1], //"coreOrig.txt";
	finishedOutputObject,
	sourceData;

if (program.standards){
	var accessModelMethodName='saveList',
		apiEndpoint='/data/District/SaveRealms';
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
	
		var templates=require('./templates/ebStandards.js'); templates=new templates();	
		var builder=require('./assemblers/standards.js'); builder=new builder(sourceData.finishedObject, templates);
		finishedOutputObject=builder.finalObject;
		ebAccess[accessModelMethodName](finishedOutputObject, apiEndpoint, ebAccess.writeResultMessages);

	};
}

var loginFoundFunction=function(error, response, body){

		if (error){
			console.log('\n\n\n=======================================================\n');
			console.log('LOGIN ERROR ='+error+'\n');
		}
		else{
		
			console.log('starting conversion');
			sourceData=new converter(fileName, 'firstLineIsHeader');
			sourceData.on('gotData', conversionFunction);
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

