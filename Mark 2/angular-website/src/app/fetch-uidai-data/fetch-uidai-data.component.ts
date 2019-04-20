import { Component, OnInit } from '@angular/core';
import { GetStateService } from '../get-state.service'
import { Fabric_Response, UIDAIDetails, Fabric_Response_UIDAIDetails, LicenseBase } from 'src/assets/data_structures';
import { async, delay } from 'q';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
	selector: 'app-fetch-uidai-data',
	templateUrl: './fetch-uidai-data.component.html',
	styleUrls: ['./fetch-uidai-data.component.css']
})
export class FetchUidaiDataComponent implements OnInit {

	uid: string;
	message: string;
	userData: LicenseBase;
	userDataString: string;
	uidData: UIDAIDetails;
	fetchDataButtonDisabled: Boolean = false;
	IsFailed: Boolean = false;
	IsSuccess: Boolean = false;
	constructor(private getStateService: GetStateService, private activatedRoute: ActivatedRoute) { }

	ngOnInit() {
		this.activatedRoute.params
			.subscribe(event => {
				this.uid = event.uid;
				this.fetchData();
			});
	}

	async fetchData() {
		this.message = "PROCESSING DATA..."
		this.fetchDataButtonDisabled = true
		this.IsFailed = false;

		await this.getStateService.checkIfHaveData(this.uid)
			.then(async (res: Fabric_Response) => {
				if (res.status == "failed") {
					this.IsFailed = true;
					this.message = "User already registered"
				} else {
					console.log("success");
				}
			}).then(async () => {

				if (!this.IsFailed) {
					console.log("not working");
					await this.getStateService.fetchUidaiDataToCommon(this.uid)
						.then(async (res: Fabric_Response) => {
							// console.log("fetchUidaiDataToCommon" + JSON.stringify(res));
							if (res.status == "failed") {
								this.message = res.message
								this.fetchDataButtonDisabled = false
								this.IsFailed = true;
							}
							else if (res.status == "success") {
								this.getStateService.fetchUidaiDataFromCommon(this.uid)
									.then(async (res: Fabric_Response) => {
										await this.delay(5000);
										// console.log("fetchUidaiDataFromCommon" + JSON.stringify(res));
										this.getStateService.fetchUidaiDataFromDl(this.uid)
											.then((res: Fabric_Response_UIDAIDetails) => {
												this.IsSuccess = true
												this.userData = JSON.parse(res.message);
												this.userDataString = JSON.stringify(this.userData)
												this.uidData = this.userData.uidaidata;
											})
									})
							}
						})
				}
			})
	}

	delay(ms: number) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}
}
