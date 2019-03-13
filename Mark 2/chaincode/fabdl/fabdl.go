package main

import (
	//	"cmd/go/internal/str"
	// "bytes"
	"encoding/json"
	"fmt"

	//"strconv"
	//	"strings"
	// "time"
	"github.com/hyperledger/fabric/core/chaincode/shim"
	pb "github.com/hyperledger/fabric/protos/peer"
	//"reflect"
)

type SimpleChainCode struct {
}

// SEPERATE DOCUMENT 1
type UserDetails struct {
	DocType      		    string             `json:"objectType"`
	ID           		    string             `json:"id"`
	BasicData_1  		    basicData1         `json:"basicdata1"`
	BasicData_2  		    basicData2         `json:"basicdata2"`
	AddressData  		    Address            `json:"address"`
}

// SEPERATE DOCUMENT 2
type LicenseInfos struct {
	DocType      			string              `json:"objectType"`
	ID           			string              `json:"id"`					//REFERS UserDetails's ID(json:"id")
	RTO_ID       			string              `json:"rto"`
	LicenseData  			[]LicenseInfo       `json:"licensedata"`
	VehiclesData 			[]VehiclesOwned     `json:"vehiclesowned"`
}

type basicData1 struct {
	First_Name    			string		 	    `json:"firstname"`
	Last_Name     			string		 	    `json:"lastname"`
	UIDNo         			string		 	    `json:"uid"`
	Gender        			string		 	    `json:"gender"`
	DOB           			string		 	    `json:"dob"`
	Age           			string		 	    `json:"age"`
	ContactNumber 			string		 	    `json:"contact_number"`
	EmailID       			string		 	    `json:"emailid"`
	PhotoHash	  			string			    `json:"photohash"`	
	DocumentHash  			string			    `json:"dochash"`	
}

type basicData2 struct {
	RelFirstName    		string	            `json:"relfname"`
	RelLastName     		string	            `json:"rellname"`
	BirthPlace      		string	            `json:"birthplace"`
	Nationality     		string	            `json:"nationality"`
	EmergencyNumber 		string	            `json:"emergency_number"`
	BloodGroup      		string	            `json:"bloodgroup"`
}

type Address struct {
	AddressLine1 			string 			    `json:"addressline1"`
	AddressLine2 			string 			    `json:"addressline2"`
	City         			string 			    `json:"city"`
	Pin          			string 			    `json:"pincode"`
	State        			string 			    `json:"state"`
}

// SEPERATE DOC 2
type RTOInfo struct {
  	DocType       			string		        `json:"objectType"`
	RTOID         			string  	        `json:"rtoid"`
	AddressData   			Address 	        `json:"address"`
	ContactNumber 			string  	        `json:"contactno"`
}

type VehiclesOwned struct {
	VehicleType  			string				`json:"vehicletype"`    //2,3,4 wheeler, truck,etc
	NumberPlate  			string				`json:"numberplate"`    
	CarCompany   			string				`json:"carcompany"`     //Maruti,etc
	CarMake      			string				`json:"carmake"`        //800,alto
	CarColour    			string				`json:"carcolour"`
	ChasisNumber 			string				`json:"chasisnumber"`
}

type LicenseInfo struct {
	FileNumber			    string				`json:"filenumber"`
	LicenseType			    string				`json:"licensetype"`				//Learner, Permanent
	LicenseNumber		    string				`json:"licensenumber"`
	DateOfIssue			    string				`json:"dateofissue"`
	DateOfExpiry		    string				`json:"dateofexpiry"`
	ReasonOfInactivity		string				`json:"reason"`
	TestData			    []TestInfo			`json:"testdata"`
	IsPassWritten		    string			  	`json:"ispass_written"`
	IsPassSim			    string			  	`json:"ispass_sim"`
	IsPassPrac			    string			  	`json:"ispass_prac"`
	IsActive		  	    string				`json:"isactive"`
	Tickets      			[]TicketInfo     	`json:"tickets"`
	FileStatus				[]FileStatusInfo	`json:"filestatus"`	
}

type TicketInfo struct {
	TicketIssuer	      	string				`json:"ticketissuer"`	    			//Issuer cops id number
	TicketID	  	      	string				`json:"ticketid"`				      	//Gotta figure out
	Reason		  	      	string				`json:"reason"`
	DateOfIssue		      	string				`json:"dateofissue"`
	TimeOfIssue		      	string				`json:"timeofissue"`
	Place		    	  	string				`json:"place"`
	IsPaid		  	      	string				`json:"ispaid"`
	Amount					string				`json:"amount"`
}

type TestInfo struct {
	TestType 		      	string				`json:"testtype"`						//(written, simulated, practical)
	Score				    string				`json:"score"`
	MaxMarks        		string				`json:"maxmarks"`
	PassingMarks		    string				`json:"passingmarks"`
	Invigilator			    string				`json:"officerid"`
}

// SEPERATE DOC 3
type OfficerInfo struct {
	OfficerID          		string			  	`json:"id"`								//officer's phone number
	DocType             	string				`json:"objectType"`
	BasicData_1 	      	basicData1			`json:"basicdata"`
	RTO_ID			        string 			  	`json:"rtoid"`
}

type FileStatusInfo struct {
	Status					string				`json:"filestatus"`
	Date					string				`json:"date"`
	Time					string				`json:"string"`
}

