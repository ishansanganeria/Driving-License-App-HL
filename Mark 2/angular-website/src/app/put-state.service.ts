import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { HttpClient } from '@angular/common/http'
import { Basic_Info_1, Basic_Info_2, Fabric_Response } from '../assets/data_structures'
import { resolve } from 'url';
import { reject } from 'q';

@Injectable({
  providedIn: 'root'
})
export class PutStateService {

  constructor(private http: HttpClient) { }

  createUIDAI(data: Basic_Info_1): Promise<Fabric_Response> {
    let datastring = JSON.stringify(data)
    return new Promise((resolve,reject) => {
      this.http.get<any>('http://localhost:8000/api/uidai/part1/' + datastring)
        .subscribe((data: Fabric_Response) => {
          resolve(data)
        })
    });
  }

  createUIDAI2(uid: number, data: Basic_Info_2): Promise<Fabric_Response> {
    let datastring = JSON.stringify(data)
    let uidString = uid.toString();
    return new Promise((resolve,reject) => {
      this.http.get<any>('http://localhost:8000/api/uidai/part2/'+ uid + "/"+ datastring)
        .subscribe((data: Fabric_Response) => {
          resolve(data)
        })
    });
  }
}