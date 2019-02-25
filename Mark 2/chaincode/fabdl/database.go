type RTOinformation struct {

    ObjectType 		    string `json:"docType"`
	ID					string `json:"id"`
	State 				string `json:"state"`
	RTO Office			string `json:"rto"`
	Pincode				string `json:"pin"`
}

type basicCardHolderData struct {
	ObjectType 		    string `json:"docType"`
	ID					string `json:"id"`
	FName				string `json:"fname"`
	MName				string `json:"mname"`
	LName				string `json:"lname"`
	RelationFName 		string `json:"relfname"`
	RelationMName 		string `json:"relmname"`
	RelationLName 		string `json:"rellname"`
	Aadhar Number		string `json:"aadhar"`
	Gender				string `json:"gender"`
	DOB 				string `json:"dob"`
	Age  				string `json:"age"`
	Place of birth		string `json:"pob"`
	Country of birth  	string `json:"cob"`
	Phone Number		string `json:"phone"`
	Emer. Phone Number	string `json:"emergencyphone"`
	E-Mail				string `json:"email"`
}


type Address struct {
    ObjectType 		    string `json:"docType"`
	ID					string `json:"id"`
    Present State 	    string `json:"pstate"`
	Present City        string `json:"pcity"`
	Present Address		string `json:"paddress"`
	Present Pincode		string `json:"pin"`
	Permanent State		string `json:"permanentstate"`
	Permanent City		string `json:"permanentcity"`
	Permanent Address	string `json:"permanentaddress"`
	Permanent Pincode	string `json:"permanentpin"`
}
type Vehicle struct {
    ObjectType 		    string `json:"docType"`
	ID					string `json:"id"`
    Class		 	    string `json:"class"`
	
}