func main() {
	err := shim.Start(new(SimpleChainCode))
	if err != nil {
		fmt.Printf("Error in starting the simple chaincode: %s", err)
	}
}

func (t *SimpleChainCode) Init(stub shim.ChaincodeStubInterface) pb.Response {
	return shim.Success(nil)
}

func (t *SimpleChainCode) Invoke(stub shim.ChaincodeStubInterface) pb.Response {
	function, args := stub.GetFunctionAndParameters()
	fmt.Println("The function being invoked is: " + function)

	if function == "CreateUserAccount" 			{ //CREATE A NEW ENTRY
		return t.CreateUserAccount(stub, args)
	} else if function == "AddBaseData2" 		{ //ADD ENTRIES of baseData2
		return t.AddBaseData2(stub, args)
	} else if function == "AddAddressData"  	{ //ADD ENTRIES of baseData2
		return t.AddAddressData(stub, args)
	} else if function == "AddVehicle" 			{ //ADD USER'S VEHICLE 
		return t.AddVehicle(stub, args)
	} else if function == "AddRTO" 				{ //ADD A NEW RTO TO THE SYSTEM
		return t.AddRTO(stub, args)
	} else if function == "AddOfficer" 			{ //REGISTER A OFFICER TO THE SYSTEM
		return t.AddOfficer(stub, args)
	} else if function == "LicenseApply" 		{ //CREATE ANY GIVEN DL'S APPLICATION FILE
		return t.LicenseApply(stub, args)
	} else if function == "AddTestResult" 		{ //ADD TEST SCORE AND SUBSEQUENT PASS FAIL FLAGS
		return t.AddTestResult(stub, args)
	} else if function == "ApproveApplication" 	{ //APPROVE THE LICENSE
		return t.ApproveApplication(stub, args)
	} else if function == "AddTicket" 			{ //REGISTER A TICKET GENERATED FOR USER
		return t.AddTicket(stub, args)
	} else if function == "PayFine" 			{ //PAY FINE ON A TICKET
		return t.PayFine(stub, args)
	} else if function == "SuspendLicense"		{ //SUSPEND A GIVEN LICENSE
		return t.SuspendLicense(stub, args)
	} else if function == "IsLicenseActive"		{ //CHECK IF A GIVEN LICENSE IS ACTIVE
		return t.IsLicenseActive(stub, args)
	} else if function == "IsFinePaid"			{ //CHECK IF A GIVEN TICKET'S FINE HAS BEEN PAID
		return t.IsFinePaid(stub, args)
	} else if function == "FetchListOfTickets"	{ //FETCH LIST OF ALL TICKETS FOR A GIVEN USER
		return t.FetchListOfTickets(stub, args)
    } else if function == "FetchTestResults"	{ //FETCH LIST OF ALL TEST RESULTS FOR A GIVEN USER
		return t.FetchTestResults(stub, args)
	} else if function == "UpdateStatus"		{ //UPDATE STATUSES OF THE APPLICATION
		return t.UpdateStatus(stub, args)
	} else if function == "FetchStatus"			{ //FETCH CURRENT STATUS OF THE APPLICATION
		return t.FetchStatus(stub, args)
	} 
	
    fmt.Println("Function not found: " + function)
	return shim.Error("Received unknown function invocation")
}

// id, firstname, lastname, gender, dob, age, contact_number, emailid, photohash, dochash
func (t *SimpleChainCode) CreateUserAccount(stub shim.ChaincodeStubInterface, args []string) pb.Response {

	if len(args) != 10 {
		return shim.Error("Incorrect number of arguments. Expecting 10")
	}

	for i := 0; i < 10; i++ {
		if len(args[i]) <= 0 {
			ERR := "Argument " + string(i) + " should be non empty"
			return shim.Error(ERR)
		}
	}

	objectType 	:= "basicData"
	id 			:= args[0]
	firstname   := args[1]
	lastname := args[2]
	gender := args[3]
	dob := args[4]
	age := args[5]
	contact_number := args[6]
	emailid := args[7]
	photohash := args[8]
	dochash := args[9]

	var baseData UserDetails
	baseData.ID = id
	baseData.DocType = objectType
	baseData.BasicData_1.First_Name = firstname
	baseData.BasicData_1.Last_Name = lastname
	baseData.BasicData_1.UIDNo = id
	baseData.BasicData_1.Gender = gender
	baseData.BasicData_1.DOB = dob
	baseData.BasicData_1.Age = age
	baseData.BasicData_1.ContactNumber = contact_number
	baseData.BasicData_1.EmailID = emailid
	baseData.BasicData_1.PhotoHash = photohash
	baseData.BasicData_1.DocumentHash = dochash

	dataJSONasBytes, err := json.Marshal(baseData)
	if err != nil {
		return shim.Error(err.Error())
	}

	err = stub.PutState(string(id), dataJSONasBytes)
	if err != nil {
		return shim.Error(err.Error())
	}

	return shim.Success(nil)
}

