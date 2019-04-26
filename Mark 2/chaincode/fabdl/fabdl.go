package main

import (
	"strconv"
	"encoding/json"
	"fmt"
	"github.com/hyperledger/fabric/core/chaincode/shim"
	pb "github.com/hyperledger/fabric/protos/peer"
	// "github.com/hyperledger/fabric/common/util"
	// "strings"
)

type SimpleChainCode struct {
}

// SEPERATE DOCUMENT 2.1
type LicenseBase struct {
	DocType      			string              `json:"objectType"`
	ID           			string              `json:"id"`					//REFERS UIDAIDetails's ID(json:"id")
	RTO_ID       			string              `json:"rto"`
	UIDAIData				UIDAIDetails		`json:"uidaidata"`
	LicenseData  			[]LicenseInfo       `json:"licensedata"`
	VehiclesData 			[]VehiclesOwned     `json:"vehiclesowned"`
	NextProcess				string				`json:"nextprocess"`
	CurrentFile				string				`json:"currentfile"`
	ActiveLicense			string				`json:"activelicense"`
	NoOfTickets				int					`json:"nooftickets"`
}

type UIDAIDetails struct {
	DocType      		    string             `json:"objectType"`
	ID           		    string             `json:"id"`
	BasicData_1  		    BasicInfo1         `json:"basicdata1"`
	BasicData_2  		    BasicInfo2         `json:"basicdata2"`
	AddressData  		    Address            `json:"address"`
}

type BasicInfo1 struct {
	First_Name    			string		 	    `json:"firstname"`
	Last_Name     			string		 	    `json:"lastname"`
	Gender        			string		 	    `json:"gender"`
	DOB           			string		 	    `json:"dob"`
	Age           			string		 	    `json:"age"`
	ContactNumber 			string		 	    `json:"contact_number"`
	EmailID       			string		 	    `json:"emailid"`
	PhotoHash	  			string			    `json:"photohash"`	
	DocumentHash  			string			    `json:"dochash"`	
}

