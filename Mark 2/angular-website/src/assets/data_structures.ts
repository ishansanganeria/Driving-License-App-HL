export class Fabric_Response {
    status: string;
    message: string;
}

export class Fabric_Response_UIDAIDetails {
    status: string;
    message: string;
}

export class UIDAIDetails {
	objectType : string
	id : string
	basicdata1 : Basic_Info_1
	basicdata2 : Basic_Info_2
	address : Basic_Info_3
	isactive : string
}


export class Basic_Info_1 {
    firstname: string;
    lastname: string;
    gender: string;
    dob: string;
    age: string;
    contact_number: string;
    emailid: string;
    photohash: string;
    dochash: string;
}

export class Basic_Info_2 {
    relfname: string;
    rellname: string;
    birthplace: string;
    nationality: string;
    emergency_number: string;
    bloodgroup: string;
}

export class Basic_Info_3 {
    addressline1: string;
    addressline2: string;
    city: string;
    pincode: string;
    state: string;
}

