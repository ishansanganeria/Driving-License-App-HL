import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

// import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { AadharBoolComponent } from './aadhar-bool/aadhar-bool.component';
import { BasicInfo1Component } from './basic-info1/basic-info1.component';
import { BasicInfo2Component } from './basic-info2/basic-info2.component';
import { BasicInfo3Component } from './basic-info3/basic-info3.component';
import { FetchUidaiDataComponent } from './fetch-uidai-data/fetch-uidai-data.component';
import { AddRtoComponent } from './add-rto/add-rto.component';
import { AddOfficerComponent } from './add-officer/add-officer.component';

@NgModule({
  declarations: [
    AppComponent,
    AadharBoolComponent,
    BasicInfo1Component,
    BasicInfo2Component,
    BasicInfo3Component,
    FetchUidaiDataComponent,
    AddRtoComponent,
    AddOfficerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule

    // HttpClientInMemoryWebApiModule.forRoot(
    //   InMemoryDataService, { dataEncapsulation: false }
  
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
