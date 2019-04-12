package main

import (
	"encoding/json"
	"fmt"
	"bytes"
	"github.com/hyperledger/fabric/core/chaincode/shim"
	pb "github.com/hyperledger/fabric/protos/peer"
)


type SimpleChainCode struct {
}

// SEPERATE DOCUMENT 1
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
	} else if  function == "ReturnAccountDetails" 			{ //CREATE A NEW ENTRY
		return t.ReturnAccountDetails(stub, args)
	}
	
    fmt.Println("Function not found: " + function)
	strin := "args: "
	for i := 0; i < len(args); i++ {
		strin += args[i]
	}
    fmt.Println(strin)
	return shim.Error("Received unknown function invocation")
}

// id, firstname, lastname, gender, dob, age, contact_number, emailid, photohash, dochash
func (t *SimpleChainCode) CreateUserAccount(stub shim.ChaincodeStubInterface, args []string) pb.Response {

	if len(args) != 10 {
		return shim.Error("Incorrect number of arguments. Expecting 10")
	}

	for i := 0; i < 10; i++ {
		if len(args[i]) <= 0 {
			var b bytes.Buffer
			ERR := "Argument " + string(i) + " should be non empty"
			fmt.Println(ERR)
			fmt.Println(i)
			b.WriteString(ERR)
			return shim.Error(b.String())
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

	var uidaiData UIDAIDetails
	uidaiData.ID = id
	uidaiData.DocType = objectType
	uidaiData.BasicData_1.First_Name = firstname
	uidaiData.BasicData_1.Last_Name = lastname
	uidaiData.BasicData_1.Gender = gender
	uidaiData.BasicData_1.DOB = dob
	uidaiData.BasicData_1.Age = age
	uidaiData.BasicData_1.ContactNumber = contact_number
	uidaiData.BasicData_1.EmailID = emailid
	uidaiData.BasicData_1.PhotoHash = photohash
	uidaiData.BasicData_1.DocumentHash = dochash

	dataJSONasBytes, err := json.Marshal(uidaiData)
	if err != nil {
		return shim.Error(err.Error())
	}

	err = stub.PutState(string(id), dataJSONasBytes)
	if err != nil {
		return shim.Error(err.Error())
	}

	return shim.Success(nil)
}

func (t *SimpleChainCode) ReturnAccountDetails(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments. Expecting 1")
	}
	detailsAsBytes, _ := stub.GetState(args[0])
	return shim.Success(detailsAsBytes)
}