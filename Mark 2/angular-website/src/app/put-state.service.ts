import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { HttpClient } from '@angular/common/http'
import { Basic_Info_1, Fabric_Response } from '../assets/data_structures'
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
      this.http.get<any>('http://localhost:8000/api/uid/' + datastring)
        .subscribe((data: Fabric_Response) => {
          resolve(data)
        })
    });

  }
}