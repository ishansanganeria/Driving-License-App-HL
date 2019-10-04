import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router'

@Component({
  selector: 'app-aadhar-bool',
  templateUrl: './aadhar-bool.component.html',
  styleUrls: ['./aadhar-bool.component.css']
})
export class AadharBoolComponent implements OnInit {

  formChoice: FormGroup;
  formUid: FormGroup;

  constructor(private router: Router) { }

  ngOnInit() {
    this.formChoice = new FormGroup({
      choice: new FormControl('', Validators.required),
    });
    this.formUid = new FormGroup({
      uid: new FormControl('', Validators.required),
    });
  }

  p() {
    if (this.formChoice.controls['choice'].value == 'no') {
      this.router.navigateByUrl('/uidai/part1')
    }
    else {
      console.log(this.formUid.controls['uid'].value);
      this.router.navigateByUrl('/dl/fetchData/' + this.formUid.controls['uid'].value)
    }
  }
}
