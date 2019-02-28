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

type CardHoldersDetails struct {
	DocType      string           `json:"objectType"`
	ID           string           `json:"id"`
	BasicData_1  basicData1       `json:"basicdata1"`
	BasicData_2  basicData2       `json:"basicdata2"`
	RTO_ID       string           `json:"rto"`
	AddressData  Address          `json:"address"`
	LicenseData  []LicenseInfo    `json:"licensedata"`
	Tickets      []TicketInfo     `json:"tickets"`
	VehiclesData []VehiclesOwned  `json:"vehiclesowned"`
}

type basicData1 struct {
	First_Name    string          `json:"firstname"`
	Last_Name     string          `json:"lastname"`
	UIDNo         string          `json:"uid"`
	Gender        string          `json:"gender"`
	DOB           string          `json:"dob"`
	Age           string          `json:"age"`
	ContactNumber string          `json:"contact_number"`
	EmailID       string          `json:"Email"`
}

type basicData2 struct {
	RelFirstName    string `json:"relfname"`
	RelLastName     string `json:"rellname"`
	BirthPlace      string `json:"birthplace"`
	Nationality     string `json:"nationality"`
	EmergencyNumber string `json:"emergency_number"`
	BloodGroup      string `json:"bloodgroup"`
}

type Address struct {
	AddressLine1 string `json:"addressline1"`
	AddressLine2 string `json:"addressline2"`
	City         string `json:"city"`
	Pin          string `json:"pincode"`
	State        string `json:"state"`
}

type RTOInfo struct {
  DocType         string			`json:"objectType"`
	RTOID         string  `json:"rtoid"`
	AddressData   Address `json:"address"`
	ContactNumber string  `json:"contactno"`
}

type VehiclesOwned struct {
	VehicleType  string `json:"vehicletype"` //2,3,4 wheeler, truck,etc
	NumberPlate  string `json:"numberplate"`
	CarCompany   string `json:"carcompany"` //Maruti,etc
	CarMake      string `json:"carmake"`    //800,alto
	CarColour    string `json:"carcolour"`
	ChasisNumber string `json:"chasisnumber"`
}

type LicenseInfo struct {
	FileNumber			    string				`json:"filenumber"`
	LicenseType			    string				`json:"licensetype"`				//Learner, Permanent
	LicenseNumber		    string				`json:"licensenumber"`
	DateOfIssue			    string				`json:"dateofissue"`
	DateOfExpiry		    string				`json:"dateofexpiry"`
	PhotoHash	  		    string				`json:"photohash"`
	IsActive		  	    string				  `json:"isactive"`	
	ReasonOfInactivity	string				`json:"reason"`
	TestData			      []TestInfo		`json:"testdata"`

}

type TicketInfo struct {
	TicketIssuer	      string				`json:"ticketissuer"`	    			//Issuer cops id number
	TicketID	  	      string				`json:"ticketid"`				      	//Gotta figure out
	Reason		  	      string				`json:"reason"`
	DateOfIssue		      string				`json:"dateofissue"`
	TimeOfIssue		      string				`json:"timeofissue"`
	Place		    	      string				`json:"place"`
	IsPaid		  	      string				`json:"ispaid"`
}

type TestInfo struct {
	TestType 		      	string				`json:"testtype"`			//(written, simulated, practical)
	Score				        string				`json:"score"`
	MaxMarks        		string				`json:"maxmarks"`
	PassingMarks		    string				`json:"passingmarks"`
	IsPass				      string			  `json:"ispass"`
	Invigilator			    string				`json:"officerid"`
}

