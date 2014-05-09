'use strict';
var qtools = require('qtools');

var schoolFieldList=["District", 	"District Type", 	"School Code", 	"School Name", 	"SchoolMinimumGrade", 	"SchoolMaximumGrade", 	"SchoolLevelName", 	" SchoolAreaName", 	"SuperintendentLastName", 	"SuperintendentFirstName", 	"SuperintendentMiddleName", 	"AreaSuperintendentLastName", 	"AreaSuperintendentFirstName", 	"AreaSuperintendentMiddleName", 	"PrincipalLastName", 	"PrincipalFirstName", 	"PrincipalMiddleName", 	"SchoolPrimaryPhone", 	"SchoolAlternatePhone", 	"SchoolFaxNumber", 	"AddressLine1", 	"AddressLine2", 	"AddressLine3", 	"City Name", 	"CountyName", 	"StateCode", 	"StateName", 	"ZipCode"]
var termFieldList=["SchoolYear", "SchoolNumber", "Term Description", "StartDate", "EndDate", "TermType", "Term Number"]; 

var synthSeq=0;
var syntheticSequenceNumber=function(itemObj, sourceItem){
	return synthSeq++;
}


module.exports={

	
//NOTE: maps property are "sourceFileFieldName":"targetJsonPropertyName". Empty map, {}, emits entire fieldlist.
//ALSO: translations are executed *after* maps are set. Their format is: "targetJsonPropertyName": function
		//Translations are 1) the only way to use a source field twice, and
		//2) the only way to *create* a field that does not map to a source field

//[doc1] - MN SIS Extract Files - Unified_V9(In Progress)
//[doc2] - Plans4.x Import File Formats
//[doc3] - DWextractLayout




	"teacher"://[doc1-User Base File]
		{
			"schemaName":"UserBase",
			"fieldList":
				["DistrictCode", "Filler2", "StaffUniqueIdentifier",
				"SchoolYearBeg", "SchoolYearEnd", "EmployeeID",
				"LocalStaffCode", "State School/PlantNumber",
				"LastName", "MiddleName", "FirstName", "FullName",
				"JobCode1", "JobCode2", "JobCode3", "JobCode4", "Phone",
				"Email", "Department1", "Department2", "Department3",
				"Department4", "Status", "PrimaryLocationFlag", "Login Name", 
				"Password", "Default Password"],
			"maps":{
					"expressbook":{
						"State School/PlantNumber":"SchoolInfo.RefId",
						"EmployeeID":"LocalId",
						"LastName":"MiddleName",
						"MiddleName":"LastName",
						"FirstName":"FirstName",
						"FullName":"PreferredName",
						"Phone":"PhoneNumber",
						"Login Name":"UserName",
						"Password":"Password"
						}
				}, 

			"translation": {
				"expressbook": {
					"Active": function(itemObj, sourceItem) {
						if (sourceItem.Status==='A'){
							return 1;
						}
						else{
							return 0;
						}
					},

					"LDAP": function(itemObj, sourceItem) {
						return 0;
					},

					"UserName": function(itemObj, sourceItem) {
						if (sourceItem["Login Name"]){
							return sourceItem["Login Name"];
						}
						else{
							return sourceItem["EmployeeID"];
						}
					},

					"Password": function(itemObj, sourceItem) {
						if (sourceItem["Login Name"]){
							return sourceItem["Password"];
						}
						else{
							return 'test';
						}
					}
				}

			}
		},
	
	"homeroom": //[doc1-Section File]
		{
			"schemaName":"Section",
			"fieldList":
				["DistrictCode", "DistrictType", "SchoolCode",
				"SectionNumber", "CourseNumber", "TermAbbrev",
				"SchoolYearBeg", "SchoolYearEnd", "Grade", "BeginDate",
				"EndDate", "Location", "HomeroomFlag", "BegPeriodNum",
				"EndPeriodNum", "Credit", "TeamCode", "Track"],
			"maps":{
					"expressbook":{
						"SchoolCode":"SchoolInfo.LocalId",
						"Grade":"GradeLevel.LocalId"
						}
				}, 

			"translation": {
				"expressbook": {
					"RosmatType": function(itemObj, sourceItem) {
						if (sourceItem.HomeroomFlag==='Y'){
							return 'Homeroom';
						}
						else{
							return 'Adhawk';
						}
					},

					"Title": function(itemObj, sourceItem) {
						if (sourceItem.HomeroomFlag==='Y'){
							var prefix='HR:';
						}
						else{
							var prefix='';
						}
						return prefix+sourceItem.SchoolCode+':'+sourceItem.Grade+':'+sourceItem.SectionNumber;
					},

					"LocalId": function(itemObj, sourceItem) {
						return sourceItem.SectionNumber;
					},

					"AbbrevTitle": function(itemObj, sourceItem) {
						if (sourceItem.HomeroomFlag==='Y'){
							var prefix='HR:';
						}
						else{
							var prefix='';
						}
						return prefix+sourceItem.SchoolCode;
					},

					"JsonStorage": function(itemObj, sourceItem) {
						return "{}";
					},

					"MarkingRule": function(itemObj, sourceItem) {
						return 1;
					}
				}

			}
		},

	"studentAssignment"://[doc1-Student Enrollment File]
		{
			"schemaName":"SectionStudent",
			"fieldList":
				["DistrictCode", "DistrictType", "SchoolCode",
				"StudentUniqueIdentifier", "StateStudentNumber",
				"LocalStudentNumber", "SchoolYearBeg", "SchoolYearEnd",
				"SectionNumber", "CourseNumber", "GradeLevel",
				"EntryDate", "WithdrawalDate", "EntryType",
				"Withdrawaltype"],
			"maps":{
					"expressbook":{
						"StudentUniqueIdentifier":"LocalId",
						"SectionNumber":"Rosmat.LocalId"
						}
				}
		},

	"teacherAssignment"://[doc1-Section Staff File ]
		{
			"schemaName":"SectionStaff",
			"fieldList":
				["DistrictCode", "DistrictType", "SchoolCode",
				"StaffUniqueIdentifier", "LocalStaffCode",
				"SchoolYearBeg", "SchoolYearEnd", "SectionNumber",
				"CourseNumber", "Grade", "PrimaryInstructorFlag",
				"LastName", "MiddleName", "FirstName"],
			"maps":{
					"expressbook":{
						"StaffUniqueIdentifier":"LocalId",
						"SectionNumber":"Rosmat.LocalId"
						}
				}
		},
		
		

	"student"://define student, standalone. from: [doc1-Student Base File]
		{
			"schemaName":"StudentBase",
			"fieldList":
				["DistrictCode", "DistrictType", "SchoolCode",
				"SchoolYearBegin", "SchoolYearEnd",
				"StudentUniqueIdentifier", "StateStudentNumber",
				"LocalStudentNumber", "GradeLevel", "Graduation Year",
				"Student Status", "LastName", "MiddleName", "FirstName",
				"Suffix", "Prefix", "FullName", "PreferredName",
				"LastSchoolAttended", "Concurrent Enrollment",
				"BirthDate", "Self Guardian Flag", "Gender", "SSN",
				"BirthPlace", "BirthState", "BirthCountry",
				"EthnicityCode"],
			"maps":{
					"expressbook":{
						"StudentUniqueIdentifier": "LocalId",
						"LastName": "LastName",
						"FullName": "FullName",
						"FirstName": "FirstName",
					}
				},
			"translation":{
				"expressbook":{
				}
			}
		},	
		
		
	"term": //define term, attach to school, from: [doc3-Term File]
		{
			"schemaName":"??",
			"fieldList":termFieldList,
			"maps":{
					"expressbook":{
						"Term Description":"Title",
						"Term Number":"AbbrevTitle",
						"TermType":"YearLongTerm",
						"SchoolNumber":"SchoolInfo.LocalId"
					}
				},
			"translation":{
				"expressbook":{
					"SequenceNum":function(itemObj, sourceItem){
						var millisecondsPerDay=86400000,
							offset=Date.parse("1/1/2014")/millisecondsPerDay,
							start=Date.parse(sourceItem["StartDate"])/millisecondsPerDay,
							daysSinceOffset=start-offset
						return Math.round(daysSinceOffset);
					},
					
					"LocalId":function(itemObj, sourceItem){
					if (typeof(sourceItem["Term Number"])!=='undefined'){
						return sourceItem["Term Number"];
					}
					else{
						return '<!omitProperty!>';
					}	
					}
					}
					
			}
		},
		
	"gradeLevel": //define gradeLevel, attach to school, from: [doc3-Grade]
		{
			"schemaName":"grades",
			"fieldList":
				["SchoolID",
				"Grade",
				"Grade Description",
				"School Year Begin",
				"School Year End"],
			"maps":{
					"expressbook":{
						"Grade Description":"Title",
						"Grade":"AbbrevTitle",
						"SchoolID":"SchoolInfo.LocalId"
					}
				},
			"translation":{
				"expressbook":{
					"LocalId":function(itemObj, sourceItem){
						return sourceItem["Grade"];
					},
					"SequenceNum":syntheticSequenceNumber
				}
			}
			
		},	
		
	"school": //define school, standalone, from: [doc3-School File]
		{
			"schemaName":"from Plans4.x Import File Formats",
			"fieldList":schoolFieldList,
			"maps":{
					"expressbook":{
						"District":"LeaInfo.LocalId",
						"School Code":"LocalId",
						"School Name":"SchoolName",
						"StateCode":"StateProvinceId"
					}
				},
			"translation":{}
		},

	"schoolSetCurrentTerm"://sets currentTerm field in school, no UFF analog
		{
			"schemaName":"SchoolInfo",
			"getFieldNamesFrom":'firstLineOfFile',
			"fieldList":schoolFieldList,
			"maps":{
					"expressbook":{
					"District":"LeaInfo.LocalId",
					"School Code":"LocalId",
					"Term Number":"CurrentTerm.LocalId"
					}
				}
		}

};

