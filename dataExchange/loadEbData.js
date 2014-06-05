"use strict";
var qtools = require('qtools');
qtools = new qtools(module);


var config = require('./config/targetServer.js');
config = new config();
var displayConfig = qtools.clone(config.loginInfo());
displayConfig.password = '****';

/*

node loadEbData.js --markScale --verbose dataFiles/eb/objectiveSetup/markScales.eb
node loadEbData.js --markScale --verbose --forReal dataFiles/eb/objectiveSetup/markScales.eb

node loadEbData.js --specialty --verbose dataFiles/eb/attributeSetup/specialties.eb
node loadEbData.js --specialty --verbose --forReal dataFiles/eb/attributeSetup/specialties.eb

node loadEbData.js --objective --verbose --forReal dataFiles/uff/objectiveSetup/objectives.eb
node loadEbData.js --assignGradeLevel --verbose --forReal dataFiles/uff/objectiveSetup/gradeLevelAssignments.eb
node loadEbData.js --assignTerm --verbose --forReal dataFiles/uff/objectiveSetup/termAssignments.eb
node loadEbData.js --assignSpecialty --verbose --forReal dataFiles/uff/objectiveSetup/specialtyAssignments.eb


EB SEQUENCE
node loadEbData.js --assignTeacher --verbose dataFiles/eb/peopleSetup/assignTeacher.eb

node loadEbData.js --school --forReal  --verbose dataFiles/eb/schoolSetup/school.eb
node loadEbData.js --gradeLevel --forReal  --verbose dataFiles/eb/schoolSetup/gradeLevel.eb
node loadEbData.js --gradeLevelSchool --forReal  --verbose dataFiles/eb/schoolSetup/gradeLevelSchool.eb
node loadEbData.js --term --forReal  --verbose -- dataFiles/eb/schoolSetup/term.eb
node loadEbData.js --termSchool --forReal  --verbose -- dataFiles/eb/schoolSetup/termSchool.eb
node loadEbData.js --schoolSetCurrentTerm --forReal  --verbose -- dataFiles/eb/schoolSetup/school.eb

node loadEbData.js --student --forReal  --verbose -- dataFiles/eb/peopleSetup/student.eb
node loadEbData.js --teacher --forReal  --verbose -- dataFiles/eb/peopleSetup/teacher.eb


node loadEbData.js --homeroom --skipFirstLine --forReal  --verbose -- dataFiles/eb/peopleSetup/homeroom.eb
node loadEbData.js --assignStudent --forReal  --verbose dataFiles/eb/peopleSetup/assignStudent.eb
 
 
node loadEbData.js --objective --verbose --forReal dataFiles/eb/objectiveSetup/objectives.eb
node loadEbData.js --assignGradeLevel --verbose --forReal dataFiles/eb/objectiveSetup/gradeLevelAssignments.eb
node loadEbData.js --assignTerm --verbose --forReal dataFiles/eb/objectiveSetup/termAssignments.eb
node loadEbData.js --assignSpecialty --verbose --forReal dataFiles/eb/objectiveSetup/specialtyAssignments.eb

node loadEbData.js --assignTeacher --forReal  --verbose dataFiles/eb/peopleSetup/assignTeacher.eb


UFF SEQUENCE
node loadEbData.js --school --skipFirstLine --forReal  --verbose dataFiles/uff/schoolSetup/school.uff
node loadEbData.js --term --skipFirstLine --forReal  --verbose dataFiles/uff/schoolSetup/term.uff
node loadEbData.js --schoolSetCurrentTerm --forReal  --verbose -- dataFiles/uff/schoolSetup/schoolSetCurrentTerm.uff
node loadEbData.js --gradeLevel --skipFirstLine --forReal  --verbose dataFiles/uff/schoolSetup/gradeLevel.uff

node loadEbData.js --student --skipFirstLine --forReal  --verbose dataFiles/uff/peopleSetup/student.uff
node loadEbData.js --teacher --skipFirstLine --forReal  --verbose -- dataFiles/uff/peopleSetup/teacher.uff


node loadEbData.js --homeroom --skipFirstLine --forReal  --verbose -- dataFiles/uff/peopleSetup/homeroom.uff
node loadEbData.js --assignStudent --skipFirstLine --forReal  --verbose dataFiles/uff/assignStudent.uff

node loadEbData.js --assignTeacher --skipFirstLine --forReal  --verbose dataFiles/uff/assignTeacher.uff


*/

