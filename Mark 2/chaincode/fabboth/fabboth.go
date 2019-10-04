package main

import (
	"encoding/json"
	"fmt"
	"github.com/hyperledger/fabric/core/chaincode/shim"
	pb "github.com/hyperledger/fabric/protos/peer"
)

type SimpleChainCode struct {
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

	if function == "BlankRun"{
		return t.BlankRun(stub)
	} else if function == "FetchAccountDetails" 			{ //CREATE A NEW ENTRY
		return t.FetchAccountDetails(stub, args)
	} else if function == "ReturnAccountDetails" 			{ //CREATE A NEW ENTRY
		return t.ReturnAccountDetails(stub, args)
	} else if function == "DeleteAccountDetails" 			{ //CREATE A NEW ENTRY
		return t.DeleteAccountDetails(stub, args)
	} 
	
    fmt.Println("Function not found: " + function)
	return shim.Error("Received unknown function invocation")
}

func (t *SimpleChainCode) BlankRun(stub shim.ChaincodeStubInterface) pb.Response {
	return shim.Success(nil)
}

// id
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
	
	response := stub.InvokeChaincode("fabuidai",bargs, "channeluidai")
	//CHECCK RESPONSE OBJECT AND CORRECT FLOW
	if response.Status != 200 {
		return shim.Error(response.Message)
	}
	var uidaiData UIDAIDetails
	err := json.Unmarshal(response.Payload, &uidaiData) //unmarshal it aka JSON.parse()
	if err != nil {
		return shim.Error(err.Error())
	}

	if uidaiData.IsActive == "false" {
		return shim.Error("This card hasn't been activated yet. Please complete the registration process first.\n")
	}

	err = stub.PutState(s[1], response.Payload)
	if err != nil {
		return shim.Error(err.Error())
	}

	dataasBytes, err := json.Marshal(response.Payload)
	if err != nil {
		return shim.Error(err.Error())
	}
	return shim.Success(dataasBytes)
}

func (t *SimpleChainCode) ReturnAccountDetails(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments. Expecting 1")
	}
	detailsAsBytes, _ := stub.GetState(args[0])
	return shim.Success(detailsAsBytes)
}

func (t *SimpleChainCode) DeleteAccountDetails(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments. Expecting 1")
	}

	err := stub.DelState(args[0])
	if err != nil {
		return shim.Error(err.Error())
	}
	return shim.Success(nil)
}