import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Fabric_Response } from 'src/assets/data_structures';
import { PutStateService } from '../put-state.service'

@Component({
  selector: 'app-basic-info2',
  templateUrl: './basic-info2.component.html',
  styleUrls: ['./basic-info2.component.css']
})
export class BasicInfo2Component implements OnInit {
  
  response: Fabric_Response;
  uid: number;
  submitButton: Boolean = false;

  constructor(private activatedRoute: ActivatedRoute, private putStateService: PutStateService) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(event => {
      this.uid = event.uid;
    });
  }

  form = new FormGroup({
    relfname: new FormControl('', Validators.required),
    rellname: new FormControl('', Validators.required),
    birthplace: new FormControl('', Validators.required),
    nationality: new FormControl('', Validators.required),
    emergency_number: new FormControl('', Validators.required),
    bloodgroup: new FormControl('', Validators.required),
  })

  fillbd2() {
    this.submitButton = true;
    this.response = { status: "Processing", message: "PROCESSING SUBMISSION..." };

    this.putStateService.createUIDAI2(this.uid, this.form.value)
      .then((res: Fabric_Response) => {
        if (res.status == "success") {
          res.message = "Basic data 2 stored successfully."
          this.response = res
        }
        else {
          this.response = res
        }
      })

  }
}