type BasicInfo2 struct {
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
	CurretStatusNo			string				`json:"currentstatusno"`	
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

type FileStatusInfo struct {
	Number					string				`json:"number"`
	Status					string				`json:"filestatus"`
	Date					string				`json:"date"`
	Time					string				`json:"string"`
}

// SEPERATE DOCUMENT 2.2
type RTOInfo struct {
  DocType       			string		        `json:"objectType"`
  RTO_ID         			string  	        `json:"rtoid"`
  AddressData   			Address 	        `json:"address"`
  ContactNumber 			string  	        `json:"contactno"`
  Applicants				[]string				`json:"applicants"`
}

// SEPERATE DOCUMENT 2.3
type OfficerInfo struct {
  OfficerID          		string			  	`json:"id"`								//officer's phone number
  DocType             	string				`json:"objectType"`
  BasicData_1 	      	BasicInfo1			`json:"basicdata"`
  RTO_ID			        string 			  	`json:"rtoid"`
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

	if function == "BlankRun" {
		return t.BlankRun(stub)
	} else 	if function == "FetchAccountDetails" 			{ //CREATE A NEW ENTRY
		return t.FetchAccountDetails(stub, args)
	} else 	if function == "ReturnUserData" 			{ //CREATE A NEW ENTRY
		return t.ReturnUserData(stub, args)
	} else if function == "AddRTO" 				{ //ADD A NEW RTO TO THE SYSTEM
		return t.AddRTO(stub, args)
	} else if function == "AddOfficer" 			{ //REGISTER A OFFICER TO THE SYSTEM
		return t.AddOfficer(stub, args)
	} else if function == "LicenseApply" 		{ //CREATE ANY GIVEN DL'S APPLICATION FILE
		return t.LicenseApply(stub, args)
	} else if function == "CheckIfHaveData" 		{ //CREATE ANY GIVEN DL'S APPLICATION FILE
		return t.CheckIfHaveData(stub, args)
	} else if function == "ReturnStatus" 		{ //CREATE ANY GIVEN DL'S APPLICATION FILE
		return t.ReturnStatus(stub, args)
	} else if function == "FetchOfficerDetails" 		{ //CREATE ANY GIVEN DL'S APPLICATION FILE
		return t.FetchOfficerDetails(stub, args)
	} else if function == "FetchScoresToBeAdded" 		{ //CREATE ANY GIVEN DL'S APPLICATION FILE
		return t.FetchScoresToBeAdded(stub, args)
	} else if function == "AddTestResult" 		{ //CREATE ANY GIVEN DL'S APPLICATION FILE
		return t.AddTestResult(stub, args)
	} else if function == "AddTicket" 		{ //CREATE ANY GIVEN DL'S APPLICATION FILE
		return t.AddTicket(stub, args)
	} else if function == "PayFine" 		{ //CREATE ANY GIVEN DL'S APPLICATION FILE
		return t.PayFine(stub, args)
	} 
	
    fmt.Println("Function not found: " + function)
	return shim.Error("Received unknown function invocation")
}

func (t *SimpleChainCode) BlankRun(stub shim.ChaincodeStubInterface) pb.Response {
	return shim.Success(nil)
}

// uid
func (t *SimpleChainCode) FetchAccountDetails(stub shim.ChaincodeStubInterface, args []string) pb.Response {

	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments. Expecting 1")
	}

	for i := 0; i < 1; i++ {
		if len(args[i]) <= 0 {
			ERR := "Argument " + string(i) + " should be non empty"
			return shim.Error(ERR)
		}
	}

	var s [2]string
	s[0] = "ReturnAccountDetails"
	s[1] = args[0]

	bargs := make([][]byte, len(s))
	for i, arg := range s {
		bargs[i] = []byte(arg)
	}
	
	dataJSONasBytes := stub.InvokeChaincode("fabboth",bargs, "channelboth")
	if dataJSONasBytes.Status != 200 {
		fmt.Println(dataJSONasBytes.Message);
		return shim.Error(dataJSONasBytes.Message)
	}

	var uidaiData UIDAIDetails
	err := json.Unmarshal(dataJSONasBytes.Payload, &uidaiData) //unmarshal it aka JSON.parse()
	if err != nil {
		return shim.Error(err.Error())
	}

	var licensebase LicenseBase
	licensebase.DocType = "licensebase"
	licensebase.ID = uidaiData.ID;
	licensebase.UIDAIData = uidaiData
	licensebase.NextProcess = "written"
	licensebase.RTO_ID = "RTO" + uidaiData.AddressData.Pin
	licensebase.NoOfTickets = 0;

	licensedataJSONasBytes, err := json.Marshal(licensebase)
	if err != nil {
		return shim.Error("1" + err.Error())
	}

	err = stub.PutState(args[0], licensedataJSONasBytes)
	if err != nil {
		fmt.Println(err);
		return shim.Error(err.Error())
	}

	return shim.Success(nil)
}

// uid
func (t *SimpleChainCode) ReturnUserData(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments. Expecting 1")
	}

	detailsAsBytes, err := stub.GetState(args[0])
	if err != nil {
		return shim.Error("Failed to get user details: " + err.Error())
	} else if detailsAsBytes == nil {
		return shim.Error("This user doesn't exist: " + args[0])
	}

	var licensebase LicenseBase;
	err = json.Unmarshal(detailsAsBytes, &licensebase);
	if err != nil {
		fmt.Println("1" + err.Error());
		return shim.Error(err.Error())
	}
	
	detailsAsBytes, err = json.Marshal(licensebase)
	if err != nil {
		fmt.Println("2" + err.Error());
		return shim.Error(err.Error())
	}
	
	return shim.Success(detailsAsBytes)
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
	rtoid 			:= 		"RTO" + id				//PIN CODE
	addline1 		:= 		args[1]
	addline2 		:= 		args[2]
	city 			:= 		args[3]
	pincode 		:= 		id
	state 			:= 		args[4]
	contactno 		:= 		args[5]

	rtodata.DocType 					= 	doctype
	rtodata.RTO_ID 						= 	rtoid
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

