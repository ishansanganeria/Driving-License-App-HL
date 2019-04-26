import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { LicenseBase, UIDAIDetails, Fabric_Response, FileStatusInfo, OfficerInfo, Scores } from 'src/assets/data_structures';
import { ActivatedRoute } from '@angular/router';
import { GetStateService } from '../get-state.service';
import { PutStateService } from '../put-state.service';

@Component({
  selector: 'app-officer-dashboard',
  templateUrl: './officer-dashboard.component.html',
  styleUrls: ['./officer-dashboard.component.css']
})
export class OfficerDashboardComponent implements OnInit {

  formOfficer: FormGroup;
  formScore: FormGroup;

  officerData: OfficerInfo;

  tests: Scores[];

  nextApplication: string;
  message: string;
  userDataString: string;

  uid: string;
  scoretype: string;

  IsDataFetched: Boolean = false;
  canApplyButton: Boolean;
  canPayFineButton: Boolean;
  statusButton: Boolean;
  showStatus: Boolean = false;
  showTable: Boolean = false;
  showAddScore: Boolean = false;


  constructor(private putStateService: PutStateService, private getStateService: GetStateService) { }

  ngOnInit() {
    this.formOfficer = new FormGroup({
      offid: new FormControl('OFF', Validators.required)
    })
  }

  fetchOfficerDetails() {
    this.showTable = false;
    this.message = "PROCESSING ..."
    this.getStateService.fetchOfficerDetails(this.formOfficer.value.offid)
      .then((res: Fabric_Response) => {
        if (res.status == "failed") {
          this.message = res.message
        } else {
          this.officerData = JSON.parse(res.message);
          this.message = "";
          this.IsDataFetched = true;
        }
      })
  }

  fetchScoresToBeAdded() {
    this.showTable = false;
    this.message = "FETCHING LIST OF SCORES TO BE ADDED"
    console.log(this.officerData.rtoid);
    this.getStateService.fetchScoresToBeAdded(this.officerData.rtoid)
      .then((res: Fabric_Response) => {
        if (res.status == "failed") {
          this.message = res.message
        } else {
          this.tests = JSON.parse(res.message);
          this.showTable = true;
        }
      })
  }

  scoreForm(uid, scoretype) {
    this.uid = uid;
    this.scoretype = scoretype;
    this.formScore = new FormGroup({
      score: new FormControl('', Validators.required),
    })
    this.showAddScore = true;
  }

  addScore() {
    this.message = "ADDING SCORE"

    this.putStateService.addScore(this.uid, this.scoretype, this.formScore.value.score,this.officerData.id)
      .then((res: Fabric_Response) => {
        if (res.status == "failed") {
          this.message = "FAILED IN ADDING SCORE"
        } else {
          this.message = "Score added"
        }
      });
  }
}
