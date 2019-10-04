import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-vehicle',
  templateUrl: './add-vehicle.component.html',
  styleUrls: ['./add-vehicle.component.css']
})
export class AddVehicleComponent implements OnInit {

  noVehicles: FormControl;
  vehicles: number[];
  start: Boolean;

  constructor() {
    this.noVehicles = new FormControl('', Validators.required)
    this.start = false
  }

  ngOnInit() {
  }

  initializeArray() {
    for (let index = 0; index < this.noVehicles.value; index++) {
      this.vehicles[index] = index;
    }
    this.start = true;
  }
}
