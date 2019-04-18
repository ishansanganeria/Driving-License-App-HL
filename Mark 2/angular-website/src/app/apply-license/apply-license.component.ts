import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LicenseBase, UIDAIDetails } from 'src/assets/data_structures';

@Component({
  selector: 'app-apply-license',
  templateUrl: './apply-license.component.html',
  styleUrls: ['./apply-license.component.css']
})
export class ApplyLicenseComponent implements OnInit {

  userData: LicenseBase;

  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.activatedRoute.params
      .subscribe(event => {
        console.log(event.userData);
        this.userData = JSON.parse(event.userData);
      });
  }

  
}