// id, relfname, rellname, pob, nationality, emerno, bg
func (t *SimpleChainCode) AddBaseData2(stub shim.ChaincodeStubInterface, args []string) pb.Response {

	if len(args) != 7 {
		return shim.Error("Incorrect number of arguments. Expecting 7")
	}

	for i := 0; i < 7; i++ {
		if len(args[i]) <= 0 {
			ERR := "Argument " + string(i) + " should be non empty"
			return shim.Error(ERR)
		}
	}

	id := args[0]
	dataAsBytes, err := stub.GetState(id)
	if err != nil {
		return shim.Error("Failed to get user details: " + err.Error())
	} else if dataAsBytes == nil {
		return shim.Error("This user doesn't exist: " + id)
	}

	var baseData UserDetails
	// baseData := UserDetails{}
	err = json.Unmarshal(dataAsBytes, &baseData) //unmarshal it aka JSON.parse()
	if err != nil {
		return shim.Error(err.Error())
	}

	relfname := args[1]
	rellname := args[2]
	pob := args[3]
	nationality := args[4]
	emerno := args[5]
	bg := args[6]

	baseData.BasicData_2.RelFirstName = relfname
	baseData.BasicData_2.RelLastName = rellname
	baseData.BasicData_2.BirthPlace = pob
	baseData.BasicData_2.Nationality = nationality
	baseData.BasicData_2.EmergencyNumber = emerno
	baseData.BasicData_2.BloodGroup = bg

	dataJSONasBytes, err := json.Marshal(baseData)
	if err != nil {
		return shim.Error(err.Error())
	}

	err = stub.PutState(id, dataJSONasBytes)
	if err != nil {
		return shim.Error(err.Error())
	}

	return shim.Success(nil)
}

// id, addressline1, addressline2, city, pincode, state
func (t *SimpleChainCode) AddAddressData(stub shim.ChaincodeStubInterface, args []string) pb.Response {

	if len(args) != 6 {
		return shim.Error("Incorrect number of arguments. Expecting 6")
	}

	for i := 0; i < 6; i++ {
		if len(args[i]) <= 0 {
			ERR := "Argument " + string(i) + " should be non empty"
			return shim.Error(ERR)
		}
	}

	id := args[0]
	dataAsBytes, err := stub.GetState(id)
	if err != nil {
		return shim.Error("Failed to get user details: " + err.Error())
	} else if dataAsBytes == nil {
		return shim.Error("This user doesn't exist: " + id)
	}

	var baseData UserDetails
	err = json.Unmarshal(dataAsBytes, &baseData) //unmarshal it aka JSON.parse()
	if err != nil {
		return shim.Error(err.Error())
	}

	addressline1 := args[1]
	addressline2 := args[2]
	city := args[3]
	pincode := args[4]
	state := args[5]

	baseData.AddressData.AddressLine1 = addressline1
	baseData.AddressData.AddressLine2 = addressline2
	baseData.AddressData.City = city
	baseData.AddressData.Pin = pincode
  baseData.AddressData.State = state
  baseData.RTO_ID = pincode

	dataJSONasBytes, err := json.Marshal(baseData)
	if err != nil {
		return shim.Error(err.Error())
	}

	err = stub.PutState(id, dataJSONasBytes)
	if err != nil {
		return shim.Error(err.Error())
	}

	return shim.Success(nil)
}

// id, vehicletype, numberplate, carcompany, carmake, carcolour, chasisnumber
func (t *SimpleChainCode) AddVehicle(stub shim.ChaincodeStubInterface, args []string) pb.Response {

	if len(args) != 7 {
		return shim.Error("Incorrect number of arguments. Expecting 7")
	}

	for i := 0; i < 7; i++ {
		if len(args[i]) <= 0 {
			ERR := "Argument " + string(i) + " should be non empty"
			return shim.Error(ERR)
		}
	}

	id := args[0]
	vehicletype := args[1]
	numberplate := args[2]
	carcompany := args[3]
	carmake := args[4]
	carcolour := args[5]
	chasisnumber := args[6]
	
	
	dataAsBytes, err := stub.GetState(id)
	if err != nil {
		return shim.Error("Failed to get marble: " + err.Error())
	} else if dataAsBytes == nil {
		fmt.Println("This data already exists: " + string(dataAsBytes))
		return shim.Error("This user doesn't exist: " + id)
	}
	
	var baseData UserDetails
	err = json.Unmarshal(dataAsBytes, &baseData) //unmarshal it aka JSON.parse()
	if err != nil {
		return shim.Error(err.Error())
	}
	
	var vehiclesdata VehiclesOwned
	vehiclesdata.VehicleType = vehicletype
	vehiclesdata.NumberPlate = numberplate
	vehiclesdata.CarCompany =  carcompany
	vehiclesdata.CarMake =     carmake
	vehiclesdata.CarColour =   carcolour
	vehiclesdata.ChasisNumber =chasisnumber
	
	baseData.VehiclesData = append(baseData.VehiclesData, vehiclesdata)

	dataJSONasBytes, err := json.Marshal(baseData)
	if err != nil {
		return shim.Error(err.Error())
	}

	err = stub.PutState(id, dataJSONasBytes)
	if err != nil {
		return shim.Error(err.Error())
	}

	return shim.Success(nil)
}

