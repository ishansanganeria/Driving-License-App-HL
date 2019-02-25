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

var recordCount int 

type SimpleChaincode struct {

}

type basicCardHolderData struct {
	ObjectType 	string `json:"docType"`
	ID			string `json:"id"`
	Name 		string `json:"name"`
	DOB			string `json:"dob"`
	Gender		string `json:"gender"`
}

type contactDetails struct {

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
	function, args:= stub.GetFunctionAndParameters()
	fmt.Println("The function being invoked is: " + function)

	if function == "CreateBaseRecord" { 
		return t.CreateBaseRecord(stub, args)
	} else if function == "ReadBaseRecord" {
		return t.ReadBaseRecord(stub, args)
	} else if function == "DeleteBaseRecord" {
		return t.DeleteBaseRecord(stub,args)
	} else if function == "CreateContactsRecord" {
		// return t.CreateContactsRecord(stub, args)
	}
	
	
	fmt.Println("Function not found: " + function)
	return shim.Error("Received unknown function invocation")
}

func (t *SimpleChaincode) CreateBaseRecord(stub shim.ChaincodeStubInterface, args []string) pb.Response {

	if len(args) != 4 {
		return shim.Error("Incorrect number of arguments. Expecting 3")
	}

	for i := 0; i < 4; i++ {
		if len(args[i]) <= 0 {
			ERR := "Argument " + string(i) + " should be non empty"
			return shim.Error(ERR)
		}
	}


	_, err := strconv.Atoi(args[0])
	if err != nil {
		return shim.Error("ID must be numeric string")
	}
	id 	:= string(args[0])
	name	:= strings.ToUpper(args[1])
	dob		:= args[2]
	gender	:= args[3]
	objectType := "basicData"

	data := &basicCardHolderData{objectType, id, name, dob, gender}
	dataJSONasBytes, err := json.Marshal(data)
	if err != nil {
		return shim.Error(err.Error())
	}

	err = stub.PutState(string(id), dataJSONasBytes)
	if err != nil {
		return shim.Error(err.Error())
	}

	recordCount += 1 
	return shim.Success(nil)
}

func (t *SimpleChaincode) ReadBaseRecord(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments. Expecting id of the card holder")
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

	id := args[0]
	_, err := strconv.Atoi(id)
	if err != nil {
		return shim.Error("ID must be numeric string")
	}

	valAsbytes, err := stub.GetState(id)

	if err != nil {
		shim.Error("Error: Failed to fetch database: " + err.Error())
	} else if valAsbytes == nil {
		shim.Error("Error: Database doesnt exist")
	}

	err = json.Unmarshal([]byte(valAsbytes), &BaseDataJSON)
	if err != nil {
		jsonResp = "{\"Error\":\"Failed to decode JSON of: " + id + "\"}"
		return shim.Error(jsonResp)
	}

	err = stub.DelState(id) //remove the marble from chaincode state
	if err != nil {
		return shim.Error("Failed to delete state:" + err.Error())
	}
	return shim.Success(nil)
}