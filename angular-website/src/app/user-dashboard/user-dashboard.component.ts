import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LicenseBase, UIDAIDetails, Fabric_Response, FileStatusInfo, TicketInfo } from 'src/assets/data_structures';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { GetStateService } from '../get-state.service';
import { PutStateService } from '../put-state.service';
import { delay } from 'q';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit {

  formUid: FormGroup;

  userData: LicenseBase;

  statuses: FileStatusInfo[];

  tickets: TicketInfo[];

  nextApplication: string;
  message: string;
  userDataString: string;

  IsDataFetched: Boolean = false;
  canApplyButton: Boolean;
  statusButton: Boolean;
  showStatus: Boolean = false;
  ticketsButton: Boolean = false;
  showTickets: Boolean = false;

  i: number;
  j: number;


  constructor(private putStateService: PutStateService, private getStateService: GetStateService) { }

  ngOnInit() {
    this.formUid = new FormGroup({
      uid: new FormControl('', Validators.required)
    })
  }

  fetchUserDetails() {

    this.showTickets = false;
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
            this.ticketsButton = false;
          } else if (true) {
            this.ticketsButton = true;
          }
          this.IsDataFetched = true

          this.userDataString = JSON.stringify(this.userData)
        }
        this.message = ""

      })
  }


  ReturnStatus() {
    this.statusButton = false;
    this.showTickets = false;

    // console.log(this.formUid.value.currentfile);
    this.getStateService.ReturnStatus(this.formUid.value.uid, this.userData.currentfile)
      .then((res: Fabric_Response) => {
        this.statuses = JSON.parse(res.message);
        this.showStatus = true;
      })
  }

  ShowTickets() {
    this.ticketsButton = false;
    for (this.i = 0; ; this.i++) {
      if (this.userData.licensedata[this.i].licensenumber == this.userData.activelicense) {
        this.tickets = this.userData.licensedata[this.i].tickets
        break
      }
    }
    this.showTickets = true;
  }

  payFine(ticketid) {
    this.message = "PAYING FINE..."
    this.ticketsButton = false;

    this.putStateService.payFine(this.userData.id, ticketid)
      .then((res: Fabric_Response) => {
        if (res.status == "failed") {
          this.message = "FAILED IN PAYING FINE"
        } else {
          this.message = "Fine Paid"
          for (this.i = 0; ; this.i++) {
            if (this.userData.licensedata[this.i].licensenumber == this.userData.activelicense) {
              for (this.j = 0; ; this.j++) {
                if (this.userData.licensedata[this.i].tickets[this.j].ticketid == ticketid) {
                  this.userData.licensedata[this.i].tickets[this.j].ispaid = "true"
                }
                break
              }
            }
            break
          }
        }
        this.ticketsButton = true;
      })
      .then((resolve) => {
        delay(2000);
      })
      .then(() => {
        this.fetchUserDetails();
      });

  }

}
