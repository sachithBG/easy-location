import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './app.meterial.module';
import { CommonModule, HashLocationStrategy, LocationStrategy } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { HomeComponent } from './home/home.component';
import { LocSelectComponent } from './component/loc-select/loc-select.component';
import { LocViewComponent } from './component/loc-view/loc-view.component';
import { AgmCoreModule } from '@agm/core';
import { NavComponent } from './nav/nav.component';
import { LoginComponent } from './access/login/login.component';
import { RegisterComponent } from './access/register/register.component';
import { EntryComponent } from './access/entry/entry.component';
import { SelectLocComponent } from './access/select-loc/select-loc.component';
import { TimeznPipe } from './pipe/timezn.pipe';
import { MsgBoxComponent } from './component/msg-box/msg-box.component';
import { UserService } from './service/user/user.service';
import { LocService } from './service/loc.service';
import { SharedService } from './service/shared.service';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LocSelectComponent,
    LocViewComponent,
    NavComponent,
    LoginComponent,
    RegisterComponent,
    EntryComponent,
    SelectLocComponent,
    TimeznPipe,
    MsgBoxComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    RouterModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDQ8YXyqQMk09_7t0JtrZVCBoVogHQyNIg',
      // apiKey: 'AIzaSyAFUGH1bTsfi9l8mt6jlo8FY6qsC6xijf8',
      libraries: ["places", "geometry"]
    })
  ],
  providers: [UserService, LocService, SharedService, { provide: LocationStrategy, useClass: HashLocationStrategy }],
  bootstrap: [AppComponent]
})
export class AppModule { }