type OfficerInfo struct {
	OfficerID           string			  `json:"id"`				//officer's phone number
	DocType             string			  `json:"objectType"`
	BasicData_1 	      basicData1		`json:"basicdata"`
	RTO_ID			        string 			  `json:"rtoid"`
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

	if function == "CreateBaseRecord" { //create a new entry
		return t.CreateBaseRecord(stub, args)
	} else if function == "AddBaseData2" { //Add ENtries of baseData2
		return t.AddBaseData2(stub, args)
	} else if function == "AddAddressData" { //Add ENtries of baseData2
		return t.AddAddressData(stub, args)
  } else if function == "AddVehicle" 		{ //ADD USER'S VEHICLE 
    return t.AddVehicle(stub, args)
  } else if function == "AddRTO" 			{ //ADD A NEW RTO TO THE SYSTEM
    return t.AddRTO(stub, args)
  } else if function == "AddTicket" 		{ //REGISTER A TICKET GENERATED FOR USER
    return t.AddTicket(stub, args)
  } else if function == "AddOfficer" 		{ //REGISTER A OFFICER TO THE SYSTEM
    return t.AddOfficer(stub, args)
  } else if function == "LicenseApply"  { //CREATE APPLICATION FILE
    return t.LicenseApply(stub, args)
  }
//    else if function == "AddTestResult"  { //CREATE APPLICATION FILE
//     return t.AddTestResult(stub, args)
//   }
  
  fmt.Println("Function not found: " + function)
	return shim.Error("Received unknown function invocation")
}

//Account initialization and BasicData_1
func (t *SimpleChainCode) CreateBaseRecord(stub shim.ChaincodeStubInterface, args []string) pb.Response {

	if len(args) != 8 {
		return shim.Error("Incorrect number of arguments. Expecting 1")
	}

	for i := 0; i < 8; i++ {
		if len(args[i]) <= 0 {
			ERR := "Argument " + string(i) + " should be non empty"
			return shim.Error(ERR)
		}
	}

	objectType := "basicData"
	id := args[0]
	firstname := args[1]
	lastname := args[2]
	gender := args[3]
	dob := args[4]
	age := args[5]
	contact_number := args[6]
	emailid := args[7]

	var baseData CardHoldersDetails
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
		return shim.Error("Failed to get marble: " + err.Error())
	} else if dataAsBytes == nil {
		fmt.Println("This data already exists: " + string(dataAsBytes))
		return shim.Error("This user doesn't exist: " + id)
	}

	var baseData CardHoldersDetails
	// baseData := CardHoldersDetails{}
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

	var baseData CardHoldersDetails
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
	
	var baseData CardHoldersDetails
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
		return shim.Error("Failed to get marble: " + err.Error())
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

