import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { LicenseBase, UIDAIDetails, Fabric_Response, FileStatusInfo } from 'src/assets/data_structures';
import { ActivatedRoute } from '@angular/router';
import { GetStateService } from '../get-state.service';

@Component({
  selector: 'app-officer-dashboard',
  templateUrl: './officer-dashboard.component.html',
  styleUrls: ['./officer-dashboard.component.css']
})
export class OfficerDashboardComponent implements OnInit {


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
      offid: new FormControl('', Validators.required)
    })
  }

  fetchUserDetails() {

    this.message = "PROCESSING ..."

    this.getStateService.fetchUidaiDataFromDl(this.formUid.value.offid)
      .then((res: Fabric_Response) => {
        if (res.status == "failed") {
          this.message = res.message
        } else {
        }
      })
  }


}
