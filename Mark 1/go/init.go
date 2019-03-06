package main

import (
//	"cmd/go/internal/str"
	// "bytes"
	"encoding/json"
	"fmt"
	// "strconv"
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
	ID			int    `json:"id"`
	Name 		string `json:"name"`
	DOB			string `json:"dob"`
	Gender		string `json:"gender"`
}

func main() {
	err := shim.Start(new(SimpleChaincode))
	if err != nil {
		fmt.Printf("Error in starting the simple chaincode: %s", err)
	}
}

func (t *SimpleChaincode) Init(stub shim.ChaincodeStubInterface) pb.Response {
	recordCount = 1000000
	return shim.Success(nil)
}

func (t *SimpleChaincode) Invoke(stub shim.ChaincodeStubInterface) pb.Response {
	function, args:= stub.GetFunctionAndParameters()
	fmt.Println("The function being invoked is: " + function)

	if function == "CreateBaseRecord" { 
		return t.CreateBaseRecord(stub, args)
	}

	fmt.Println("Function not found: " + function)
	return shim.Error("Received unknown function invocation")
}

func (t *SimpleChaincode) CreateBaseRecord(stub shim.ChaincodeStubInterface, args []string) pb.Response {

	if len(args) != 3 {
		return shim.Error("Incorrect number of arguments. Expecting 3")
	}

	for i := 0; i < 3; i++ {
		if len(args[i]) <= 0 {
			ERR := "Argument " + string(i) + " should be non empty"
			return shim.Error(ERR)
		}
	}

	id 		:= recordCount
	name	:= strings.ToUpper(args[0])
	dob		:= args[1]
	gender	:= args[2]
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
	return shim.Success(nil)
}