package main

import (
	// "encoding/json"
	"fmt"
	"github.com/hyperledger/fabric/core/chaincode/shim"
	pb "github.com/hyperledger/fabric/protos/peer"
	// "github.com/hyperledger/fabric/common/util"
)

type SimpleChainCode struct {
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
	UIDNo         			string		 	    `json:"uid"`
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

// SEPERATE DOCUMENT 2.1
type LicenseBase struct {
	DocType      			string              `json:"objectType"`
	ID           			string              `json:"id"`					//REFERS UIDAIDetails's ID(json:"id")
	RTO_ID       			string              `json:"rto"`
	LicenseData  			[]LicenseInfo       `json:"licensedata"`
	VehiclesData 			[]VehiclesOwned     `json:"vehiclesowned"`
}

// SEPERATE DOCUMENT 2.2
type RTOInfo struct {
  	DocType       			string		        `json:"objectType"`
	RTOID         			string  	        `json:"rtoid"`
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

	if function == "FetchAccountDetails" 			{ //CREATE A NEW ENTRY
		return t.FetchAccountDetails(stub, args)
	}
	
    fmt.Println("Function not found: " + function)
	return shim.Error("Received unknown function invocation")
}

// id, firstname, lastname, gender, dob, age, contact_number, emailid, photohash, dochash
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
	s[1] = "865219083334"

	bargs := make([][]byte, len(s))
	for i, arg := range s {
		bargs[i] = []byte(arg)
	}
	
	dataJSONasBytes := stub.InvokeChaincode("fabboth",bargs, "channelboth")

	err := stub.PutState(s[1], dataJSONasBytes.Payload)
	if err != nil {
		return shim.Error(err.Error())
	}

	return shim.Success(nil)
}