// id, addline1, addline2, city, state, contactno
func (t *SimpleChainCode) AddRTO(stub shim.ChaincodeStubInterface, args []string) pb.Response {

	if len(args) != 6 {
		return shim.Error("Incorrect number of arguments. Expecting 6")
	}

	for i := 0; i < 6; i++ {
		if len(args[i]) <= 0 {
			ERR := "Argument " + string(i) + " should be non empty"
			return shim.Error(ERR)
		}
	}

	id := args[0]
	dataAsBytes, err := stub.GetState(id)
	if err != nil {
		return shim.Error("Failed to get rto details: " + err.Error())
	} else if dataAsBytes != nil {
		return shim.Error("There already exists an RTO in this pincode: " + id)
	}

	var rtodata RTOInfo
	doctype 		:= 		"RTO_Info"
	rtoid 			:= 		id				//PIN CODE
	addline1 		:= 		args[1]
	addline2 		:= 		args[2]
	city 			:= 		args[3]
	pincode 		:= 		id
	state 			:= 		args[4]
	contactno 		:= 		args[5]

	rtodata.DocType 					= 	doctype
	rtodata.RTOID 						= 	rtoid
	rtodata.AddressData.AddressLine1 	= 	addline1
	rtodata.AddressData.AddressLine2 	= 	addline2
	rtodata.AddressData.City 			= 	city
	rtodata.AddressData.Pin 			= 	pincode
	rtodata.AddressData.State 			= 	state
	rtodata.ContactNumber 				= 	contactno

	dataJSONasBytes, err := json.Marshal(rtodata)
	if err != nil {
		return shim.Error("1" + err.Error())
	}

	err = stub.PutState(rtoid, dataJSONasBytes)
	if err != nil {
		return shim.Error("2" + err.Error())
	}

	return shim.Success(nil)
}

// firstname, lastname, uid, gender, dob, age, contact_number, Email, rtoid
func (t *SimpleChainCode) AddOfficer(stub shim.ChaincodeStubInterface, args []string) pb.Response {

	if len(args) != 9 {
		return shim.Error("Incorrect number of arguments. Expecting 9")
	}

	for i := 0; i < 9; i++ {
		if len(args[i]) <= 0 {
			ERR := "Argument " + string(i) + " should be non empty"
			return shim.Error(ERR)
		}
	}

	rtoid				:= 		args[8]
	dataAsBytes, err 	:= 		stub.GetState(rtoid)
	if err != nil {
		return shim.Error("Failed to get rto info: " + err.Error())
	} else if dataAsBytes == nil {
		return shim.Error("This rto doesnt exist: " + rtoid)
	}

	id 				 	:= 		args[6]				//Phone Number
	dataAsBytes, err 	= 		stub.GetState(id)
	if err != nil {
		return shim.Error("Failed to get officer id info: " + err.Error())
	} else if dataAsBytes != nil {
		return shim.Error("There already exists an Officer with this ID: " + id)
	}

	var officerdata OfficerInfo
	doctype 		:= 		"Officer_Info"
	firstname 		:= 		args[0]
	lastname 		:= 		args[1]
	uid 			:= 		args[2]
	gender 			:= 		args[3]
	dob 			:= 		args[4]
	age 			:= 		args[5]
	contact_number	:=		args[6]
	Email			:=		args[7]
	

	officerdata.OfficerID 					= 	id
	officerdata.DocType 					= 	doctype
	officerdata.BasicData_1.First_Name	 	= 	firstname
	officerdata.BasicData_1.Last_Name	 	= 	lastname
	officerdata.BasicData_1.UIDNo	 		= 	uid
	officerdata.BasicData_1.Gender	 		= 	gender
	officerdata.BasicData_1.DOB	 			= 	dob
	officerdata.BasicData_1.Age				= 	age
	officerdata.BasicData_1.ContactNumber	=	contact_number
	officerdata.BasicData_1.EmailID			=	Email
	officerdata.RTO_ID						=	rtoid

	dataJSONasBytes, err := json.Marshal(officerdata)
	if err != nil {
		return shim.Error(err.Error())
	}

	err = stub.PutState(id, dataJSONasBytes)
	if err != nil {
		return shim.Error(err.Error())
	}

	return shim.Success(nil)
}

// uid, licensetype,  date, time,
func (t *SimpleChainCode) LicenseApply(stub shim.ChaincodeStubInterface, args []string) pb.Response {

	if len(args) != 4 {
		return shim.Error("Incorrect number of arguments. Expecting 4")
	}

	for i := 0; i < 4; i++ {
		if len(args[i]) <= 0 {
			ERR := "Argument " + string(i) + " should be non empty"
			return shim.Error(ERR)
		}
	}

	uid 		:= args[0]
	licensetype := args[1]
	date		:= args[2]
	time		:= args[3]
	filenumber 	:= string(args[1][0]) + uid
		
	dataAsBytes, err := stub.GetState(uid)
	if err != nil {
		return shim.Error("Failed to fetch user details: " + err.Error())
	} else if dataAsBytes == nil {
		return shim.Error("This user doesn't exist: " + uid)
	}
	
	var baseData UserDetails
	err = json.Unmarshal(dataAsBytes, &baseData) //unmarshal it aka JSON.parse()
	if err != nil {
		return shim.Error(err.Error())
	}
	
	var filedata LicenseInfo
	filedata.FileNumber            = filenumber 
	filedata.LicenseType           = licensetype
	filedata.IsActive              = "false"
	filedata.ReasonOfInactivity    = "Under Process for Initial Approval"
	filedata.IsPassWritten		   = "false"
	filedata.IsPassSim		 	   = "false"
	filedata.IsPassPrac     	   = "false"
	
	var status FileStatusInfo
	status.Status  = "Under Process for Initial Approval"
	status.Date    = date
	status.Time    = time

	filedata.FileStatus  = append(filedata.FileStatus, status)
	baseData.LicenseData = append(baseData.LicenseData, filedata)

	dataJSONasBytes, err := json.Marshal(baseData)
	if err != nil {
		return shim.Error(err.Error())
	}

	err = stub.PutState(uid, dataJSONasBytes)
	if err != nil {
		return shim.Error(err.Error())
	}

	return shim.Success(nil)

}

