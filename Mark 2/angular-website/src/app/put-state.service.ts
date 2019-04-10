import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { HttpClient } from '@angular/common/http'
import { Basic_Info_1     } from '../assets/Basic_Info_1'

@Injectable({
  providedIn: 'root'
})
export class PutStateService {

  constructor(private http: HttpClient) { }

  createUIDAI(data : Basic_Info_1): any {
    let datastring = JSON.stringify(data)
    this.http.get<any>('http://localhost:8000/api/uid/'+ datastring)
      .subscribe((data) => {
        console.log('Server Responded with ' + JSON.stringify(data));
      });
  }
}