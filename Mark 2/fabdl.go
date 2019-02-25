package main

import (
	//	"cmd/go/internal/str"
	// "bytes"
	"encoding/json"
	"fmt"
	"strconv"
	"strings"

	// "time"
	"github.com/hyperledger/fabric/core/chaincode/shim"
	pb "github.com/hyperledger/fabric/protos/peer"
)

type SimpleChaincode struct {
}

type RTOinformation struct {
	ID      		string 	`json:"ID"`
	State   		string 	`json:"State"`
	OfficeName      string 	`json:"RTO_Office"`
	PIN     		string 	`json:"Pincode"`
}

type basicCardHolderData struct {
	DocType string `json:"ObjectType"`
	ID		string `json:"UserID"`
	FName   string `json:"FName"`
	LName   string `json:"LName"`
	UIDNo string `json:"UIDNo"`
	Gender string `json:"Gender"`
	DOB    string `json:"DOB"`
	Age    string `json:"Age"`
	RTO RTOinformation `json:"rtoinfo"`
}

type Address struct {
	DocType          string `json:"docType"`
	Id               string `json:"ID"`
	Pstate           string `json:"Present_State"`
	Pcity            string `json:"Present_City"`
	Paddress         string `json:"Present_Address"`
	Pin              string `json:"Present_Pincode"`
	Permanentstate   string `json:"Permanent_State"`
	Permanentcity    string `json:"Permanent_City"`
	Permanentaddress string `json:"Permanent_Address"`
	Permanentpin     string `json:"Permanent_Pincode"`
}
type Vehicle struct {
	docType string `json:"ObjectType"`
	ID      string `json:"ID"`
	class   string `json:"Class"`
	vnumber string `json:"Vehicle_Number" `
}

func main() {
	err := shim.Start(new(SimpleChaincode))
	if err != nil {
		fmt.Printf("Error in starting the simple chaincode: %s", err)
	}
}

func (t *SimpleChaincode) Init(stub shim.ChaincodeStubInterface) pb.Response {
	return shim.Success(nil)
}

func (t *SimpleChaincode) Invoke(stub shim.ChaincodeStubInterface) pb.Response {
	function, args := stub.GetFunctionAndParameters()
	fmt.Println("The function being invoked is: " + function)

	if function == "CreateBaseRecord" { //create a new entry
		return t.CreateBaseRecord(stub, args)
	} else if function == "ReadBaseRecord" {
		return t.ReadBaseRecord(stub, args)
	} else if function == "DeleteBaseRecord" {
		return t.DeleteBaseRecord(stub, args)
	} else if function == "CreateContactsRecord" {
		// return t.CreateContactsRecord(stub, args)
	}

	fmt.Println("Function not found: " + function)
	return shim.Error("Received unknown function invocation")
}

func (t *SimpleChaincode) CreateBaseRecord(stub shim.ChaincodeStubInterface, args []string) pb.Response {

	if len(args) != 7 {
		return shim.Error("Incorrect number of arguments. Expecting 7")
	}

	for i := 0; i < 7; i++ {
		if len(args[i]) <= 0 {
			ERR := "Argument " + string(i) + " should be non empty"
			return shim.Error(ERR)
		}
	}

	_, err := strconv.Atoi(args[0])
	if err != nil {
		return shim.Error("ID must be numeric string")
	}

	DocType := "basicData"
	ID := string(args[0])
	FName := strings.ToUpper(args[1])
	LName := strings.ToUpper(args[2])
	DOB := args[3]
	Age := args[4]
	Gender := args[5]
	adhar := args[6]

	rto  := &RTOinformation{"","","",""}
	data := &basicCardHolderData{DocType, ID, FName, LName, DOB, Age, Gender, aadhar, *rto}
	dataJSONasBytes, err := json.Marshal(data)
	if err != nil {
		return shim.Error(err.Error())
	}

	err = stub.PutState(string(ID), dataJSONasBytes)
	if err != nil {
		return shim.Error(err.Error())
	}

	//recordCount += 1
	return shim.Success(nil)
}

func (t *SimpleChaincode) ReadBaseRecord(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments. Expecting ID of the card holder")
	}

	if len(args[0]) <= 0 {
		ERR := "Argument 1 should be non empty"
		return shim.Error(ERR)
	}

	_, err := strconv.Atoi(args[0])
	if err != nil {
		return shim.Error("ID must be numeric string")
	}

	valAsbytes, err := stub.GetState(string(args[0]))

	if err != nil {
		shim.Error("Error: Failed to fetch database: " + err.Error())
	} else if valAsbytes == nil {
		shim.Error("Error: Database doesnt exist")
	}

	return shim.Success(valAsbytes)
}

func (t *SimpleChaincode) DeleteBaseRecord(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	var jsonResp string
	var BaseDataJSON basicCardHolderData

	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments. Expecting 1")
	}

	ID := args[0]
	_, err := strconv.Atoi(ID)
	if err != nil {
		return shim.Error("ID must be numeric string")
	}

	valAsbytes, err := stub.GetState(ID)

	if err != nil {
		shim.Error("Error: Failed to fetch database: " + err.Error())
	} else if valAsbytes == nil {
		shim.Error("Error: Database doesnt exist")
	}

	err = json.Unmarshal([]byte(valAsbytes), &BaseDataJSON)
	if err != nil {
		jsonResp = "{\"Error\":\"Failed to decode JSON of: " + ID + "\"}"
		return shim.Error(jsonResp)
	}

	err = stub.DelState(ID) //remove the marble from chaincode state
	if err != nil {
		return shim.Error("Failed to delete state:" + err.Error())
	}
	return shim.Success(nil)
}
