import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { PutStateService } from '../put-state.service'
import { Fabric_Response } from '../../assets/data_structures'

@Component({
  selector: 'app-basic-info1',
  templateUrl: './basic-info1.component.html',
  styleUrls: ['./basic-info1.component.css']
})
export class BasicInfo1Component implements OnInit {

  form : FormGroup;
  response: Fabric_Response;
  submitButton: Boolean = false;
  uid: number;

  constructor(private putStateService: PutStateService) { }

  ngOnInit() {

    this.form = new FormGroup({
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
  }
  fillbd1() {
    this.submitButton = true;
    this.response = { status: "Processing", message: "PROCESSING SUBMISSION..." }

    this.putStateService.createUIDAI(this.form.value)
      .then((res: Fabric_Response) => {
        this.uid = parseInt(res.message)
        res.message = "Basic data 1 stored successfully." + "The aadhar number alloted is " + this.uid + ".\n Please note it"
        this.response = res
        if (res.status === "success") {

        }
      });
  }
}
