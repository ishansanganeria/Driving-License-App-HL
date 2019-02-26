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


type CardHoldersDetails struct {
	DocType         string			`json:"objectType"`
	ID              string			`json:"id"`
	BasicData_1 	basicData1		`json:"basicdata1"`
	BasicData_2 	basicData2		`json:"basicdata2"`
	RTO_Data		RTOInfo 		`json:"rto"`
	AddressData		Address			`json:"address"`
	LicenseData		[]LicenseInfo	`json:"licensedata"`
	Tickets			[]TicketInfo 	`json:"tickets"`
	VehiclesData	[]VehiclesOwned	`json:"vehiclesowned"`
	TestData	 	[]TestInfo		`json:"testdata"`
}

type basicData1 struct {
	First_Name      string          `json:"firstname"`
	Last_Name       string          `json:"lastname"`
	UIDNo           string          `json:"uid"`
	Gender          string          `json:"gender"`
	DOB             string          `json:"dob"`
	Age             string          `json:"age"`
	ContactNumber   string 			`json:"contact_number"`
	EmailID         string 			`json:"Email"`
}

type basicData2 struct {
	RelFirstName    string 			`json:"relfname"`
	RelLastName     string 			`json:"rellname"`
	BirthPlace      string 			`json:"birthplace"`
	Nationality     string 			`json:"nationality"`
	EmergencyNumber string 			`json:"emergency_number"`
	BloodGroup		string			`json:"bloodgroup"`
}

type Address struct {
	AddressLine1 	string `json:"addressline1"`
	AddressLine2 	string `json:"addressline2"`
	City    		string `json:"city"`
	Pin     		string `json:"pincode"`
	State   		string `json:"state"`
}

type RTOInfo struct {
	RTOID			string			`json:"rtoid"`
	AddressData		Address			`json:"address"`
	ContactNumber   string			`json:"contactno"`
}
//
type VehiclesOwned struct {
	VehicleType 	string			`json:"vehicletype"`				//2,3,4 wheeler, truck,etc
	NumberPlate		string			`json:"numberplate"`
	CarCompany		string			`json:"carcompany"`					//Maruti,etc
	CarMake			string			`json:"carmake"`					//800,alto
	CarColour		string			`json:"carcolour"`					
	ChasisNumber	string			`json:"chasisnumber"`				
}

type LicenseInfo struct {
	FileNumber		string				`json:"filenumber"`
	LicenseType		string				`json:"licensetype"`				//Learner, Permanent
	LicenseNumber	string				`json:"licensenumber"`
	DateOfIssue		string				`json:"dateofissue"`
	DateOfExpiry	string				`json:"dateofexpiry"`
	PhotoHash		string				`json:"photohash"`
	IsActive		bool				`json:"isactive"`	
	ReasonOfInactivity	string
}

type TicketInfo struct {
	TicketIssuer	string				`json:"tickerissuer"`				//Issuer cops id number
	Reason			string				`json:"reason"`
	DateOfIssue		string				`json:"dateofissue"`
	TimeOfIssue		string				`json:"timeofissue"`
	Place			string				`json:"place"`
}

type TestInfo struct {
	TestType 		string		`json:"testtype"`			//(written, simulated, practical)
	TestCentre		RTOInfo 	`json:"testcentre"`
	FileNumber		string		`json:"filenumber"`
	Score			string		`json:"score"`
	MaxMarks		string		`json:"maxmarks"`
	PassingMarks	string		`json:"passingmarks"`
	IsPass			bool		`json:"ispass"`
	Invigilator		string		`json:"invigilator"`
}

type OfficerInfo struct {
	ID              string			`json:"id"`
	DocType         string			`json:"objectType"`
	BasicData_1 	basicData1		`json:"basicdata1"`
	BasicData_2 	basicData2		`json:"basicdata2"`
	RTO_Affiliation	RTOInfo 		`json:"rto"`
	AddressData		Address			`json:"address"`
}

func main() {
	err := shim.Start(new(CardHoldersDetails))
	if err != nil {
		fmt.Printf("Error in starting the simple chaincode: %s", err)
	}
}

func (t *CardHoldersDetails) Init(stub shim.ChaincodeStubInterface) pb.Response {
	return shim.Success(nil)
}

func (t *CardHoldersDetails) Invoke(stub shim.ChaincodeStubInterface) pb.Response {
	function, args := stub.GetFunctionAndParameters()
	fmt.Println("The function being invoked is: " + function)

	if function == "CreateBaseRecord" { //create a new entry
		return t.CreateBaseRecord(stub, args)
	} else if function == "AddBaseData2" { //Add ENtries of baseData2
		return t.AddBaseData2(stub, args)
	} else if function == "AddVehicle" { //Add ENtries of baseData2
		return t.AddVehicle(stub, args)
	}
	 
	fmt.Println("Function not found: " + function)
	return shim.Error("Received unknown function invocation")
}