/*
//====================================
	"StudentEnrollment": //unused
		{
			"fieldList":
				["DistrictCode", "DistrictType",
				"StudentUniqueIdentifier", "StateStudentNumber",
				"LocalStudentNumber", "SchoolCode", "SchoolYearBeg",
				"SchoolYearEnd", "GradeLevel", "EntryDate",
				"WithdrawalDate", "EntryTypeCode", "WithdrawalTypeCode",
				"StudentResidentDistrictCode",
				"StudentResidentDIstrictType",
				"StudentResidentSchoolCode", "StateAidCategory",
				"LastLocationofAttendance", "PercentEnrolled",
				"AttendanceDays", "MembershipDays",
				"PostSecondaryOption", "PSEOHighSchoolParticipationHrs", 
				"HomeBoundServiceIndicator",
				"SpecialEducationEvaluationStatus",
				"SpecialEdInstructionalSetting", "LEP", "LEPBeginDate",
				"Gifted&TalentedPartiicipation", "Gender",
				"EthnicityCode", "BirthDate", "HomePrimaryLanguage",
				"PrimaryDisability", "TransportationCategory",
				"EconomicIndicator", "MigrantIndicator",
				"StudentTitle1Indicator", "HomelessStudentFlag",
				"TransportingDistrictCode", "TransportingDistrictType",
				"WardofStateFlag", "IndependentStudyFlag",
				"SupplementalEducationServices",
				"SpecialEnrollmentCode", "PrimarySchoolFlag", "SpecEd Flag", 
				"504 Flag", "Track", "TeamCode", "Promotion Status", 
				"Program of Study", "Enrollment Status",
				"Filler", "Filler ", "Filler", "Filler", "Filler",
				"Filler", "AdvisorID/Name", "Filler", "ELLServiceLevel",
				"Hispanic-Latino", "American Indian Alaska Native",
				"Asian", "Black-African American", "Native Hawaiian-Pacific Islander", 
				"White", "First US School Entry Date", "New to Country Flag", 
				"Filler ", "Next Year School"],
			"maps":{
					"expressbook":{
						}
				}
		},


	"Demo": //note fieldList directive is "firstLineOfFile"
		{
			"fieldList":
				"firstLineOfFile",
			"maps":{
					"expressbook":{
						}
				}
		},


	"Course": //not right now
		{
			"fieldList":
				["DistrictCode", "DistrictType", "SchoolCode",
				"CourseNumber", "SchoolYearBeg", "SchoolYearEnd",
				"CourseDesc", "CourseAbbrev", "SubjectArea/Department",
				"Credit", "GradeMinimum", "GradeMaximum"],
			"maps":{
					"expressbook":{
						}
				}
		},


	"UserRole": //??
		{
			"fieldList":
				["DistrictCode", "Filler2", "StaffUniqueIdentifier",
				"SchoolYearBeg", "SchoolYearEnd", "System", "Role",
				"State School/PlantNumber"]
		}
*/