import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { PutStateService } from '../put-state.service'
import { Fabric_Response } from '../../assets/data_structures'
import { stringify } from 'querystring';

@Component({
  selector: 'app-basic-info1',
  templateUrl: './basic-info1.component.html',
  styleUrls: ['./basic-info1.component.css']
})
export class BasicInfo1Component implements OnInit {

  response: Fabric_Response;
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
      .then((res: Fabric_Response) => {
        console.log("working" + JSON.stringify(res));
        this.response = res
        if (res.status === "") {
          
        }
      });
  }
}