//Account initialization and BasicData_1
func (t *CardHoldersDetails) CreateBaseRecord(stub shim.ChaincodeStubInterface, args []string) pb.Response{

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
	firstname 		:= 		args[1]
	lastname  		:= 		args[2]
	gender	  		:= 		args[3]
	dob		  		:= 		args[4]
	age		  		:= 		args[5]
	contact_number 	:= 		args[6]
	emailid	  		:= 		args[7]

	var baseData CardHoldersDetails
	baseData.ID =  id
	baseData.DocType = objectType
	baseData.BasicData_1.First_Name 	= firstname
	baseData.BasicData_1.Last_Name		= lastname
	baseData.BasicData_1.UIDNo 			= id
	baseData.BasicData_1.Gender			= gender 
	baseData.BasicData_1.DOB			= dob
	baseData.BasicData_1.Age			= age
	baseData.BasicData_1.ContactNumber	= contact_number
	baseData.BasicData_1.EmailID		= emailid
	
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

func (t *CardHoldersDetails) AddBaseData2(stub shim.ChaincodeStubInterface, args []string) pb.Response {

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
	err = json.Unmarshal(dataAsBytes, &baseData) //unmarshal it aka JSON.parse()
	if err != nil {
		return shim.Error(err.Error())
	}
	
	relfname 		:= 	args[1]
	rellname  		:= 	args[2]
	pob	  			:= 	args[3]
	nationality		:= 	args[4]
	emerno		  	:= 	args[5]
	bg 				:= 	args[6]

	baseData.BasicData_2.RelFirstName 		= relfname
	baseData.BasicData_2.RelLastName		= rellname
	baseData.BasicData_2.BirthPlace 		= pob
	baseData.BasicData_2.Nationality		= nationality 
	baseData.BasicData_2.EmergencyNumber	= emerno
	baseData.BasicData_2.BloodGroup			= bg
	
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

func (t *CardHoldersDetails) AddVehicle(stub shim.ChaincodeStubInterface, args []string) pb.Response {

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
	
	i := 0
	for _, info := range baseData.VehiclesData {
		i++;		_ = info					//Reduntant statement to avoid error
	}
	
	// VehicleType 	string			`json:"	   vehicletype"`				//2,3,4 wheeler, truck,etc
	// NumberPlate		string			`json:"numberplate"`
	// CarCompany		string			`json:"carcompany"`					//Maruti,etc
	// CarMake			string			`json:"carmake"`					//800,alto
	// CarColour		string			`json:"carcolour"`					
	// ChasisNumber	string			`json:"    chasisnumber"`				
	fmt.Println("0")
	
	var vehiclesdata VehiclesOwned
	vehiclesdata.VehicleType = vehicletype
	vehiclesdata.NumberPlate = numberplate
	vehiclesdata.CarCompany =  carcompany
	vehiclesdata.CarMake =     carmake
	vehiclesdata.CarColour =   carcolour
	vehiclesdata.ChasisNumber =chasisnumber
	
	baseData.VehiclesData = append(baseData.VehiclesData, vehiclesdata)

	fmt.Println("1")
	dataJSONasBytes, err := json.Marshal(baseData)
	if err != nil {
		return shim.Error(err.Error())
	}
	fmt.Println("2")

	err = stub.PutState(id, dataJSONasBytes)
	if err != nil {
		return shim.Error(err.Error())
	}
	fmt.Println("3")

	return shim.Success(nil)

}

// func (t *CardHoldersDetails) ReadBaseRecord(stub shim.ChaincodeStubInterface, args []string) pb.Response {
// 	if len(args) != 1 {
// 		return shim.Error("Incorrect number of arguments. Expecting id of the card holder")
// 	}

// 	if len(args[0]) <= 0 {
// 		ERR := "Argument 1 should be non empty"
// 		return shim.Error(ERR)
// 	}

// 	_, err := strconv.Atoi(args[0])
// 	if err != nil {
// 		return shim.Error("ID must be numeric string")
// 	}

// 	valAsbytes, err := stub.GetState(string(args[0]))

// 	if err != nil {
// 		shim.Error("Error: Failed to fetch database: " + err.Error())
// 	} else if valAsbytes == nil {
// 		shim.Error("Error: Database doesnt exist")
// 	}

// 	return shim.Success(valAsbytes)
// }

// func (t *CardHoldersDetails) DeleteBaseRecord(stub shim.ChaincodeStubInterface, args []string) pb.Response {
// 	var jsonResp  	string
// 	var BaseDataJSON basicCardHolderData

// 	if len(args) != 1 {
// 		return shim.Error("Incorrect number of arguments. Expecting 1")
// 	}

// 	id := args[0]
// 	_, err := strconv.Atoi(id)
// 	if err != nil {
// 		return shim.Error("ID must be numeric string")
// 	}

// 	valAsbytes, err := stub.GetState(id)

// 	if err != nil {
// 		shim.Error("Error: Failed to fetch database: " + err.Error())
// 	} else if valAsbytes == nil {
// 		shim.Error("Error: Database doesnt exist")
// 	}

// 	err = json.Unmarshal([]byte(valAsbytes), &BaseDataJSON)
// 	if err != nil {
// 		jsonResp = "{\"Error\":\"Failed to decode JSON of: " + id + "\"}"
// 		return shim.Error(jsonResp)
// 	}

// 	err = stub.DelState(id) //remove the marble from chaincode state
// 	if err != nil {
// 		return shim.Error("Failed to delete state:" + err.Error())
// 	}
// 	return shim.Success(nil)
// }
