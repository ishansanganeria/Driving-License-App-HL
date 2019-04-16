import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AadharBoolComponent } from './aadhar-bool/aadhar-bool.component';
import { BasicInfo1Component } from './basic-info1/basic-info1.component';
import { BasicInfo2Component } from './basic-info2/basic-info2.component';
import { BasicInfo3Component } from './basic-info3/basic-info3.component';
import { FetchUidaiDataComponent } from './fetch-uidai-data/fetch-uidai-data.component';
import { AddRtoComponent } from './add-rto/add-rto.component';
import { AddOfficerComponent } from './add-officer/add-officer.component';

const routes: Routes = [
  {
    path: '',
    component: AadharBoolComponent,
    pathMatch: 'full'
  },
  {
    path: 'uidai/part1',
    component: BasicInfo1Component
  },
  {
    path: 'uidai/part2/:uid',
    component: BasicInfo2Component
  },
  {
    path: 'uidai/part3/:uid',
    component: BasicInfo3Component
  },
  {
    path: 'dl/fetchData',
    component: FetchUidaiDataComponent
  },
  {
    path: 'dl/addRTO',
    component: AddRtoComponent
  },
  {
    path: 'dl/addOfficer',
    component: AddOfficerComponent
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
