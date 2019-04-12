export class Basic_Info_1 {
    firstname   : string;
    lastname    : string;
    gender  : string;
    dob : string;
    age : string;
    contact_number  : string;
    emailid : string;
    photohash   : string;
    dochash : string;    
}

export class Fabric_Response {
    status : string;
    message: string;
}

// First_Name    			string		 	    `json:"firstname"`
// Last_Name     			string		 	    `json:"lastname"`
// Gender        			string		 	    `json:"gender"`
// DOB           			string		 	    `json:"dob"`
// Age           			string		 	    `json:"age"`
// ContactNumber 			string		 	    `json:"contact_number"`
// EmailID       			string		 	    `json:"emailid"`
// PhotoHash	  			string			    `json:"photohash"`	
// DocumentHash  			string			    `json:"dochash"`	

// type BasicInfo2 struct {
// 	RelFirstName    		string	            `json:"relfname"`
// 	RelLastName     		string	            `json:"rellname"`
// 	BirthPlace      		string	            `json:"birthplace"`
// 	Nationality     		string	            `json:"nationality"`
// 	EmergencyNumber 		string	            `json:"emergency_number"`
// 	BloodGroup      		string	            `json:"bloodgroup"`
// }

// type Address struct {
// 	AddressLine1 			string 			    `json:"addressline1"`
// 	AddressLine2 			string 			    `json:"addressline2"`
// 	City         			string 			    `json:"city"`
// 	Pin          			string 			    `json:"pincode"`
// 	State        			string 			    `json:"state"`
// }
