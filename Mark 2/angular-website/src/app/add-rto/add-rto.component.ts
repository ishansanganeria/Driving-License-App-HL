import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Fabric_Response } from 'src/assets/data_structures';
import { PutStateService } from '../put-state.service';

@Component({
  selector: 'app-add-rto',
  templateUrl: './add-rto.component.html',
  styleUrls: ['./add-rto.component.css']
})
export class AddRtoComponent implements OnInit {

  form: FormGroup;
  submitButton: Boolean = false;
  response: Fabric_Response;


  constructor(private putStateService: PutStateService) {  }

  ngOnInit() {
    this.form = new FormGroup({
      addressline1: new FormControl('', Validators.required),
      addressline2: new FormControl('', Validators.required),
      city: new FormControl('', Validators.required),
      pincode: new FormControl('', Validators.required),
      state: new FormControl('', Validators.required),
      contactno: new FormControl('', Validators.required),
    })
    this.response;
  }

  fillRto() {
    this.submitButton = false;
    this.response = { status: "Processing", message: "PROCESSING SUBMISSION..." }

    this.putStateService.addRto(this.form.value)
      .then((res: Fabric_Response) => {
        this.response = res;
        if (res.status == "failed") {
          this.submitButton = false;
        } else {

        }

      });
  }
}
