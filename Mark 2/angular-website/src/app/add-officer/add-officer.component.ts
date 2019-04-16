import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Fabric_Response } from 'src/assets/data_structures';
import { Router } from '@angular/router';
import { PutStateService } from '../put-state.service';

@Component({
  selector: 'app-add-officer',
  templateUrl: './add-officer.component.html',
  styleUrls: ['./add-officer.component.css']
})
export class AddOfficerComponent implements OnInit {

  formChoice: FormGroup;
  form: FormGroup;
  hasAadhar: Boolean = false;
  submitButton: Boolean = false;
  response: Fabric_Response;


  constructor(private router: Router, private putStateService: PutStateService) {
    this.form = new FormGroup({
      uid: new FormControl('', Validators.required),
      rtoid: new FormControl('', Validators.required),
    });
    this.formChoice = new FormGroup({
      choice: new FormControl('', Validators.required),
    })

  }

  ngOnInit() {
  }

  aadharChoice(){
    if (this.formChoice.value.choice == "no") {
      this.router.navigateByUrl('/uidai/part1')
    }
    else {
      this.hasAadhar = true;
    }
  }

  addOfficer(){
    this.submitButton = true;
    this.response = { status: "Processing", message: "PROCESSING SUBMISSION..." }

    this.putStateService.addOfficer(this.form.value.uid, this.form.value.rtoid)
      .then((res: Fabric_Response) => {
        this.response = res;
        if (res.status == "failed") {
          this.submitButton = false;
        } 
      });
  }
}
