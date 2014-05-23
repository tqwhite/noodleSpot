'use strict';
var qtools = require('qtools');
qtools = new qtools(module);

var explodeCompoundRefId=function(item, inx, entire){
qtools.dump({'\n\n===== entire =====\n':entire});
return item.replace(/(\w+)(RefId|LocalId)/, "$1.$2")
};
var termFieldList=["Title", "AbbrevTitle", "YearLongTerm", "SequenceNum", "LocalId", "SchoolInfoLocalId"]; 
var schoolFieldList=["LeaInfoLocalId", "LocalId",	"StateProvinceId",	"NCESId",	"SchoolName",	"SchoolURL",	"OperationalStatus",	"CongressionalDistrict",	"CurrentTermRefId"];
var gradeLevelFieldList=["LocalId", 	"Title", 	"AbbrevTitle", 	"SequenceNum", 	"SuppressDisplay", 	"SchoolInfoLocalId"];		
var studentFieldList=["RefId", "Version", "FirstName", "LastName", "FullName", "LocalId", "StateProvinceId", "ProjectedGraduationYear", "OnTimeGraduationYear", "GraduationDate", "Title1Specified", "PrimaryRosmat.RefId", "GradeLevel.RefId"];
var teacherFieldList=["RefId", "Version", "UserName", "Password", "LDAP", "LastLogin", "LoginAttempts", "Active", "LocalId", "FirstName", "LastName", "MiddleName", "PreferredName", "PhoneNumber", "IgnoreImport"]; 



var editFinalObjectives=function(inObjList){
	var outList=[];
	
	for (var i=0, len=inObjList.length; i<len; i++){
		var element=inObjList[i];
		element.Standards=element.Components; //rename only for the top level
		delete element.Components;
		outList.push(element);
	}
	return outList;
}
var objectiveAssembler=require('../assemblers/nestedJson.js');
	objectiveAssembler=new objectiveAssembler({
						"linkPropertyContainerName":"Parent",
						"attachmentListPropertySpec":"$type",
						"destPropertyObjectPropertyName":"",
						"finalObjectCustomEditor":editFinalObjectives
					});
var inx=1000;
module.exports={
	
//NOTE: maps property are "sourceFileFieldName":"targetJsonPropertyName". Empty map, {}, emits entire fieldlist.
//ALSO: translations are executed *after* maps are set. Their format is: "targetJsonPropertyName": function
		//Translations are 1) the only way to use a source field twice, and
		//2) the only way to *create* a field that does not map to a source field
//return '<!omitProperty!>'; will remove the property entirely

		
	"assignSpecialty"://create UserInfo, standalone
		{
			"schemaName":"assignSpecialty",
			"getFieldNamesFrom":'firstLineOfFile',
			"fieldList":[],
			"maps":{
				"expressbook":{}
			},
			"translation":{
				"expressbook":{}
			},
			"assembler":{
				"expressbook":''
			}
		},

		
	"assignTerm"://create UserInfo, standalone
		{
			"schemaName":"assignTerm",
			"getFieldNamesFrom":'firstLineOfFile',
			"fieldList":[],
			"maps":{
				"expressbook":{}
			},
			"translation":{
				"expressbook":{}
			},
			"assembler":{
				"expressbook":''
			}
		},

		
	"assignGradeLevel"://create UserInfo, standalone
		{
			"schemaName":"assignGradeLevel",
			"getFieldNamesFrom":'firstLineOfFile',
			"fieldList":[],
			"maps":{
				"expressbook":{}
			},
			"translation":{
				"expressbook":{}
			},
			"assembler":{
				"expressbook":''
			}
		},

		
	"objective"://create UserInfo, standalone
		{
			"schemaName":"UserBase",
			"getFieldNamesFrom":'firstLineOfFile',
			"fieldList":[],
			"maps":{
				"expressbook":{}
			},
			"translation":{
			"Description":function(itemObj, sourceItem){
				if (!sourceItem.Description){ return sourceItem.Title;}
				else{ return sourceItem.Description;}
			},
				"expressbook":{
					"$type":function(itemObj, sourceItem){
						if (sourceItem['$type']=='Standards'){
							return 'Components'; //unfriendly property name demanded by server
						}
						else{
							return sourceItem['$type'];
						}
					},
					Parent:function(){return '<!omitProperty!>';},
					
 					ParentStandard:function(){return {};}
// 				,	Components:function(){return [];},
//  				Activities:function(){return [];},
//  				Applicability:function(){return [];},
// 					CanDelete:function(){return true;},
// 					CreateNew:function(){return true;},
// 					ExportCode:function(){return '';},
// 					IsDetailed:function(){return true;},
// 					MarkScale:function(){return {};},
// 					RefId:function(){return qtools.newGuid();},
// 					SequenceNum:function(){return inx++;},
// 					Specialties:function(){return [];},
// 					SuppressDisplay:function(){return false;},
// 					Terms:function(){return [];}
					
					
				}
			},
			"assembler":{
				"expressbook":objectiveAssembler
			}
		},

		
	"teacher"://create UserInfo, standalone
		{
			"schemaName":"UserBase",
			"getFieldNamesFrom":'firstLineOfFile',
			"fieldList":teacherFieldList,
			"maps":{},
			"translation":{
				"expressbook":{
					"Active":function(itemObj, sourceItem){
					if (typeof(sourceItem["Active"])!=='undefined'){
						return +sourceItem["Active"]; //the unary + forces a string into a number
					}
					else{
						return '<!omitProperty!>';
					}	
					},
					"LDAP":function(itemObj, sourceItem){
					if (typeof(sourceItem["LDAP"])!=='undefined'){
						return +sourceItem["LDAP"]; //the unary + forces a string into a number
					}
					else{
						return '<!omitProperty!>';
					}	
					}
					}
			}
		},
	
	"homeroom": //"Section": //rosmat/init
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
					"expressbook":{}
				}
		},

	"assignStudent"://"SectionStudent": //rosmat/attachStudents
		{
			"schemaName":"assignStudent",
			"getFieldNamesFrom":'firstLineOfFile',
			"fieldList":
				["Rosmat.RefId", "LocalId", "RefId"],
			"maps":{
					"expressbook":{}
				}
		},
		
	"assignTeacher"://"SectionStaff": //rosmat/addTeachers
		{
			"schemaName":"assignTeacher",
			"getFieldNamesFrom":'firstLineOfFile',
			"fieldList":
				["Rosmat.RefId", "LocalId", "RefId"],
			"maps":{
					"expressbook":{}
				}
		},
		
		
		
	"student"://define student record, attaches personal gradelevel
		{
			"schemaName":"StudentPersonal",
			"getFieldNamesFrom":'firstLineOfFile',
			"fieldList":studentFieldList,
			"maps":{
					"expressbook":{}
				}
		},


	
	"term": //defines term, standalone
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
		
	"termSchool": //attaches terms to schools
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

	"gradeLevel"://defines gradeLevel, standalone
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

	"gradeLevelSchool"://attaches gradeLevels to schools
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

	"school"://defines school, standalone
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

	"schoolSetCurrentTerm"://sets the current term for each school
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
		}

};