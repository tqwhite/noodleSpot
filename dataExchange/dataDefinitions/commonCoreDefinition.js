'use strict';


module.exports = {

	//NOTE: maps property are "sourceFileFieldName":"targetJsonPropertyName". Empty map, {}, emits entire fieldlist.
	//ALSO: translations are executed *after* maps are set. Their format is: "targetJsonPropertyName": function
	//Translations are 1) the only way to use a source field twice, and
	//2) the only way to *create* a field that does not map to a source field


	"core": //create UserInfo, standalone
	{
		"schemaName": "UserBase",
		"getFieldNamesFrom": 'firstLineOfFile',
		"fieldList": [],
		"maps": {
			"expressbook": {}
		},
		"translation": {
			"expressbook": {}
		}
	}
};