var program = require('commander');
program.version('tqTest')
	.option('-y, --markScale', 'upload markScale')
	.option('-y, --specialty', 'upload specialties')
	.option('-y, --objective', 'upload objectives')
	.option('-y, --assignGradeLevel', 'upload assignGradeLevel')
	.option('-y, --assignTerm', 'upload assignGradeLevel')
	.option('-y, --assignSpecialty', 'upload assignSpecialty')

	.option('-y, --school', 'upload schools')
	.option('-y, --gradeLevel', 'upload grade levels')
	.option('-y, --gradeLevelSchool', 'upload gradeLevelSchool')
	.option('-y, --term', 'upload terms')
	.option('-y, --termSchool', 'upload termSchool')
	.option('-y, --schoolSetCurrentTerm', 'upload schoolSetCurrentTerm')

	.option('-y, --student', 'upload students')
	.option('-y, --teacher', 'upload teachers')

	.option('-y, --homeroom', 'create a new homeroom for later student attaching')

	.option('-y, --assignStudent', 'attach students to rosmats')
	.option('-y, --assignTeacher', 'attach teachers to rosmats')

	.option('-f, --skipFirstLine', 'Skip first line if header definitions are there for a schema that does not use it')
	.option('-R, --forReal', 'for [R]eal')
	.option('-j, --dumpJson', 'dump json')
	.option('-v, --verbose', 'Verbose')
	.option('-v, --pingOnly', 'Verbose')
	.option('-q, --quiet', 'Quiet, no messages')
	.parse(process.argv);


var ebAccess = require('targetServerAccess');
ebAccess = new ebAccess();
var converter = require('textToJson'),
	fileName = process.argv[process.argv.length - 1], //"coreOrig.txt"
	fileType = fileName.match(/\.(\w*)$/)[1],
	finishedOutputObject,
	sourceData;

switch (fileType) {
	case 'eb':
		var dictionaryName = 'ebDefinition'
		break;
	case 'uff':
		var dictionaryName = 'uffDefinition'
		break;
}
var dictionary = require('dictionary');


dictionary = new dictionary({
	dataDefinition: require("./dataDefinitions/" + dictionaryName + ".js"),
	target: 'expressbook',
	skipFirstLine: program.skipFirstLine
});

