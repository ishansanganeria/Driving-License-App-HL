import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup,  Validators } from '@angular/forms'
import { Router } from '@angular/router'

@Component({
  selector: 'app-aadhar-bool',
  templateUrl: './aadhar-bool.component.html',
  styleUrls: ['./aadhar-bool.component.css']
})
export class AadharBoolComponent implements OnInit{

  constructor (private router: Router) {}
  form = new FormGroup({
    choice: new FormControl('',Validators.required),
  });

  ngOnInit(){
  }

  p(){
    if(this.form.controls['choice'].value == 'no') {
      this.router.navigateByUrl('/uidai/part1')
    }
    else {
      
    }
  }
}
