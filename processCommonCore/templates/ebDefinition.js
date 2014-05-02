'use strict';

var explodeCompoundRefId=function(item, inx, entire){
qtools.dump({'\n\n===== entire =====\n':entire});
return item.replace(/(\w+)(RefId|LocalId)/, "$1.$2")
};
 var termFieldList=["Title",
				"AbbrevTitle",
				"YearLongTerm",
				"SequenceNum",
				"LocalId",
				"SchoolInfoLocalId"];
var schoolFieldList=["LeaInfoLocalId", "LocalId",	"StateProvinceId",	"NCESId",	"SchoolName",	"SchoolURL",	"OperationalStatus",	"CongressionalDistrict",	"CurrentTermRefId"];
var gradeLevelFieldList=["LocalId", 	"Title", 	"AbbrevTitle", 	"SequenceNum", 	"SuppressDisplay", 	"SchoolInfoLocalId"];		
var studentFieldList=["RefId", "Version", "FirstName", "LastName", "FullName", "LocalId", "StateProvinceId", "ProjectedGraduationYear", "OnTimeGraduationYear", "GraduationDate", "Title1Specified", "PrimaryRosmat.RefId", "GradeLevel.RefId"];


module.exports={
	
//NOTE: maps property are "sourceFileFieldName":"targetJsonPropertyName". Empty map, {}, emits entire fieldlist.
//ALSO: translations are executed *after* maps are set. Their format is: "targetJsonPropertyName": function
		//Translations are 1) the only way to use a source field twice, and
		//2) the only way to *create* a field that does not map to a source field

	
	"term": //"Section": //rosmat/init
		{
			"schemaName":"grades",
			"getFieldNamesFrom":'firstLineOfFile',
			"fieldList":termFieldList,
			"maps":{
			"expressbook":{
				"Title":"Title",
				"AbbrevTitle":"AbbrevTitle",
				"YearLongTerm":"YearLongTerm",
				"SequenceNum":"SequenceNum",
				"LocalId":"LocalId"
			}
				},
			"translation":{
				"expressbook":{
					"SequenceNum":function(itemObj, sourceItem){
					if (typeof(sourceItem["SequenceNum"])!=='undefined'){
						return +sourceItem["SequenceNum"]; //the unary + forces a string into a number
					}
					else{
						return '<!omitProperty!>';
					}	
					}
					}
			}
		},
		
	"termSchool": //"Section": //rosmat/init
		{
			"schemaName":"grades",
			"getFieldNamesFrom":'firstLineOfFile',
			"fieldList":termFieldList,
			"maps":{
					"expressbook":{
						"LocalId":"LocalId",	
						"SchoolInfoLocalId":"SchoolInfo.LocalId"
					}
				},
			"translation":{
				"expressbook":{
					"SequenceNum":function(itemObj, sourceItem){
					if (typeof(sourceItem["SequenceNum"])!=='undefined'){
						return +sourceItem["SequenceNum"]; //the unary + forces a string into a number
					}
					else{
						return '<!omitProperty!>';
					}	
					}
					}
			}
		},

	"gradeLevel"://"StudentBase": //student/save
		{
			"schemaName":"GradeLevel",
			"getFieldNamesFrom":'firstLineOfFile',
			"fieldList":gradeLevelFieldList,
			"maps":{
					"LocalId":"LocalId",
					"Title":"Title",
					"AbbrevTitle":"AbbrevTitle",
					"SequenceNum":"SequenceNum",
					"SuppressDisplay":"SuppressDisplay"
				},
			"translation":{
				"expressbook":{
					"SequenceNum":function(itemObj, sourceItem){
						return +sourceItem["SequenceNum"]; //the unary + forces a string into a number
					},
					"SuppressDisplay":function(itemObj, sourceItem){
					if (typeof(sourceItem["SuppressDisplay"])!=='undefined'){
						return +sourceItem["SuppressDisplay"]; //the unary + forces a string into a number
					}
					else{
						return '<!omitProperty!>';
					}	
					}
					}
			}
		},

	"gradeLevelSchool"://"StudentBase": //student/save
		{
			"schemaName":"GradeLevel",
			"getFieldNamesFrom":'firstLineOfFile',
			"fieldList":gradeLevelFieldList,
			"maps":{
					"expressbook":{
						"LocalId":"LocalId",
						"SchoolInfoLocalId":"SchoolInfo.LocalId"
					}
				},
			"translation":{
				"expressbook":{}
			}
		},

	"school"://"StudentBase": //student/save
		{
			"schemaName":"SchoolInfo",
			"getFieldNamesFrom":'firstLineOfFile',
			"fieldList":schoolFieldList,
			"maps":{
					"expressbook":{
						"LeaInfoLocalId":"LeaInfo.LocalId",
						"LocalId":"LocalId",
						"StateProvinceId":"StateProvinceId",
						"NCESId":"NCESId",
						"SchoolName":"SchoolName",
						"SchoolURL":"SchoolURL",
						"OperationalStatus":"OperationalStatus",
						"CongressionalDistrict":"CongressionalDistrict"
					}
				}
		},

	"schoolSetCurrentTerm"://"StudentBase": //student/save
		{
			"schemaName":"SchoolInfo",
			"getFieldNamesFrom":'firstLineOfFile',
			"fieldList":schoolFieldList,
			"maps":{
					"expressbook":{
					"LeaInfoLocalId":"LeaInfo.LocalId",
					"LocalId":"LocalId",
					"CurrentTermLocalId":"CurrentTerm.LocalId"
					}
				}
		},
		
		
		
		
	"student"://"StudentBase": //student/save
		{
			"schemaName":"StudentPersonal",
			"getFieldNamesFrom":'firstLineOfFile',
			"fieldList":studentFieldList,
			"maps":{
					"expressbook":{}
				}
		},
		
	"teacher"://"UserBase": //userInfo/save
		{
			"schemaName":"UserBase",
			"getFieldNamesFrom":'firstLineOfFile',
			"fieldList":
				["RefId", "Version", "UserName", "Password", "LDAP",
				"LastLogin", "LoginAttempts", "Active", "LocalId",
				"FirstName", "LastName", "MiddleName", "PreferredName",
				"PhoneNumber", "IgnoreImport"],
			"maps":{
					"expressbook":explodeCompoundRefId
				}
		},
	
	"rosmat": //"Section": //rosmat/init
		{
			"schemaName":"Rosmat",
			"getFieldNamesFrom":'firstLineOfFile',
			"fieldList":
				["RefId", "Version", "Title", "AbbrevTitle",
				"Expiration", "MarkingRule", "ImportCode", "RosmatType",
				"JsonStorage", "OwnerUserInfoRefId", "SchoolInfoRefId",
				"FixedCurriculumRefId", "SourceStudentListRefId",
				"LocalId"],
			"maps":{
					"expressbook":explodeCompoundRefId
				}
		},

	"studentAssignment"://"SectionStudent": //rosmat/attachStudents
		{
			"schemaName":"StudentAssignment",
			"getFieldNamesFrom":'firstLineOfFile',
			"fieldList":
				["Rosmat.RefId", "LocalId", "RefId"],
			"maps":{
					"expressbook":explodeCompoundRefId
				}
		},
		
	"teacherAssignment"://"SectionStaff": //rosmat/addTeachers
		{
			"schemaName":"UserInfoAssignment",
			"getFieldNamesFrom":'firstLineOfFile',
			"fieldList":
				["Rosmat.RefId", "LocalId", "RefId"],
			"maps":{
					"expressbook":explodeCompoundRefId
				}
		},




};