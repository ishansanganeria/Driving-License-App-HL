import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AadharBoolComponent } from './aadhar-bool/aadhar-bool.component';
import { BasicInfo1Component } from './basic-info1/basic-info1.component';
import { BasicInfo2Component } from './basic-info2/basic-info2.component';
import { BasicInfo3Component } from './basic-info3/basic-info3.component';
import { FetchUidaiDataComponent } from './fetch-uidai-data/fetch-uidai-data.component';
import { AddRtoComponent } from './add-rto/add-rto.component';
import { AddOfficerComponent } from './add-officer/add-officer.component';
import { AddVehicleComponent } from './add-vehicle/add-vehicle.component';
import { ApplyLicenseComponent } from './apply-license/apply-license.component';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { OfficerDashboardComponent } from './officer-dashboard/officer-dashboard.component';
import { LoginRegisterComponent } from './login-register/login-register.component';
import { AskUserOfficerComponent } from './ask-user-officer/ask-user-officer.component';

const routes: Routes = [
  {
    path: '',
    component: LoginRegisterComponent,
  },
  {
    path: 'dl/aadharBool',
    component: AadharBoolComponent,
    pathMatch: 'full'
  },
  {
    path: 'dl/askUserOfficer',
    component: AskUserOfficerComponent,
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
    path: 'dl/fetchData/:uid',
    component: FetchUidaiDataComponent,
    pathMatch: 'full'
  },
  {
    path: 'dl/addRTO',
    component: AddRtoComponent
  },
  {
    path: 'dl/addOfficer',
    component: AddOfficerComponent
  },
  {
    path: 'dl/addVehicles',
    component: AddVehicleComponent
  },
  {
    path: 'dl/user',
    component: UserDashboardComponent
  },
  {
    path: 'dl/user/applyLicense/:userData',
    component: ApplyLicenseComponent
  },
  {
    path: 'dl/officer',
    component: OfficerDashboardComponent
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
