import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LicenseBase, UIDAIDetails, Fabric_Response, FileStatusInfo } from 'src/assets/data_structures';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { GetStateService } from '../get-state.service';


@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit {

  formUid: FormGroup;

  userData: LicenseBase;

  statuses: FileStatusInfo[];

  nextApplication: string;
  message: string;
  userDataString: string;

  IsDataFetched: Boolean = false;
  canApplyButton: Boolean;
  canPayFineButton: Boolean;
  statusButton: Boolean;
  showStatus: Boolean = false;
  

  constructor(private activatedRoute: ActivatedRoute, private getStateService: GetStateService) { }

  ngOnInit() {
    this.formUid = new FormGroup({
      uid: new FormControl('', Validators.required)
    })
  }

  fetchUserDetails() {

    this.message = "PROCESSING ..."

    this.getStateService.fetchUidaiDataFromDl(this.formUid.value.uid)
      .then((res: Fabric_Response) => {
        if (res.status == "failed") {
          this.message = res.message
        } else {
          this.userData = JSON.parse(res.message)
          if (this.userData.nextprocess != "nil") {
            this.canApplyButton = true;
          } else {
            this.canApplyButton = false;
          }

          if (this.userData.currentfile == "") {
            this.statusButton = false;
          } else if (true) {
            this.statusButton = true;
          }

          if (this.userData.activelicense == "") {
            this.canPayFineButton = false;
          } else if (true) {
            this.canPayFineButton = true;
          }
          this.IsDataFetched = true

          this.userDataString = JSON.stringify(this.userData)
        }
      })
  }

  ReturnStatus(){
    this.statusButton = false;
    console.log(this.formUid.value.currentfile);
    this.getStateService.ReturnStatus(this.formUid.value.uid, this.userData.currentfile)
      .then((res: Fabric_Response) => {
        this.statuses = JSON.parse(res.message);
        this.showStatus = true;
      })
  }
}
