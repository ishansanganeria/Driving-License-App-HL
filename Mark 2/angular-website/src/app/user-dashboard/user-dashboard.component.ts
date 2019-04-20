import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LicenseBase, UIDAIDetails } from 'src/assets/data_structures';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit {

  userData: LicenseBase;
  canApplyButton: Boolean;
  nextApplication: string;
  canPayFineButton: Boolean;

  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.activatedRoute.params
      .subscribe(event => {
        this.userData = JSON.parse(event.userData);
        console.log(this.userData);

        if (this.userData.nextprocess != "nil") {
          this.canApplyButton = true;
        } else {
          this.canApplyButton = false;
        }

        if (this.userData.activelicense == "") {
          this.canPayFineButton = false;
        } else if (true) {
          this.canPayFineButton = true;
        }

      });
  }
}
