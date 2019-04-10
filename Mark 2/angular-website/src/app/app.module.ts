import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

// import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { AadharBoolComponent } from './aadhar-bool/aadhar-bool.component';
import { BasicInfo1Component } from './basic-info1/basic-info1.component';
import { BasicInfo2Component } from './basic-info2/basic-info2.component';

@NgModule({
  declarations: [
    AppComponent,
    AadharBoolComponent,
    BasicInfo1Component,
    BasicInfo2Component
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,

    // HttpClientInMemoryWebApiModule.forRoot(
    //   InMemoryDataService, { dataEncapsulation: false }
  
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