// uid, rtoid
func (t *SimpleChainCode) AddOfficer(stub shim.ChaincodeStubInterface, args []string) pb.Response {

	if len(args) != 2 {
		return shim.Error("Incorrect number of arguments. Expecting 2")
	}

	uid 				 	:= 		args[0]				//UIDAI
	dataAsBytesUID, err 	:= 		stub.GetState(uid)
	if err != nil {
		return shim.Error("Failed to get officer's UIDAI info: " + err.Error())
	} else if dataAsBytesUID == nil {
		return shim.Error("This officer doesnt have an aadhar card: " + uid)
	}

	rtoid				:= 		args[1]
	dataAsBytes, err 	:= 		stub.GetState(rtoid)
	if err != nil {
		return shim.Error("Failed to get rto info: " + err.Error())
	} else if dataAsBytes == nil {
		return shim.Error("This rto doesnt exist: " + rtoid)
	}

	fmt.Printf("%s %s ", uid, rtoid);
	dataAsBytes, err 	= 		stub.GetState("OFF" + uid)
	if err != nil {
		return shim.Error("Failed to get rto info: " + err.Error())
	} else if dataAsBytes != nil {
		return shim.Error("This officer already exists: " + rtoid)
	}

	var uidaiData UIDAIDetails
	err = json.Unmarshal(dataAsBytesUID, &uidaiData) //unmarshal it aka JSON.parse()
	if err != nil {
		fmt.Println("1" + err.Error());
		return shim.Error(err.Error())
	}
	var officerdata OfficerInfo
	// firstname 		:= 		uidaiData.BasicData_1.First_Name
	// lastname 		:= 		uidaiData.BasicData_1.Last_Name
	// gender 			:= 		uidaiData.BasicData_1.Gender
	// dob 			:= 		uidaiData.BasicData_1.DOB
	// age 			:= 		uidaiData.BasicData_1.Age
	// contact_number	:=		uidaiData.BasicData_1.ContactNumber
	// Email			:=		uidaiData.BasicData_1.EmailID
	
	
	doctype 								:=  "Officer_Info"
	officerdata.OfficerID 					= 	"OFF" + uid
	officerdata.DocType 					= 	doctype
	officerdata.RTO_ID						=	rtoid
	officerdata.BasicData_1					=   uidaiData.BasicData_1
	// officerdata.BasicData_1.First_Name	 	= 	firstname
	// officerdata.BasicData_1.Last_Name	 	= 	lastname
	// officerdata.BasicData_1.Gender	 		= 	gender
	// officerdata.BasicData_1.DOB	 			= 	dob
	// officerdata.BasicData_1.Age				= 	age
	// officerdata.BasicData_1.ContactNumber	=	contact_number
	// officerdata.BasicData_1.EmailID			=	Email

	dataJSONasBytes, err := json.Marshal(officerdata)
	if err != nil {
		fmt.Println("2" + err.Error());
		return shim.Error(err.Error())
	}

	err = stub.PutState(officerdata.OfficerID, dataJSONasBytes)
	if err != nil {
		fmt.Println("3" + err.Error());
		return shim.Error(err.Error())
	}

	return shim.Success(nil)
}

// uid, date, time,
func (t *SimpleChainCode) LicenseApply(stub shim.ChaincodeStubInterface, args []string) pb.Response {

	if len(args) != 3 {
		return shim.Error("Incorrect number of arguments. Expecting 3")
	}

	for i := 0; i < 3; i++ {
		if len(args[i]) <= 0 {
			ERR := "Argument " + string(i) + " should be non empty"
			return shim.Error(ERR)
		}
	}

	uid := args[0]
		
	dataAsBytes, err := stub.GetState(uid)
	if err != nil {
		return shim.Error("Failed to fetch user details: " + err.Error())
	} else if dataAsBytes == nil {
		return shim.Error("This user doesn't exist: " + uid)
	}
	
	var licenseData LicenseBase
	err = json.Unmarshal(dataAsBytes, &licenseData) //unmarshal it aka JSON.parse()
	if err != nil {
		return shim.Error(err.Error())
	} else if licenseData.NextProcess == "nil" {
		return shim.Error("Already applied for License")
	}

	dataAsBytes, err = stub.GetState(licenseData.RTO_ID)
	if err != nil {
		return shim.Error("Failed to fetch RTO details: " + err.Error())
	} else if dataAsBytes == nil {
		return shim.Error("This RTO doesn't exist: " + licenseData.RTO_ID + ". Please register it first.")
	}

	var rtoData RTOInfo
	err = json.Unmarshal(dataAsBytes, &rtoData) //unmarshal it aka JSON.parse()
	if err != nil {
		return shim.Error(err.Error())
	}
	
	date		:= args[1]
	time		:= args[2]
	filenumber 	:= "L" + uid

	licenseData.NextProcess = "nil"
	licenseData.CurrentFile = filenumber
	
	var filedata LicenseInfo
	filedata.FileNumber            = filenumber 
	filedata.LicenseType           = ""
	filedata.IsActive              = "false"
	filedata.ReasonOfInactivity    = "Under Process for Initial Approval"
	filedata.IsPassWritten		   = "false"
	filedata.IsPassSim		 	   = "false"
	filedata.IsPassPrac     	   = "false"
	filedata.CurretStatusNo		   = "1"
	
	var status FileStatusInfo
	status.Status  = "Waiting to complete Written Test"
	status.Date    = date
	status.Time    = time
	status.Number  = "1"

	filedata.FileStatus  = append(filedata.FileStatus, status)
	licenseData.LicenseData = append(licenseData.LicenseData, filedata)

	rtoData.Applicants = append(rtoData.Applicants,uid);

	dataJSONasBytes, err := json.Marshal(licenseData)
	if err != nil {
		return shim.Error(err.Error())
	}

	err = stub.PutState(uid, dataJSONasBytes)
	if err != nil {
		return shim.Error(err.Error())
	}

	dataJSONasBytes, err = json.Marshal(rtoData)
	if err != nil {
		return shim.Error(err.Error())
	}

	err = stub.PutState(rtoData.RTO_ID, dataJSONasBytes)
	if err != nil {
		return shim.Error(err.Error())
	}

	return shim.Success(nil)
}

