package main

import (
	"encoding/json"
	"fmt"
	"github.com/hyperledger/fabric/core/chaincode/shim"
	pb "github.com/hyperledger/fabric/protos/peer"
	// "github.com/hyperledger/fabric/common/util"
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
}

type UIDAIDetails struct {
	DocType      		    string             `json:"objectType"`
	ID           		    string             `json:"id"`
	BasicData_1  		    BasicInfo1         `json:"basicdata1"`
	BasicData_2  		    BasicInfo2         `json:"basicdata2"`
	AddressData  		    Address            `json:"address"`
	IsActive				string			   `json:"isactive"`
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
	licensebase.NextProcess = "learning"
	licensebase.RTO_ID = uidaiData.AddressData.Pin

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

	for i := 0; i < 2; i++ {
		if len(args[i]) <= 0 {
			ERR := "Argument " + string(i) + " should be non empty"
			return shim.Error(ERR)
		}
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
	doctype 		:= 		"Officer_Info"
	firstname 		:= 		uidaiData.BasicData_1.First_Name
	lastname 		:= 		uidaiData.BasicData_1.Last_Name
	gender 			:= 		uidaiData.BasicData_1.Gender
	dob 			:= 		uidaiData.BasicData_1.DOB
	age 			:= 		uidaiData.BasicData_1.Age
	contact_number	:=		uidaiData.BasicData_1.ContactNumber
	Email			:=		uidaiData.BasicData_1.EmailID
	

	officerdata.OfficerID 					= 	"OFF" + uid
	officerdata.DocType 					= 	doctype
	officerdata.BasicData_1.First_Name	 	= 	firstname
	officerdata.BasicData_1.Last_Name	 	= 	lastname
	officerdata.BasicData_1.Gender	 		= 	gender
	officerdata.BasicData_1.DOB	 			= 	dob
	officerdata.BasicData_1.Age				= 	age
	officerdata.BasicData_1.ContactNumber	=	contact_number
	officerdata.BasicData_1.EmailID			=	Email
	officerdata.RTO_ID						=	rtoid

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
	filenumber 	:= string(licensetype[0]) + uid
		
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
	}

	licenseData.NextProcess = "nil"
	licenseData.CurrentFile = filenumber
	
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
	status.Number  = "1"

	filedata.FileStatus  = append(filedata.FileStatus, status)
	licenseData.LicenseData = append(licenseData.LicenseData, filedata)

	dataJSONasBytes, err := json.Marshal(licenseData)
	if err != nil {
		return shim.Error(err.Error())
	}

	err = stub.PutState(uid, dataJSONasBytes)
	if err != nil {
		return shim.Error(err.Error())
	}

	return shim.Success(nil)
}
