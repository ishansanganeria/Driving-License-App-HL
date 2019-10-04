import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Route } from '@angular/compiler/src/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-register',
  templateUrl: './login-register.component.html',
  styleUrls: ['./login-register.component.css']
})
export class LoginRegisterComponent implements OnInit {

  form: FormGroup;
  constructor(private router: Router) { }

  ngOnInit() {
    this.form = new FormGroup({
      choice: new FormControl('', Validators.required),
    });
  }

  p() {
    if (this.form.value.choice == "register") {
      this.router.navigateByUrl('/dl/aadharBool')
    } else if(this.form.value.choice == "login") {
      this.router.navigateByUrl('/dl/askUserOfficer')
    } else if(this.form.value.choice == "rto") {
      this.router.navigateByUrl('dl/addRTO')
    } else if(this.form.value.choice == "officer") {
      this.router.navigateByUrl('dl/addOfficer')
    }
  }
}
