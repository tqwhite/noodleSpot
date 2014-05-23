"use strict";
var qtools = require('qtools');
qtools = new qtools(module);

//node loadCommonCore.js --standards dataFiles/commonCore/coreOrig.txt
//node loadCommonCore.js --standards --forReal dataFiles/commonCore/coreOrig.txt

var program = require('commander');
program
	.version('tqTEst')
	.option('-x, --standards', 'upload standards')
	.option('-R, --forReal', 'for [R]eal')
	.option('-j, --dumpJson', 'dump json')
	.parse(process.argv);

if (!(program.standards)) {
	console.log('\n\n=== you need to choose something to upload ===');
	program.outputHelp();
	process.exit(1);
}

var converter = require('./textToJson.js'),
	fileName = process.argv[process.argv.length - 1], //"coreOrig.txt";
	finishedOutputObject,
	sourceData;
var dictionary = require('./templates/dictionary.js');
dictionary = new dictionary({
	dictionaryName: 'commonCoreDefinition',
	target: 'expressbook',
	skipFirstLine: program.skipFirstLine
});

if (program.standards) {
	var accessModelMethodName = 'saveList',
		apiEndpoint = '/data/District/SaveRealms';
	var conversionFunction = function() {
		sourceData.mapFieldNames(
		{
			Children: "$Type",
			GUID: 'RefId',
			Number: 'Number',
			Label: 'Label',
			'Parent GUID': 'ParentStandardRefId',
			'Description': 'Description',
			'Grade': 'Grade'
		},
		'exclusive');
		sourceData.processLines();
		sourceData.convert();


		var templates = require('./templates/ebStandards.js');
		templates = new templates();
		var builder = require('./assemblers/standards.js');
		builder = new builder(sourceData.finishedObject, templates);
		finishedOutputObject = builder.finalObject;
		if (program.dumpJson) {
			console.log('\n\n' + JSON.stringify(finishedOutputObject) + '\n\n');
		}
		ebAccess[accessModelMethodName](finishedOutputObject, apiEndpoint, ebAccess.writeResultMessages);

	};
}

var loginFoundFunction = function(error, response, body) {

	if (error) {
		console.log('\n\n\n=======================================================\n');
		console.log('LOGIN ERROR =' + error + '\n');
	} else {

		console.log('starting conversion');
		sourceData = new converter(fileName, dictionary.get('core'));
		sourceData.on('gotData', conversionFunction);
	}
}

var ebAccess = require('./expressbookAccess.js');
ebAccess = new ebAccess({
	baseUrl: 'http://expressbook.local',
	userId: 'coordinator',
	password: 'test',
	loginCallback: loginFoundFunction,

	dryRun: !program.forReal,
	dumpJson: program.dumpJson
});