//ADD officerid CHECK
// uid, testtype, score, maxmarks, passingmarks, officerid, filenumber, date, time
func (t *SimpleChainCode) AddTestResult(stub shim.ChaincodeStubInterface, args []string) pb.Response {

	if len(args) != 9 {
		return shim.Error("Incorrect number of arguments. Expecting 9")
	}

	for i := 0; i < 9; i++ {
		if len(args[i]) <= 0 {
			ERR := "Argument " + string(i) + " should be non empty"
			return shim.Error(ERR)
		}
	}

 	uid             	:= 	args[0]
	dataAsBytes, err 	:= 	stub.GetState(uid)
	if err != nil {
		return shim.Error("Failed to fetch user details: " + err.Error())
	} else if dataAsBytes == nil {
		return shim.Error("This user doesn't exist: " + uid)
	}
  
	testtype      := args[1]
	score         := args[2]
 	maxmarks      := args[3]
  	passingmarks  := args[4]
	var ispass,status string
	if score >= passingmarks {
		ispass = "true" 
		status = "You passed the " + testtype + " test."
	} else {
		ispass = "false"
		status = "You failed the " + testtype + " test."
	}
	officerid     := args[5]
	filenumber    := args[6]
	date 		  := args[7]
	time		  := args[8]

	// CHECK IF GIVING THE RIGHT TEST IN CASE OF LEARNING LICENSE
	if filenumber[0] == 'L' && testtype != "Written" {
 	   return shim.Error("Not eligible for the test " + testtype + " since applying for learning license")
 	} 

 	var baseData UserDetails
	err = json.Unmarshal(dataAsBytes, &baseData) //unmarshal it aka JSON.parse()
	if err != nil {
		return shim.Error(err.Error())
	}
	
	var i int
	flag := false
	//FIND THE INDEX OF THE FILE OUT OF ALL THE USERS EXISITNG FILES OF APPLICATIONS
	for i := range baseData.LicenseData {
		if  baseData.LicenseData[i].FileNumber == filenumber {
			flag = true
			break 
		}  
	}
  
	if !flag {
		return shim.Error("This file doesnt exist.")
	}

	if testtype == "Simulator" && baseData.LicenseData[i].IsPassWritten != "true" {
 	   return shim.Error("Not eligible for the test " + testtype + ". Qualify written test first")
	} else if testtype == "Practical" && (baseData.LicenseData[i].IsPassSim != "true" || baseData.LicenseData[i].IsPassWritten != "true") {
 	   return shim.Error("Not eligible for the test " + testtype + ". Qualify earlier tests first")
	}

	var testdata TestInfo
  	testdata.TestType        = testtype 
  	testdata.Score           = score
  	testdata.MaxMarks        = maxmarks
	testdata.PassingMarks    = passingmarks
	testdata.Invigilator     = officerid 
	
	if testtype == "Written" {
		baseData.LicenseData[i].IsPassWritten = ispass
	} else if testtype == "Simulator" {
		baseData.LicenseData[i].IsPassSim = ispass
	} else if testtype == "Practical" {
		baseData.LicenseData[i].IsPassPrac = ispass
	}
	var filestatus FileStatusInfo
	filestatus.Status 	= status
	filestatus.Date     = date
	filestatus.Time     = time

	baseData.LicenseData[i].FileStatus = append(baseData.LicenseData[i].FileStatus, filestatus)
	baseData.LicenseData[i].TestData  = append(baseData.LicenseData[i].TestData, testdata)
 
	dataJSONasBytes, err := json.Marshal(baseData)
	if err != nil {
		return shim.Error(err.Error())
	}

	err = stub.PutState(uid, dataJSONasBytes)
	if err != nil {
		return shim.Error(err.Error())
	}

	return shim.Success(nil)
}