// uid
func (t *SimpleChainCode) CheckIfHaveData(stub shim.ChaincodeStubInterface, args []string) pb.Response {

	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments. Expecting 1")
	}

	for i := 0; i < 1; i++ {
		if len(args[i]) <= 0 {
			ERR := "Argument " + string(i) + " should be non empty"
			return shim.Error(ERR)
		}
	}

	uid := args[0]

	dataJSONasBytes, err := stub.GetState(uid)
	if err != nil {
		fmt.Println(err);
		return shim.Error("Unable to check if data exists" + err.Error())
	} else if dataJSONasBytes != nil {
		return shim.Error("User already exist")
	}

	return shim.Success(nil)
}

//uid, filenumber
func (t *SimpleChainCode) ReturnStatus(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	if len(args) != 2 {
		return shim.Error("Incorrect number of arguments. Expecting 2")
	}

	detailsAsBytes, err := stub.GetState(args[0])
	if err != nil {
		return shim.Error("Failed to get user details: " + err.Error())
	} else if detailsAsBytes == nil {
		return shim.Error("This user doesn't exist: " + args[0])
	}

	var licensebase LicenseBase;
	var statusInfo  []FileStatusInfo;
	err = json.Unmarshal(detailsAsBytes, &licensebase);
	if err != nil {
		fmt.Println("1" + err.Error());
		return shim.Error(err.Error())
	}
	
	for i := range licensebase.LicenseData {
		if  licensebase.LicenseData[i].FileNumber == args[1] {
			statusInfo = licensebase.LicenseData[i].FileStatus
			break 
		}  
	}

	detailsAsBytes, err = json.Marshal(statusInfo)
	if err != nil {
		fmt.Println("2" + err.Error());
		return shim.Error(err.Error())
	}
	
	return shim.Success(detailsAsBytes)
}

//offid
func (t *SimpleChainCode) FetchOfficerDetails(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments. Expecting 1")
	}

	detailsAsBytes, err := stub.GetState(args[0])
	if err != nil {
		return shim.Error("Failed to get officer details: " + err.Error())
	} else if detailsAsBytes == nil {
		return shim.Error("This officer doesn't exist: " + args[0])
	}

	var officerdata OfficerInfo;
	err = json.Unmarshal(detailsAsBytes, &officerdata);
	if err != nil {
		fmt.Println("1" + err.Error());
		return shim.Error(err.Error())
	}
	
	detailsAsBytes, err = json.Marshal(officerdata)
	if err != nil {
		fmt.Println("2" + err.Error());
		return shim.Error(err.Error())
	}
	
	return shim.Success(detailsAsBytes)
}

