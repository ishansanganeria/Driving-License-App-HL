import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ask-user-officer',
  templateUrl: './ask-user-officer.component.html',
  styleUrls: ['./ask-user-officer.component.css']
})
export class AskUserOfficerComponent implements OnInit {
  
  form: FormGroup;
  constructor(private router: Router) { }

  ngOnInit() {
    this.form = new FormGroup({
      choice: new FormControl('', Validators.required),
    });
  }

  p() {
    if (this.form.value.choice == "user") {
      this.router.navigateByUrl('/dl/user')
    } else {
      this.router.navigateByUrl('/dl/officer')
    }
  }
}
