"use strict";
var qtools = require('qtools');
/*
node loadEbData.js --student --forReal -- dataFiles/eb/student.eb
node loadEbData.js --student --forReal dataFiles/uff/student.uff
node loadEbData.js --studentAssignment --forReal dataFiles/eb/studentAssignment.eb

node loadEbData.js --teacher --forReal -- dataFiles/eb/teacher.eb
node loadEbData.js --teacher --forReal -- dataFiles/uff/teacher.uff

EB SEQUENCE
node loadEbData.js --school --forReal -- dataFiles/eb/schoolSetup/school.eb
node loadEbData.js --gradeLevel --forReal dataFiles/eb/schoolSetup/gradeLevel.eb
node loadEbData.js --gradeLevelSchool --forReal dataFiles/schoolSetup/eb/gradeLevelSchool.eb
node loadEbData.js --term --forReal -- dataFiles/eb/schoolSetup/term.eb
node loadEbData.js --termSchool --forReal -- dataFiles/eb/schoolSetup/termSchool.eb
node loadEbData.js --schoolSetCurrentTerm --forReal -- dataFiles/eb/schoolSetup/school.eb


UFF SEQUENCE
node loadEbData.js --school --skipFirstLine --forReal dataFiles/uff/schoolSetup/school.uff
node loadEbData.js --term --skipFirstLine --forReal dataFiles/uff/schoolSetup/term.uff
node loadEbData.js --schoolSetCurrentTerm --forReal -- dataFiles/uff/schoolSetup/schoolSetCurrentTerm.uff
node loadEbData.js --gradeLevel --skipFirstLine --forReal dataFiles/uff/schoolSetup/gradeLevel.uff


*/

var program = require('commander');
program.version('tqTest')
	.option('-y, --school', 'upload schools')
	.option('-y, --gradeLevel', 'upload grade levels')
	.option('-y, --gradeLevelSchool', 'upload gradeLevelSchool')
	.option('-y, --term', 'upload terms')
	.option('-y, --termSchool', 'upload termSchool')
	.option('-y, --schoolSetCurrentTerm', 'upload schoolSetCurrentTerm')
	
	.option('-y, --student', 'upload students')
	.option('-y, --teacher', 'upload teachers')
	
	.option('-y, --rosmat', 'create a new rosmat for later student attaching')
	
	.option('-y, --studentAssignment', 'attach students to rosmats')
	.option('-y, --teacherAssignment', 'attach teachers to rosmats')
	
	.option('-f, --skipFirstLine', 'Skip first line if header definitions are there for a schema that does not use it')
	.option('-R, --forReal', 'for [R]eal')
	.option('-j, --dumpJson', 'dump json').parse(process.argv);


var ebAccess = require('./expressbookAccess.js');
var converter = require('./textToJson.js'),
	fileName = process.argv[process.argv.length - 1], //"coreOrig.txt"
	fileType=fileName.match(/\.(\w*)$/)[1],
	finishedOutputObject,
	sourceData;

	switch(fileType){
		case 'eb':
			var dictionaryName='ebDefinition'
			break;
		case 'uff':
			var dictionaryName='uffDefinition'
			break;
	}
	var dictionary = require('./templates/dictionary.js'); dictionary=new dictionary({dictionaryName:dictionaryName, target:'expressbook', skipFirstLine:program.skipFirstLine});