//rtoid
func (t *SimpleChainCode) FetchScoresToBeAdded(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	
	type Scores  struct{
		UID			string			`json:"uid"`
		ScoreType	string			`json:"scoretype"`
	} 

	var ds []Scores ;
	
	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments. Expecting 1")
	}

	detailsAsBytes, err := stub.GetState(args[0])
	if err != nil {
		return shim.Error("Failed to get RTO details: " + err.Error())
	} else if detailsAsBytes == nil {
		return shim.Error("This RTO doesn't exist: " + args[0])
	}

	var rtodata RTOInfo;
	err = json.Unmarshal(detailsAsBytes, &rtodata);
	if err != nil {
		fmt.Println("1" + err.Error());
		return shim.Error(err.Error())
	}
	
	for i := range rtodata.Applicants {
		detailsAsBytes, err := stub.GetState(rtodata.Applicants[i])
		if err != nil {
			return shim.Error("Failed to get user's details: " + err.Error())
		} else if detailsAsBytes == nil {
			return shim.Error("This user doesn't exist: " + args[0])
		}

		var userdata LicenseBase;
		err = json.Unmarshal(detailsAsBytes, &userdata);
		if err != nil {
			fmt.Println("1" + err.Error());
			return shim.Error(err.Error())
		}
		
		for j := range userdata.LicenseData {
			if  (userdata.LicenseData[j].FileNumber == userdata.CurrentFile) {
				if (userdata.LicenseData[j].CurretStatusNo == "1") {
					var dsx Scores ;
					dsx.UID = userdata.ID;
					dsx.ScoreType = "Written"
					ds = append(ds,dsx);
				} else if (userdata.LicenseData[j].CurretStatusNo == "2") {
					var dsx Scores ;
					dsx.UID = userdata.ID;
					dsx.ScoreType = "Simulation"
					ds = append(ds,dsx);
				} else if (userdata.LicenseData[j].CurretStatusNo == "3") {
					var dsx Scores ;
					dsx.UID = userdata.ID;
					dsx.ScoreType = "Practical"
					ds = append(ds,dsx);
				}
			}
		}

	}

	detailsAsBytes, err = json.Marshal(ds)
	if err != nil {
		fmt.Println("2" + err.Error());
		return shim.Error(err.Error())
	}
	
	return shim.Success(detailsAsBytes)
}

// uid, testtype, score, officerid, date, time
func (t *SimpleChainCode) AddTestResult(stub shim.ChaincodeStubInterface, args []string) pb.Response {

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
  
	testtype      := args[1]
	score, err := strconv.Atoi(args[2])
	officerid     := args[3]
	date		  := args[4]
	time		  := args[5]
  	passingmarks  := 40
	var ispass,status string

	if score >= passingmarks {
		ispass = "true" 
		status = "You passed the " + testtype + " test."
	} else {
		ispass = "false"
		status = "You failed the " + testtype + " test."
	}

 	var licenseBase LicenseBase
	err = json.Unmarshal(dataAsBytes, &licenseBase) //unmarshal it aka JSON.parse()
	if err != nil {
		return shim.Error(err.Error())
	}
	
	var i int
	//FIND THE INDEX OF THE FILE OUT OF ALL THE USERS EXISITNG FILES OF APPLICATIONS
	for i := range licenseBase.LicenseData {
		if  licenseBase.LicenseData[i].FileNumber == licenseBase.CurrentFile {
			break 
		}  
	}
  
	if testtype == "Simulation" && licenseBase.LicenseData[i].IsPassWritten != "true" {
 	   return shim.Error("Not eligible for the test " + testtype + ". Qualify written test first")
	} else if testtype == "Practical" && (licenseBase.LicenseData[i].IsPassSim != "true" || licenseBase.LicenseData[i].IsPassWritten != "true") {
 	   return shim.Error("Not eligible for the test " + testtype + ". Qualify earlier tests first")
	}

	var testdata TestInfo
  	testdata.TestType        = testtype 
  	testdata.Score           = args[2]
  	testdata.MaxMarks        = "100"
	testdata.PassingMarks    = "40"
	testdata.Invigilator     = officerid 
	
	var filestatus FileStatusInfo
	if testtype == "Written" {
		licenseBase.LicenseData[i].IsPassWritten = ispass
		if ispass == "true" {
			filestatus.Number   = "2"
			licenseBase.LicenseData[i].CurretStatusNo = "2"
		} else {
			filestatus.Number   = "1.Failed"
		}
	} else if testtype == "Simulation" {
		licenseBase.LicenseData[i].IsPassSim = ispass
		if ispass == "true" {
			filestatus.Number   = "3"
			licenseBase.LicenseData[i].CurretStatusNo = "3"
		} else {
			filestatus.Number   = "3.Failed"
		}
	} else if testtype == "Practical" {
		licenseBase.LicenseData[i].IsPassPrac = ispass
		if ispass == "true" {
			filestatus.Number   = "4"
			licenseBase.LicenseData[i].CurretStatusNo = "4"
			status = "Succesfully cleared all tests. Your License Process has been completed and will be dispatched shortly"
			licenseBase.LicenseData[i].LicenseNumber = licenseBase.CurrentFile
			licenseBase.ActiveLicense = licenseBase.CurrentFile
			licenseBase.LicenseData[i].DateOfIssue   = date
			// date[4] = date[4] + 1
			licenseBase.LicenseData[i].DateOfExpiry  = date + "10 years"
			licenseBase.LicenseData[i].IsActive  = "true"
			licenseBase.LicenseData[i].LicenseNumber = licenseBase.CurrentFile
			
			licenseBase.CurrentFile = ""
		} else {
			filestatus.Number   = "4.Failed"
		}
	}
	filestatus.Status 	= status
	filestatus.Date     = date
	filestatus.Time     = time

	licenseBase.LicenseData[i].FileStatus = append(licenseBase.LicenseData[i].FileStatus, filestatus)
	licenseBase.LicenseData[i].TestData  = append(licenseBase.LicenseData[i].TestData, testdata)
 
	dataJSONasBytes, err := json.Marshal(licenseBase)
	if err != nil {
		return shim.Error(err.Error())
	}

	err = stub.PutState(uid, dataJSONasBytes)
	if err != nil {
		return shim.Error(err.Error())
	}

	return shim.Success(nil)
}