func (t *SimpleChainCode) AddTicket(stub shim.ChaincodeStubInterface, args []string) pb.Response {

	if len(args) != 8 {
		return shim.Error("Incorrect number of arguments. Expecting 8")
	}

	for i := 0; i < 8; i++ {
		if len(args[i]) <= 0 {
			ERR := "Argument " + string(i) + " should be non empty"
			return shim.Error(ERR)
		}
	}

	ticketid := args[0]
	uid := args[1]
	ticketissuer := args[2]
	reason := args[3]
	dateofissue := args[4]
	timeofissue := args[5]
	place := args[6]
	ispaid := args[7]

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

	var baseData CardHoldersDetails
	err = json.Unmarshal(dataAsBytes, &baseData) //unmarshal it aka JSON.parse()
	if err != nil {
		return shim.Error(err.Error())
	}
	
	var ticket TicketInfo

	ticket.TicketIssuer 	= ticketissuer
	ticket.TicketID			= ticketid
	ticket.Reason 			= reason
	ticket.DateOfIssue 		= dateofissue
	ticket.TimeOfIssue 		= timeofissue
	ticket.Place 			= place
	ticket.IsPaid 			= ispaid
	
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

func (t *SimpleChainCode) LicenseApply(stub shim.ChaincodeStubInterface, args []string) pb.Response {

	if len(args) != 3 {
		return shim.Error("Incorrect number of arguments. Expecting 4")
	}

	for i := 0; i < 3; i++ {
		if len(args[i]) <= 0 {
			ERR := "Argument " + string(i) + " should be non empty"
			return shim.Error(ERR)
		}
	}

	uid := args[0]
	licensetype := args[1]
	photohash := args[2]
	filenumber := string(args[1][0]) + uid
		
	dataAsBytes, err := stub.GetState(uid)
	if err != nil {
		return shim.Error("Failed to fetch user details: " + err.Error())
	} else if dataAsBytes == nil {
		return shim.Error("This user doesn't exist: " + uid)
	}
	
	var baseData CardHoldersDetails
	err = json.Unmarshal(dataAsBytes, &baseData) //unmarshal it aka JSON.parse()
	if err != nil {
		return shim.Error(err.Error())
	}
	
	var filedata LicenseInfo
  filedata.FileNumber            = filenumber 
  filedata.LicenseType           = licensetype
  filedata.PhotoHash             = photohash
  filedata.IsActive              = "false"
  filedata.ReasonOfInactivity    = "Under Process for Initial Approval"
  
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

// func (t *SimpleChainCode) AddTestResult(stub shim.ChaincodeStubInterface, args []string) pb.Response {

// 	if len(args) != 7 {
// 		return shim.Error("Incorrect number of arguments. Expecting 7")
// 	}

// 	for i := 0; i < 7; i++ {
// 		if len(args[i]) <= 0 {
// 			ERR := "Argument " + string(i) + " should be non empty"
// 			return shim.Error(ERR)
// 		}
// 	}

//   uid              := args[0]
// 	dataAsBytes, err := stub.GetState(uid)
// 	if err != nil {
// 		return shim.Error("Failed to fetch user details: " + err.Error())
// 	} else if dataAsBytes == nil {
// 		return shim.Error("This user doesn't exist: " + uid)
// 	}
  
// 	testtype      := args[1]
// 	score         := args[2]
//   maxmarks      := args[3]
//   passingmarks  := args[4]
//   var ispass string
//   if score >= maxmarks {
//     ispass = "true" 
//   } else {
//     ispass = "false"
//   }
//   officerid     := args[5]
//   fileno        := args[6]
  
//   if fileno[0] == 'L' && testtype != "Written" {
//     return shim.Error("Not eligible for the test " + testtype + " since applying for learning license")
//   } 

//   var baseData CardHoldersDetails
// 	err = json.Unmarshal(dataAsBytes, &baseData) //unmarshal it aka JSON.parse()
// 	if err != nil {
// 		return shim.Error(err.Error())
// 	}
	
// 	var testdata TestInfo
//   testdata.TestType        = testtype 
//   testdata.Score           = score
//   testdata.MaxMarks        = maxmarks
//   testdata.PassingMarks    = passingmarks
//   testdata.IsPass          = ispass
//   testdata.Invigilator     = officerid 
  
//   var i,j int
//   var wflag, sflag bool
//   for i := range baseData.LicenseData {
//     if  baseData.LicenseData[i].FileNumber == fileno {
//       wflag = true
//       break 
//     }  
//   }
  
//   if !wflag {
//     return shim.Error("License Application File not found")
//   } 

//   if fileno[0] == 'P' {
//     for j := range baseData.LicenseData[i].TestData {
//       if  baseData.LicenseData[i].TestData[j].TestType == "Written" {
//         wflag = true
//         break 
//       }  else if {
        
//       }
//     }     
//     return shim.Error("Not eligible for the test " + testtype + " since applying for learning license")
//   } 



// 	baseData.LicenseData[i].TestData = append(baseData.LicenseData[i].TestData, testdata)

// 	dataJSONasBytes, err := json.Marshal(baseData)
// 	if err != nil {
// 		return shim.Error(err.Error())
// 	}

// 	err = stub.PutState(uid, dataJSONasBytes)
// 	if err != nil {
// 		return shim.Error(err.Error())
// 	}

// 	return shim.Success(nil)
// }