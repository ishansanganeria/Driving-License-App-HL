import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LicenseBase, UIDAIDetails, Fabric_Response } from 'src/assets/data_structures';
import { PutStateService } from '../put-state.service';

@Component({
  selector: 'app-apply-license',
  templateUrl: './apply-license.component.html',
  styleUrls: ['./apply-license.component.css']
})
export class ApplyLicenseComponent implements OnInit {

  userData: LicenseBase;
  canApplyButton: Boolean;
  hasApplied: Boolean = true;
  nextApplication: string;
  response: Fabric_Response;


  constructor(private activatedRoute: ActivatedRoute, private putStateService: PutStateService) { }

  ngOnInit() {
    this.activatedRoute.params
      .subscribe(event => {
        this.userData = JSON.parse(event.userData);

        if (this.userData.nextprocess != "nil") {
          this.canApplyButton = true;
        } else {
          this.canApplyButton = false;
        }

        this.hasApplied = false;
      });
      this.applyForLicense();
  }

  applyForLicense() {
    this.canApplyButton = false;
    this.response = { status: "Processing", message: "PROCESSING SUBMISSION..." }

    this.putStateService.applyLicense(this.userData.id)
    .then((res: Fabric_Response) => {
      this.response = res
      this.hasApplied = true;
      if (res.status === "success") {

      }
    });

  }
}
