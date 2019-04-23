import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { UIDAIDetails, Fabric_Response, Fabric_Response_UIDAIDetails } from '../assets/data_structures'
import { reject } from 'q';


@Injectable({
  providedIn: 'root'
})
export class GetStateService {

  constructor(private http: HttpClient) { }

  async fetchUidaiDataToCommon(uid: any): Promise<Fabric_Response> {
    uid = uid.toString();
    return new Promise((resolve, reject) => {
      this.http.get<Fabric_Response>('http://localhost:8000/api/uidai/fetchData/' + uid)
        .subscribe((data: Fabric_Response) => { 
          resolve(data)
        },
        (error) => {
          console.log(error);
        });
    });
  }

  fetchUidaiDataFromCommon(uid: any): Promise<Fabric_Response> {
    uid = uid.toString();
    return new Promise((resolve, reject) => {
      this.http.get<Fabric_Response>('http://localhost:8000/api/dl/fetchdataPart1/' + uid)
        .subscribe((data: Fabric_Response) => {
          resolve(data);
        })
    })
  }

  fetchUidaiDataFromDl(uid: any): Promise<Fabric_Response_UIDAIDetails> {
    uid = uid.toString();
    return new Promise((resolve, reject) => {
      this.http.get<Fabric_Response_UIDAIDetails>('http://localhost:8000/api/dl/fetchdataPart2/' + uid)
        .subscribe((data: Fabric_Response_UIDAIDetails) => {
          resolve(data);
        })
    })
  }

  ReturnStatus(uid: any, filenumber: any): Promise<Fabric_Response_UIDAIDetails> {
    uid = uid.toString();
    filenumber = filenumber.toString();

    return new Promise((resolve, reject) => {
      this.http.get<Fabric_Response_UIDAIDetails>('http://localhost:8000/api/dl/fetchStatus/' + uid + '/' + filenumber)
        .subscribe((data: Fabric_Response_UIDAIDetails) => {
          resolve(data);
        })
    })
  }

  async checkIfHaveData(uid: any): Promise<Fabric_Response> {
    uid = uid.toString();
    return new Promise((resolve, reject) => {
      this.http.get<Fabric_Response>('http://localhost:8000/api/dl/checkIfHaveData/' + uid)
        .subscribe((data: Fabric_Response) => { 
          resolve(data)
        },
        (error) => {
          console.log(error);
        });
    });
  }
}
