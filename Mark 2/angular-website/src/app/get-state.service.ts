import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { UIDAIDetails, Fabric_Response } from '../assets/data_structures'
import { reject } from 'q';


@Injectable({
  providedIn: 'root'
})
export class GetStateService {

  constructor(private http: HttpClient) { }

  fetchUidaiData(uid: any): Promise<any> {
    uid = uid.toString();
    return new Promise((resolve,reject) => {
      this.http.get<UIDAIDetails>('http://localhost:8000/api/uidai/fetchData/' + uid)
        .subscribe((data: UIDAIDetails) => {
          if (data.isactive != "true") {
            resolve("This Aadhar card doesn't exist")
          }
          else {
            resolve(data)
          }
        });
    });
  }
}