if (program.school) {
	var controlObj = {
		accessModelMethodName: 'saveCompletedObject',
		apiEndpoint: '/data/API/1/School',
		endPointWrapperName: 'SchoolInfo',
		definitionName: 'school',
		fileName: fileName
	};
} else if (program.gradeLevel) {
	var controlObj = {
		accessModelMethodName: 'saveCompletedObject',
		apiEndpoint: '/data/API/1/School/Grade',
		endPointWrapperName: 'Grades',
		definitionName: 'gradeLevel',
		fileName: fileName
	};
} else if (program.gradeLevelSchool) {
	var controlObj = {
		accessModelMethodName: 'saveCompletedObject',
		apiEndpoint: '/data/API/1/School/Grade',
		endPointWrapperName: 'Grades',
		definitionName: 'gradeLevelSchool',
		fileName: fileName
	};
} else if (program.term) {
	var controlObj = {
		accessModelMethodName: 'saveCompletedObject',
		apiEndpoint: '/data/API/1/School/Termm',
		endPointWrapperName: 'Terms',
		definitionName: 'term',
		fileName: fileName
	};
} else if (program.termSchool) {
	var controlObj = {
		accessModelMethodName: 'saveCompletedObject',
		apiEndpoint: '/data/API/1/School/Termm',
		endPointWrapperName: 'Terms',
		definitionName: 'termSchool',
		fileName: fileName
	};
} else if (program.schoolSetCurrentTerm) {
	var controlObj = {
		accessModelMethodName: 'saveCompletedObject',
		apiEndpoint: '/data/API/1/School',
		endPointWrapperName: 'SchoolInfo',
		definitionName: 'schoolSetCurrentTerm',
		fileName: fileName
	};
} else if (program.teacher) {
	var controlObj = {
		accessModelMethodName: 'saveCompletedObject',
		apiEndpoint: '/data/API/1/Teacher',
		endPointWrapperName: 'UserInfo',
		definitionName: 'teacher',
		fileName: fileName
	};

} else if (program.student) {
	var controlObj = {
		accessModelMethodName: 'saveCompletedObject',
		apiEndpoint: '/data/API/1/Student',
		endPointWrapperName: 'StudentPersonal',
		definitionName: 'student',
		fileName: fileName
	};
} else if (program.homeroom) {
	var controlObj = {
		accessModelMethodName: 'saveCompletedObject',
		apiEndpoint: '/data/API/1/Gradebook/Homeroom',
		endPointWrapperName: 'Homerooms',
		definitionName: 'homeroom',
		fileName: fileName
	};
} else if (program.assignTeacher) {
	var controlObj = {
		accessModelMethodName: 'saveCompletedObject',
		apiEndpoint: '/data/API/1/Teacher/AssignTeachers',
		endPointWrapperName: 'assignmentPairs',
		definitionName: 'assignTeacher',
		fileName: fileName
	};


} else if (program.assignStudent) {
	var controlObj = {
		accessModelMethodName: 'saveCompletedObject',
		apiEndpoint: '/data/API/1/Student/AssignStudents',
		endPointWrapperName: 'assignmentPairs',
		definitionName: 'assignStudent',
		fileName: fileName
	};
} else if (program.studentAssignment_Nested_ROSMATVERSIONWORKS) {
	var controlObj = {
		accessModelMethodName: 'saveCompletedObject',
		apiEndpoint: '/data/Rosmat/attachStudents1',
		endPointWrapperName: 'assignmentPairs',
		definitionName: 'DSDFDSFSDFSDFDF',
		fileName: fileName
	};

} else if (program.objective) {
	var controlObj = {
		accessModelMethodName: 'saveCompletedObject',
		apiEndpoint: '/data/API/1/Objective',
		endPointWrapperName: 'Objectives',
		definitionName: 'objective',
		fileName: fileName
	};
} else if (program.assignGradeLevel) {
	var controlObj = {
		accessModelMethodName: 'saveCompletedObject',
		apiEndpoint: '/data/API/1/Objective/AssignGradeLevel',
		endPointWrapperName: 'GradeLevelAssignments',
		definitionName: 'assignGradeLevel',
		fileName: fileName
	};
} else if (program.assignTerm) {
	var controlObj = {
		accessModelMethodName: 'saveCompletedObject',
		apiEndpoint: '/data/API/1/Objective/AssignTerm',
		endPointWrapperName: 'TermAssignments',
		definitionName: 'assignTerm',
		fileName: fileName
	};
} else if (program.assignSpecialty) {
	var controlObj = {
		accessModelMethodName: 'saveCompletedObject',
		apiEndpoint: '/data/API/1/Objective/AssignSpecialty',
		endPointWrapperName: 'SpecialtyAssignments',
		definitionName: 'assignSpecialty',
		fileName: fileName
	};
} else if (program.specialty) {
	var controlObj = {
		accessModelMethodName: 'saveCompletedObject',
		apiEndpoint: '/data/API/1/Attribute/Specialtyy',
		endPointWrapperName: 'Specialties',
		definitionName: 'specialty',
		fileName: fileName
	};
} else if (program.markScale) {
	var controlObj = {
		accessModelMethodName: 'saveCompletedObject',
		apiEndpoint: '/data/API/1/Attribute/MarkScale',
		endPointWrapperName: 'MarkScales',
		definitionName: 'markScale',
		fileName: fileName
	};
} else {
	console.log('\n\n=== you need to choose something to upload ===');
	program.outputHelp();
	process.exit(1);
}

if (!program.quiet) {
	console.log("executing " + controlObj.definitionName);
}
if (program.verbose) {

	controlObj.config = displayConfig;

	qtools.dump({
		'\n\n===== controlObj =====\n': controlObj
	});
	console.log('\n\attempting login');
}

var conversionFunction = function() {

	sourceData.mapFieldNames();
	sourceData.processLines();
	sourceData.convert();
	sourceData.assemble();


	if (typeof (finishedOutputObject) == 'undefined') {
		finishedOutputObject = {};
		finishedOutputObject[controlObj.endPointWrapperName] = sourceData.finishedObject; //very often, I find it useful to generate an object literal above for testing and don't want to have it overwritten here
	}

	var wrapupCallback = 'no final output wanted';

	if (program.verbose) {
		qtools.dump({
			sourceObjectList: sourceData.sourceObjectList
		});
		qtools.dump({
			finishedOutputObject: finishedOutputObject
		});

		console.log('\n\nstarting api write');
		wrapupCallback = ebAccess.writeResultMessages;
	}
	if (program.dumpJson) {
		console.log('\n\n' + JSON.stringify(finishedOutputObject) + '\n\n');
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

		if (program.pingOnly) {
			ebAccess.pingApiEndpoint(controlObj);
			return;
		}


		if (program.verbose) {
			console.log('\n\nstarting conversion\n\n');
		}




		sourceData = new converter(fileName, dictionary.get(controlObj.definitionName));
		sourceData.on('gotData', conversionFunction);
	}
}

var loginInfo = config.loginInfo();
ebAccess.start(
qtools.extend(
loginInfo,
{
	loginCallback: loginFoundCallback,
	dryRun: ( !program.forReal && !program.pingOnly),
	dumpJson: program.dumpJson
}
)
);



