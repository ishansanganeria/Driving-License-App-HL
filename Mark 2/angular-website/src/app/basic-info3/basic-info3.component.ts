import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Fabric_Response } from 'src/assets/data_structures';
import { PutStateService } from '../put-state.service'


@Component({
  selector: 'app-basic-info3',
  templateUrl: './basic-info3.component.html',
  styleUrls: ['./basic-info3.component.css']
})
export class BasicInfo3Component implements OnInit {

  response: Fabric_Response;
  uid: number;
  submitButton: Boolean = false;

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private putStateService: PutStateService) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(event => {
      this.uid = event.uid;
    });
  }

  form = new FormGroup({
    addressline1: new FormControl('', Validators.required),
    addressline2: new FormControl('', Validators.required),
    city: new FormControl('', Validators.required),
    pincode: new FormControl('', Validators.required),
    state: new FormControl('', Validators.required),
  })

  fillbd3() {
    this.submitButton = true;
    this.response = { status: "Processing", message: "PROCESSING SUBMISSION..." };

    this.putStateService.createUIDAI3(this.uid, this.form.value)
      .then((res: Fabric_Response) => {
        if (res.status == "success") {
          res.message = "Application completed successfully. You may now apply for any document. Your UIDAI number is " + this.uid;
          this.response = res
        }
        else {
          this.response = res
        }
      })
  }

  next() {
    this.router.navigateByUrl('dl/fetchData/' + this.uid)
  }
}
