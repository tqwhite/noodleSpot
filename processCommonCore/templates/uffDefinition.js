'use strict';
var qtools = require('qtools');
module.exports={
	
	//also need school/save and gradeLevel/save and term/save

	
	"term": //"Section": //rosmat/init
		{
			"schemaName":"grades",
			"fieldList":
				["SchoolYear",
				"SchoolNumber",
				"Term Description",
				"StartDate",
				"EndDate",
				"TermType",
				"Term Number"],
			"maps":{
					"expressbook":{
						"Term Description":"Title",
						"Term Number":"AbbrevTitle",
						"TermType":"YearLongTerm",
						"EndDate":"SequenceNum"
					}
				},
			"translation":{
				"expressbook":{
					"YearLongTerm":function(itemObj, sourceItem){
						return (sourceItem.TermType==='YR')?1:0;
					},
					"SequenceNum":function(itemObj, sourceItem){

						return +sourceItem["Term Number"]; //the unary + forces a string into a number
					},
					"LocalId":function(itemObj, sourceItem){
						return sourceItem["Term Description"];
					},
					"SchoolInfo.LocalId":function(itemObj, sourceItem){
					
					if (qtools.isNotEmpty(sourceItem["SchoolNumber"])){
						return sourceItem["SchoolNumber"];
					}	
						else{
							return "<!omitProperty!>";
					}
					}
				}
			}
		},
		
	"gradeLevel": //"Section": //rosmat/init
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
					"SequenceNum":function(itemObj, sourceItem){
						return +sourceItem["Grade"]; //the unary + forces a string into a number
					}
				}
			}
			
		},

	"student"://"StudentBase": //student/save
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


	"teacher"://"UserBase": //userInfo/save
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
						"UserName":"Login Name",
						"Password":"Password",
						"Active":"Status",
						"LocalId":"EmployeeID",
						"FirstName":"FirstName",
						"LastName":"LastName",
						"MiddleName":"MiddleName",
						"PreferredName":"FullName"
						}
				}
		},
	
	"rosmat": //"Section": //rosmat/init
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
						}
				}
		},


	"studentAssignment"://"SectionStudent": //rosmat/attachStudents
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
						}
				}
		},


	"teacherAssignment"://"SectionStaff": //rosmat/addTeachers
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