if (program.school) {
		var controlObj={
			accessModelMethodName:'saveCompletedObject',
			apiEndpoint:'/data/Api1/School',
			endPointWrapperName:'SchoolInfo',
			definitionName:'school',
			fileName:fileName
			};
	}

	else if (program.gradeLevel) {
		var controlObj={
			accessModelMethodName:'saveCompletedObject',
			apiEndpoint:'/data/Api1/Grade',
			endPointWrapperName:'Grades',
			definitionName:'gradeLevel',
			fileName:fileName
			};
	}

	else if (program.gradeLevelSchool) {
		var controlObj={
			accessModelMethodName:'saveCompletedObject',
			apiEndpoint:'/data/Api1/Grade',
			endPointWrapperName:'Grades',
			definitionName:'gradeLevelSchool',
			fileName:fileName
			};
	}

	else if (program.term) {
		var controlObj={
			accessModelMethodName:'saveCompletedObject',
			apiEndpoint:'/data/Api1/Termm',
			endPointWrapperName:'Terms',
			definitionName:'term',
			fileName:fileName
			};
	}

	else if (program.termSchool) {
		var controlObj={
			accessModelMethodName:'saveCompletedObject',
			apiEndpoint:'/data/Api1/Termm',
			endPointWrapperName:'Terms',
			definitionName:'termSchool',
			fileName:fileName
			};
	}
	
	else if (program.schoolSetCurrentTerm) {
		var controlObj={
			accessModelMethodName:'saveCompletedObject',
			apiEndpoint:'/data/Api1/School',
			endPointWrapperName:'SchoolInfo',
			definitionName:'schoolSetCurrentTerm',
			fileName:fileName
			};
	}

	else if (program.studentAssignment) {
		var controlObj={
			accessModelMethodName:'saveCompletedObject',
			apiEndpoint:'/data/Api1/EnrollStudents',
			endPointWrapperName:'assignmentPairs',
			definitionName:'studentAssignment',
			fileName:fileName
			};
	}
	

	else if (program.teacher) {
		var controlObj={
			accessModelMethodName:'saveCompletedObject',
			apiEndpoint:'/data/Api1/Teacher',
			endPointWrapperName:'UserInfo',
			definitionName:'teacher',
			fileName:fileName
			};

	} 

	else if (program.student) {
		var controlObj={
			accessModelMethodName:'saveCompletedObject',
			apiEndpoint:'/data/Api1/Student',
			endPointWrapperName:'StudentPersonal',
			definitionName:'student',
			fileName:fileName
			};
	} 

	else if (program.rosmat) {
		console.log("program.rosmat not yet implemented");
		process.exit(1);
	}

	else if (program.teacherAssignment) {
		var controlObj={
			accessModelMethodName:'saveCompletedObject',
			apiEndpoint:'/data/Rosmat/attachStudents',
			endPointWrapperName:'assignmentPairs',
			definitionName:'SDSDFDSFFD',
			fileName:fileName
			};
			
			console.log("program.teacherAssignment not yet implemented");
			process.exit(1);

	}  

	else if (program.studentAssignment_Nested_ROSMATVERSIONWORKS) {
		var controlObj={
			accessModelMethodName:'saveCompletedObject',
			apiEndpoint:'/data/Rosmat/attachStudents1',
			endPointWrapperName:'assignmentPairs',
			definitionName:'DSDFDSFSDFSDFDF',
			fileName:fileName
			};

	} 

else{
	console.log('\n\n=== you need to choose something to upload ===');
	program.outputHelp();
	process.exit(1);
}

qtools.dump({'\n\n===== controlObj =====\n':controlObj});
console.log('\n\attempting login');


var conversionFunction = function() {
		
		sourceData.mapFieldNames();
		sourceData.processLines();
		sourceData.convert();
		
		if (typeof(finishedOutputObject)=='undefined'){
			finishedOutputObject={};
			finishedOutputObject[controlObj.endPointWrapperName]=sourceData.finishedObject; //very often, I find it useful to generate an object literal above for testing and don't want to have it overwritten here
		}
		
		
		qtools.dump({sourceObjectList:sourceData.sourceObjectList});
		qtools.dump({finishedOutputObject:finishedOutputObject});
	
		console.log('\n\nstarting api write');
		ebAccess[controlObj.accessModelMethodName](finishedOutputObject, controlObj.apiEndpoint, ebAccess.writeResultMessages);
	}

var loginFoundCallback = function(error, response, body) {

		if (error) {
			console.log('\n\n\n=======================================================\n');
			console.log('LOGIN ERROR =' + error + '\n');
		} else {
			console.log('\n\nstarting conversion\n\n');
			sourceData = new converter(fileName, dictionary.get(controlObj.definitionName));
			sourceData.on('gotData', conversionFunction);
		}
	}

ebAccess = new ebAccess({
	baseUrl: 'http://expressbook.local',
	userId: 'coordinator',
	password: 'test',
	loginCallback: loginFoundCallback,

	dryRun: !program.forReal,
	dumpJson: program.dumpJson
});