// uid, officerid, reason, place, date, time, amount
func (t *SimpleChainCode) AddTicket(stub shim.ChaincodeStubInterface, args []string) pb.Response {

	if len(args) != 7 {
		return shim.Error("Incorrect number of arguments. Expecting 7")
	}

	for i := 0; i < 7; i++ {
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
	
	var licenseBase LicenseBase
	err = json.Unmarshal(dataAsBytes, &licenseBase) //unmarshal it aka JSON.parse()
	if err != nil {
	   return shim.Error(err.Error())
	}
  
	officerid     := args[1]
	reason		  := args[2]
	place	      := args[3]
	date		  := args[4]
	time		  := args[5]
  	amount		  := args[6]

	var ticket TicketInfo
	ticket.TicketID = string(licenseBase.NoOfTickets)
	ticket.TicketIssuer = officerid
	ticket.Place = reason
	ticket.Reason = place
	ticket.DateOfIssue = date
	ticket.TimeOfIssue = time
	ticket.Amount = 	amount
	ticket.IsPaid = "false"
	licenseBase.NoOfTickets += 1 

	for i := range licenseBase.LicenseData {
		if licenseBase.LicenseData[i].LicenseNumber == licenseBase.ActiveLicense {
			licenseBase.LicenseData[i].Tickets = append(licenseBase.LicenseData[i].Tickets,ticket)
			break
		}
	}

	dataJSONasBytes, err := json.Marshal(licenseBase)
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

	var licenseBase LicenseBase
	err = json.Unmarshal(dataAsBytes, &licenseBase) //unmarshal it aka JSON.parse()
	if err != nil {
		return shim.Error(err.Error())
	}

	for i := range licenseBase.LicenseData {
		if licenseBase.LicenseData[i].LicenseNumber == licenseBase.ActiveLicense {
			for j := range licenseBase.LicenseData[i].Tickets {
				if  licenseBase.LicenseData[i].Tickets[j].TicketID == ticketid {
					if licenseBase.LicenseData[i].Tickets[j].IsPaid == "true" {
						return shim.Error("Already Paid for the ticket")
					} else {
						licenseBase.LicenseData[i].Tickets[j].IsPaid = "true"
					}
					break 
				}  
			}
			break
		}
	}



	dataJSONasBytes, err := json.Marshal(licenseBase)
	if err != nil {
		return shim.Error(err.Error())
	}

	err = stub.PutState(uid, dataJSONasBytes)
	if err != nil {
		return shim.Error(err.Error())
	}

	return shim.Success(nil)
}