// uid, filenumber, dateofissue, dateofexpiry,date,time
func (t *SimpleChainCode) ApproveApplication(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	
	if len(args) != 6 {
		return shim.Error("Incorrect number of arguments. Expecting 6")
	}

	for i := 0; i < 6; i++ {
		if len(args[i]) <= 0 {
			ERR := "Argument " + string(i) + " should be non empty"
			return shim.Error(ERR)
		}
	}

 	uid             	:= 	args[0]
	dataAsBytes, err 	:= 	stub.GetState(uid)
	if err != nil {
		return shim.Error("Failed to fetch user details: " + err.Error())
	} else if dataAsBytes == nil {
		return shim.Error("This user doesn't exist: " + uid)
	}

	filenumber := args[1]
	dateofissue := args[2]
	dateofexpiry := args[3]
	date	:= args[4]
	time	:= args[5]
	licensenumber	:= string(filenumber[0]) + "L" + uid
	var baseData UserDetails
	err = json.Unmarshal(dataAsBytes, &baseData) //unmarshal it aka JSON.parse()
	if err != nil {
		return shim.Error(err.Error())
	}

	//FIND THE INDEX OF THE FILE OUT OF ALL THE USERS EXISITNG FILES OF APPLICATIONS
	var i int
	for i := range baseData.LicenseData {
		if  baseData.LicenseData[i].FileNumber == filenumber {
			break 
		}  
	}

	if baseData.LicenseData[i].LicenseType == "Learning" && baseData.LicenseData[i].IsPassWritten != "true" {
		return shim.Error("Cannot activate Learning License since Written test hasn't been cleared")
	}	else if  baseData.LicenseData[i].LicenseType == "Permanent" && (baseData.LicenseData[i].IsPassWritten != "true" || baseData.LicenseData[i].IsPassSim != "true" || baseData.LicenseData[i].IsPassPrac != "true") {
		return shim.Error("Cannot activate Driving License since a test hasn't been cleared")
	}

	baseData.LicenseData[i].DateOfIssue 		 = dateofissue
	baseData.LicenseData[i].DateOfExpiry 		 = dateofexpiry
	baseData.LicenseData[i].IsActive	 		 = "true"
	baseData.LicenseData[i].ReasonOfInactivity	 = ""
	baseData.LicenseData[i].LicenseNumber		 = licensenumber

	var filestatus FileStatusInfo
	filestatus.Status 	= "Your Application has been granted. Your License number is " + licensenumber + ". It'll be dispatched shortly"
	filestatus.Date     = date
	filestatus.Time     = time

	baseData.LicenseData[i].FileStatus = append(baseData.LicenseData[i].FileStatus, filestatus)
	

	dataJSONasBytes, err := json.Marshal(baseData)
	if err != nil {
		return shim.Error(err.Error())
	}

	err = stub.PutState(uid, dataJSONasBytes)
	if err != nil {
		return shim.Error(err.Error())
	}

	return shim.Success(nil)
}

//ticketid, uid, licensenumber , ticketissuer, reason, dateofissue, timeofissue, place, ispaid, amount
func (t *SimpleChainCode) AddTicket(stub shim.ChaincodeStubInterface, args []string) pb.Response {

	if len(args) != 10 {
		return shim.Error("Incorrect number of arguments. Expecting 10")
	}

	for i := 0; i < 10; i++ {
		if len(args[i]) <= 0 {
			ERR := "Argument " + string(i) + " should be non empty"
			return shim.Error(ERR)
		}
	}

	ticketid := args[0]
	uid := args[1]
	licensenumber := args[2]
	ticketissuer := args[3]
	reason := args[4]
	dateofissue := args[5]
	timeofissue := args[6]
	place := args[7]
	ispaid := args[8]
	amount := args[9]

	dataAsBytes, err := stub.GetState(ticketissuer)
	if err != nil {
		return shim.Error("Failed to fetch officer details: " + err.Error())
	} else if dataAsBytes == nil {
		return shim.Error("This officer doesn't exist: " + ticketissuer)
	}


    dataAsBytes, err = stub.GetState(uid)
	if err != nil {
		return shim.Error("Failed to fetch user details: " + err.Error())
	} else if dataAsBytes == nil {
		return shim.Error("This user doesn't exist: " + uid)
	}

	var baseData UserDetails
	err = json.Unmarshal(dataAsBytes, &baseData) //unmarshal it aka JSON.parse()
	if err != nil {
		return shim.Error(err.Error())
	}
	
	flag := false
	for i := range baseData.LicenseData {
		if  baseData.LicenseData[i].LicenseNumber == licensenumber {
			flag = true
			break 
		}  
	}

	if !flag {
		return shim.Error("This License number Doesn't exist")
	}

	var ticket TicketInfo

	ticket.TicketIssuer 	= ticketissuer
	ticket.TicketID			= ticketid
	ticket.Reason 			= reason
	ticket.DateOfIssue 		= dateofissue
	ticket.TimeOfIssue 		= timeofissue
	ticket.Place 			= place
	ticket.IsPaid 			= ispaid
	ticket.Amount			= amount
	
	baseData.Tickets = append(baseData.Tickets, ticket)

	dataJSONasBytes, err := json.Marshal(baseData)
	if err != nil {
		return shim.Error(err.Error())
	}

	err = stub.PutState(uid, dataJSONasBytes)
	if err != nil {
		return shim.Error(err.Error())
	}

	return shim.Success(nil)
}

//uid, ticketid
func (t *SimpleChainCode) PayFine(stub shim.ChaincodeStubInterface, args []string) pb.Response {

	if len(args) != 2 {
		return shim.Error("Incorrect number of arguments. Expecting 2")
	}

	for i := 0; i < 2; i++ {
		if len(args[i]) <= 0 {
			ERR := "Argument " + string(i) + " should be non empty"
			return shim.Error(ERR)
		}
	}
	
	uid             	:= 	args[0]
	dataAsBytes, err 	:= 	stub.GetState(uid)
	if err != nil {
		return shim.Error("Failed to fetch user details: " + err.Error())
	} else if dataAsBytes == nil {
		return shim.Error("This user doesn't exist: " + uid)
	}

	ticketid := args[1]

	var baseData UserDetails
	err = json.Unmarshal(dataAsBytes, &baseData) //unmarshal it aka JSON.parse()
	if err != nil {
		return shim.Error(err.Error())
	}

	//FIND THE INDEX OF THE TICKET OUT OF ALL THE USERS TICKETS
	var i int
	for i := range baseData.Tickets {
		if  baseData.Tickets[i].TicketID == ticketid {
			break 
		}  
	}

	if baseData.Tickets[i].IsPaid == "true" {
		return shim.Error("Already Paid for the ticket")
	} else {
		baseData.Tickets[i].IsPaid = "true"
	}

	dataJSONasBytes, err := json.Marshal(baseData)
	if err != nil {
		return shim.Error(err.Error())
	}

	err = stub.PutState(uid, dataJSONasBytes)
	if err != nil {
		return shim.Error(err.Error())
	}

	return shim.Success(nil)
}

