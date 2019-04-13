import { Component, OnInit } from '@angular/core';
import { GetStateService } from '../get-state.service'

@Component({
  selector: 'app-fetch-uidai-data',
  templateUrl: './fetch-uidai-data.component.html',
  styleUrls: ['./fetch-uidai-data.component.css']
})
export class FetchUidaiDataComponent implements OnInit {

  uid: number;
  constructor(private getStateService: GetStateService) { }

  ngOnInit() {
  }

  fetchData() {
    this.getStateService.fetchUidaiData(this.uid)
      .then(() => {
        console.log("here");
      })
  }
}
