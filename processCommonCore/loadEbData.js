"use strict";
var qtools = require('qtools'); qtools=new qtools(module);

console.dir(qtools);

/*

node loadEbData.js --objective --verbose dataFiles/eb/objectives.eb

EB SEQUENCE
node loadEbData.js --school --forReal  --verbose dataFiles/eb/schoolSetup/school.eb
node loadEbData.js --gradeLevel --forReal  --verbose dataFiles/eb/schoolSetup/gradeLevel.eb
node loadEbData.js --gradeLevelSchool --forReal  --verbose dataFiles/eb/schoolSetup/gradeLevelSchool.eb
node loadEbData.js --term --forReal  --verbose -- dataFiles/eb/schoolSetup/term.eb
node loadEbData.js --termSchool --forReal  --verbose -- dataFiles/eb/schoolSetup/termSchool.eb
node loadEbData.js --schoolSetCurrentTerm --forReal  --verbose -- dataFiles/eb/schoolSetup/school.eb

node loadEbData.js --student --forReal  --verbose -- dataFiles/eb/peopleSetup/student.eb
node loadEbData.js --teacher --forReal  --verbose -- dataFiles/eb/peopleSetup/teacher.eb


node loadEbData.js --homeroom --skipFirstLine --forReal  --verbose -- dataFiles/eb/peopleSetup/homeroom.eb
node loadEbData.js --studentAssignment --forReal  --verbose dataFiles/eb/studentAssignment.eb

node loadEbData.js --teacherAssignment --forReal  --verbose dataFiles/eb/teacherAssignment.eb

UFF SEQUENCE
node loadEbData.js --school --skipFirstLine --forReal  --verbose dataFiles/uff/schoolSetup/school.uff
node loadEbData.js --term --skipFirstLine --forReal  --verbose dataFiles/uff/schoolSetup/term.uff
node loadEbData.js --schoolSetCurrentTerm --forReal  --verbose -- dataFiles/uff/schoolSetup/schoolSetCurrentTerm.uff
node loadEbData.js --gradeLevel --skipFirstLine --forReal  --verbose dataFiles/uff/schoolSetup/gradeLevel.uff

node loadEbData.js --student --skipFirstLine --forReal  --verbose dataFiles/uff/peopleSetup/student.uff
node loadEbData.js --teacher --skipFirstLine --forReal  --verbose -- dataFiles/uff/peopleSetup/teacher.uff


node loadEbData.js --homeroom --skipFirstLine --forReal  --verbose -- dataFiles/uff/peopleSetup/homeroom.uff
node loadEbData.js --studentAssignment --skipFirstLine --forReal  --verbose dataFiles/uff/studentAssignment.uff

node loadEbData.js --teacherAssignment --skipFirstLine --forReal  --verbose dataFiles/uff/teacherAssignment.uff


*/

var program = require('commander');
program.version('tqTest')
	.option('-y, --objective', 'upload objectives')
	
	.option('-y, --school', 'upload schools')
	.option('-y, --gradeLevel', 'upload grade levels')
	.option('-y, --gradeLevelSchool', 'upload gradeLevelSchool')
	.option('-y, --term', 'upload terms')
	.option('-y, --termSchool', 'upload termSchool')
	.option('-y, --schoolSetCurrentTerm', 'upload schoolSetCurrentTerm')
	
	.option('-y, --student', 'upload students')
	.option('-y, --teacher', 'upload teachers')
	
	.option('-y, --homeroom', 'create a new homeroom for later student attaching')
	
	.option('-y, --studentAssignment', 'attach students to rosmats')
	.option('-y, --teacherAssignment', 'attach teachers to rosmats')
	
	.option('-f, --skipFirstLine', 'Skip first line if header definitions are there for a schema that does not use it')
	.option('-R, --forReal', 'for [R]eal')
	.option('-j, --dumpJson', 'dump json')
	.option('-v, --verbose', 'Verbose')
	.option('-q, --quiet', 'Quiet, no messages')
	.parse(process.argv);


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
	

	else if (program.homeroom) {
		var controlObj={
			accessModelMethodName:'saveCompletedObject',
			apiEndpoint:'/data/Api1/Homeroom',
			endPointWrapperName:'Homerooms',
			definitionName:'homeroom',
			fileName:fileName
			};
	}

	else if (program.teacherAssignment) {
		var controlObj={
			accessModelMethodName:'saveCompletedObject',
			apiEndpoint:'/data/Api1/AssignTeachers',
			endPointWrapperName:'assignmentPairs',
			definitionName:'teacherAssignment',
			fileName:fileName
			};


	}  

	else if (program.studentAssignment) {
		var controlObj={
			accessModelMethodName:'saveCompletedObject',
			apiEndpoint:'/data/Api1/AssignStudents',
			endPointWrapperName:'assignmentPairs',
			definitionName:'studentAssignment',
			fileName:fileName
			};
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

	else if (program.objective) {
		var controlObj={
			accessModelMethodName:'saveCompletedObject',
			apiEndpoint:'/data/Api1/Objective',
			endPointWrapperName:'Objectives',
			definitionName:'objective',
			fileName:fileName
			};
	}

else{
	console.log('\n\n=== you need to choose something to upload ===');
	program.outputHelp();
	process.exit(1);
}
if (!program.quiet){ console.log("executing "+controlObj.definitionName); }
if (program.verbose){
	qtools.dump({'\n\n===== controlObj =====\n':controlObj});
	console.log('\n\attempting login');
}

var conversionFunction = function() {
		
		sourceData.mapFieldNames();
		sourceData.processLines();
		sourceData.convert();
		qtools.message='loadEb';
		sourceData.assemble();
		
		if (typeof(finishedOutputObject)=='undefined'){
			finishedOutputObject={};
			finishedOutputObject[controlObj.endPointWrapperName]=sourceData.finishedObject; //very often, I find it useful to generate an object literal above for testing and don't want to have it overwritten here
		}
		
		var wrapupCallback='no final output wanted';
		
		if (program.verbose){
			qtools.dump({sourceObjectList:sourceData.sourceObjectList});
			qtools.dump({finishedOutputObject:finishedOutputObject});
	
			console.log('\n\nstarting api write');
			wrapupCallback=ebAccess.writeResultMessages;
		}
		ebAccess[controlObj.accessModelMethodName](finishedOutputObject, controlObj.apiEndpoint, wrapupCallback);

	}
var loginFoundCallback = function(error, response, body) {

		if (error) {
			console.log('\n\n\n=============== LOGIN ERROR ===========================\n');
			console.log(error);
			console.log('\n===================================================\n');
			qtools.die();
		} else {
		
			if (program.verbose){console.log('\n\nstarting conversion\n\n');}
			
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