//uid, licensenumber, reason
func (t *SimpleChainCode) SuspendLicense(stub shim.ChaincodeStubInterface, args []string) pb.Response {

	if len(args) != 3 {
		return shim.Error("Incorrect number of arguments. Expecting 3")
	}

	for i := 0; i < 3; i++ {
		if len(args[i]) <= 0 {
			ERR := "Argument " + string(i) + " should be non empty"
			return shim.Error(ERR)
		}
	}
	
	uid             	:= 	args[0]
	dataAsBytes, err 	:= 	stub.GetState(uid)
	if err != nil {
		return shim.Error("Failed to fetch user details: " + err.Error())
	} else if dataAsBytes == nil {
		return shim.Error("This user doesn't exist: " + uid)
	}

	licensenumber := args[1]
	reason 	  := args[2]

	var baseData UserDetails
	err = json.Unmarshal(dataAsBytes, &baseData) //unmarshal it aka JSON.parse()
	if err != nil {
		return shim.Error(err.Error())
	}

	//FIND THE INDEX OF THE LICENSE OUT OF ALL THE USERS CURRENT OR PREVIOUS LICENSES
	var i int
	for i := range baseData.LicenseData {
		if  baseData.LicenseData[i].LicenseNumber == licensenumber {
			break 
		}  
	}
	
	baseData.LicenseData[i].IsActive 			 = "false"
	baseData.LicenseData[i].ReasonOfInactivity   =  reason

	dataJSONasBytes, err := json.Marshal(baseData)
	if err != nil {
		return shim.Error(err.Error())
	}

	err = stub.PutState(uid, dataJSONasBytes)
	if err != nil {
		return shim.Error(err.Error())
	}

	return shim.Success(nil)
}

//NOT WORKING AS OF NOW
//uid, licensenumber
func (t *SimpleChainCode) IsLicenseActive(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	if len(args) != 2 {
		return shim.Error("Incorrect number of arguments. Expecting 2")
	}

	for i := 0; i < 2; i++ {
		if len(args[i]) <= 0 {
			ERR := "Argument " + string(i) + " should be non empty"
			return shim.Error(ERR)
		}
	}
	
	uid             	:= 	args[0]
	dataAsBytes, err 	:= 	stub.GetState(uid)
	if err != nil {
		return shim.Error("Failed to fetch user details: " + err.Error())
	} else if dataAsBytes == nil {
		return shim.Error("This user doesn't exist: " + uid)
	}

	licensenumber := args[1]

	var baseData UserDetails
	err = json.Unmarshal(dataAsBytes, &baseData) //unmarshal it aka JSON.parse()
	if err != nil {
		return shim.Error(err.Error())
	}

	//FIND THE INDEX OF THE LICENSE OUT OF ALL THE USERS CURRENT OR PREVIOUS LICENSES
	var i int
	for i := range baseData.LicenseData {
		if  baseData.LicenseData[i].LicenseNumber == licensenumber {
			break 
		}  
	}
	
	isactive := baseData.LicenseData[i].IsActive

	dataJSONasBytes, err := json.Marshal(isactive)
	if err != nil {
		return shim.Error(err.Error())
	}

	return shim.Success(dataJSONasBytes)
}

//uid, ticket
func (t *SimpleChainCode) IsFinePaid(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	if len(args) != 2 {
		return shim.Error("Incorrect number of arguments. Expecting 2")
	}

	for i := 0; i < 2; i++ {
		if len(args[i]) <= 0 {
			ERR := "Argument " + string(i) + " should be non empty"
			return shim.Error(ERR)
		}
	}


	fmt.Printf("here")
	uid             	:= 	args[0]
	dataAsBytes, err 	:= 	stub.GetState(uid)
	if err != nil {
		return shim.Error("Failed to fetch user details: " + err.Error())
	} else if dataAsBytes == nil {
		return shim.Error("This user doesn't exist: " + uid)
	}

	ticketid	  := args[2]
	var baseData UserDetails
	err = json.Unmarshal(dataAsBytes, &baseData) //unmarshal it aka JSON.parse()
	if err != nil {
		return shim.Error(err.Error())
	}

	//FIND THE INDEX OF THE LICENSE OUT OF ALL THE USERS CURRENT OR PREVIOUS LICENSES
	var i int
	for i := range baseData.Tickets {
		if  baseData.Tickets[i].TicketID == ticketid {
			fmt.Printf("%d",i)
			break 
		}  
	}
	
	ispaid := baseData.Tickets[i].IsPaid

	dataJSONasBytes, err := json.Marshal(ispaid)
	if err != nil {
		return shim.Error(err.Error())
	}

	return shim.Success(dataJSONasBytes)
}

