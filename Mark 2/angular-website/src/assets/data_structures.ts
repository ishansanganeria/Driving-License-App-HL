export class Fabric_Response {
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
    RelFirstName: string;
    RelLastName: string;
    BirthPlace: string;
    Nationality: string;
    EmergencyNumber: string;
    BloodGroup: string;
}

export class Basic_Info_3 {
    AddressLine1: string;
    AddressLine2: string;
    City: string;
    Pin: string;
    State: string;
}

