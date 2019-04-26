export class Fabric_Response {
    status: string;
    message: string;
}

export class LicenseBase {
    objectType: string;
    id: string;            				//REFERS UIDAIDetails's ID(json:"id")
    rto: string;
    uidaidata: UIDAIDetails;
    licensedata: LicenseInfo[];
    vehiclesowned: VehiclesOwned[];
    nextprocess: string;
    currentfile: string;
    activelicense: string;
    nooftickets: number;

}

export class UIDAIDetails {
    objectType: string
    id: string
    basicdata1: Basic_Info_1
    basicdata2: Basic_Info_2
    address: Basic_Info_3
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

export class RTOInfo {
    objectType: string
    rtoid: string
    address: Basic_Info_3
    contactno: string
    applicants: string[]
}

export class LicenseInfo {
    filenumber: string
    licensetype: string								//Learner, Permanent
    licensenumber: string
    dateofissue: string
    dateofexpiry: string
    reason: string
    testdata: TestInfo[]
    ispass_written: string
    ispass_sim: string
    ispass_prac: string
    isactive: string
    tickets: TicketInfo[]
    filestatus: FileStatusInfo[]
    currentstatusno: string

}

export class VehiclesOwned {
    vehicletype: string    //2,3,4 wheeler, truck,etc
    numberplate: string
    carcompany: string     //Maruti,etc
    carmake: string        //800,alto
    carcolour: string
    chasisnumber: string
}

export class TestInfo {
    TestType: string										//(written, simulated, practical)
    Score: string
    MaxMarks: string
    PassingMarks: string
    Invigilator: string

}

export class TicketInfo {
    ticketissuer: string					    			//Issuer cops id number
    ticketid: string								      	//Gotta figure out
    reason: string
    dateofissue: string
    timeofissue: string
    place: string
    ispaid: string
    amount: string
}

export class FileStatusInfo {
    number: string
    filestatus: string
    date: string
    string: string
}

export class OfficerInfo {
    id: string
    objectType: string
    basicdata: Basic_Info_1
    rtoid: string
}

export class Scores {
    uid: string
    scoretype: string
} 