//uid
func (t *SimpleChainCode) FetchListOfTickets(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	
	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments. Expecting 1")
	}

	for i := 0; i < 1; i++ {
		if len(args[i]) <= 0 {
			ERR := "Argument " + string(i) + " should be non empty"
			return shim.Error(ERR)
		}
	}

	uid             	:= 	args[0]
	dataAsBytes, err 	:= 	stub.GetState(uid)
	if err != nil {
		return shim.Error("Failed to fetch user details: " + err.Error())
	} else if dataAsBytes == nil {
		return shim.Error("This user doesn't exist: " + uid)
	}

	var baseData UserDetails
	err = json.Unmarshal(dataAsBytes, &baseData) //unmarshal it aka JSON.parse()
	if err != nil {
		return shim.Error(err.Error())
	}

	dataJSONasBytes, err := json.Marshal(baseData.Tickets)
	if err != nil {
		return shim.Error(err.Error())
	}

	return shim.Success(dataJSONasBytes)
}

//uid
func (t *SimpleChainCode) FetchTestResults(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	
	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments. Expecting 1")
	}

	for i := 0; i < 1; i++ {
		if len(args[i]) <= 0 {
			ERR := "Argument " + string(i) + " should be non empty"
			return shim.Error(ERR)
		}
	}

	uid             	:= 	args[0]
	dataAsBytes, err 	:= 	stub.GetState(uid)
	if err != nil {
		return shim.Error("Failed to fetch user details: " + err.Error())
	} else if dataAsBytes == nil {
		return shim.Error("This user doesn't exist: " + uid)
	}

	var baseData UserDetails
	err = json.Unmarshal(dataAsBytes, &baseData) //unmarshal it aka JSON.parse()
	if err != nil {
		return shim.Error(err.Error())
	}

	var testResults []TestInfo
	for i := range baseData.LicenseData {
		for j := range baseData.LicenseData[i].TestData{
			testResults = append(testResults, baseData.LicenseData[i].TestData[j])
		}
	}

	dataJSONasBytes, err := json.Marshal(testResults)
	if err != nil {
		return shim.Error(err.Error())
	}

	return shim.Success(dataJSONasBytes)
}

//uid, filenumber, status, date, time,
func (t *SimpleChainCode) UpdateStatus(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	
	if len(args) != 5 {
		return shim.Error("Incorrect number of arguments. Expecting 5")
	}

	for i := 0; i < 5; i++ {
		if len(args[i]) <= 0 {
			ERR := "Argument " + string(i) + " should be non empty"
			return shim.Error(ERR)
		}
	}

	uid             := 	args[0]
	filenumber 		:= 	args[1]
	status 			:=	args[2]
	date			:=  args[3]
	time			:=  args[4]

	dataAsBytes, err 	:= 	stub.GetState(uid)
	if err != nil {
		return shim.Error("Failed to fetch user details: " + err.Error())
	} else if dataAsBytes == nil {
		return shim.Error("This user doesn't exist: " + uid)
	}

	var baseData UserDetails
	err = json.Unmarshal(dataAsBytes, &baseData) //unmarshal it aka JSON.parse()
	if err != nil {
		return shim.Error(err.Error())
	}

	var i int
	for i = range baseData.LicenseData {
		if baseData.LicenseData[i].FileNumber == filenumber{
			break
		}
	}

	var filestatus FileStatusInfo
	filestatus.Status 	 = status
	filestatus.Time 	 = time
	filestatus.Date 	 = date
	baseData.LicenseData[i].FileStatus = append(baseData.LicenseData[i].FileStatus, filestatus)
	
	dataJSONasBytes, err := json.Marshal(baseData)
	if err != nil {
		return shim.Error(err.Error())
	}

	err = stub.PutState(uid, dataJSONasBytes)
	if err != nil {
		return shim.Error(err.Error())
	}

	return shim.Success(dataJSONasBytes)
}

//uid, filenumber
func (t *SimpleChainCode) FetchStatus(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	
	if len(args) != 2 {
		return shim.Error("Incorrect number of arguments. Expecting 2")
	}

	for i := 0; i < 2; i++ {
		if len(args[i]) <= 0 {
			ERR := "Argument " + string(i) + " should be non empty"
			return shim.Error(ERR)
		}
	}

	uid             	:= 	args[0]
	filenumber 			:= 	args[1]
	dataAsBytes, err 	:= 	stub.GetState(uid)
	if err != nil {
		return shim.Error("Failed to fetch user details: " + err.Error())
	} else if dataAsBytes == nil {
		return shim.Error("This user doesn't exist: " + uid)
	}

	var baseData UserDetails
	err = json.Unmarshal(dataAsBytes, &baseData) //unmarshal it aka JSON.parse()
	if err != nil {
		return shim.Error(err.Error())
	}

	var i int
	for i = range baseData.LicenseData {
		if baseData.LicenseData[i].FileNumber == filenumber{
			break
		}
	}

	dataJSONasBytes, err := json.Marshal(baseData.LicenseData[i].FileStatus)
	if err != nil {
		return shim.Error(err.Error())
	}

	return shim.Success(dataJSONasBytes)
}

