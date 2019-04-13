import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AadharBoolComponent } from './aadhar-bool/aadhar-bool.component';
import { BasicInfo1Component } from './basic-info1/basic-info1.component';
import { BasicInfo2Component } from './basic-info2/basic-info2.component';

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
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
