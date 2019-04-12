import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { PutStateService } from '../put-state.service'
import { stringify } from 'querystring';

@Component({
  selector: 'app-basic-info1',
  templateUrl: './basic-info1.component.html',
  styleUrls: ['./basic-info1.component.css']
})
export class BasicInfo1Component implements OnInit {

  constructor(private putStateService: PutStateService) { }
  
  

  ngOnInit() {
  }

  form = new FormGroup({
    firstname: new FormControl('', Validators.required),
    lastname: new FormControl('', Validators.required),
    gender: new FormControl('', Validators.required),
    dob: new FormControl('', Validators.required),
    age: new FormControl(''),
    contact_number: new FormControl('', Validators.required),
    emailid: new FormControl('', Validators.required),
    photo: new FormControl(''),
    doc: new FormControl(''),
  })

  fillbd1() {
    this.putStateService.createUIDAI(this.form.value)
      .then((res) => {
        let response = res
        console.log("working" + res);
      });
  }
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
