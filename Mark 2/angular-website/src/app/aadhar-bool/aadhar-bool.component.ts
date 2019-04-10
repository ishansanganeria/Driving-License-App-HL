import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup,  Validators } from '@angular/forms'

@Component({
  selector: 'app-aadhar-bool',
  templateUrl: './aadhar-bool.component.html',
  styleUrls: ['./aadhar-bool.component.css']
})
export class AadharBoolComponent implements OnInit{
  
  form = new FormGroup({
    choice: new FormControl('',Validators.required),
  });

  ngOnInit(){
  }

  p(){
    console.log(this.form.controls['choice'].value)
  }
}
