import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { GlobalErrorHandler } from 'global-error-handler';
import { MatSliderModule } from '@angular/material/slider';
import { NgxImageZoomModule } from 'ngx-image-zoom';
import {MatCheckboxModule} from '@angular/material/checkbox';

import { ReactiveFormsModule } from '@angular/forms';
import {NgSelectizeModule } from 'ng-selectize';
import { CommonModule } from '@angular/common';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { MatDialogModule } from '@angular/material/dialog';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { AdminLayoutComponent } from './layout/admin-layout/admin-layout.component';
import { HeaderComponent } from './common/header/header.component';
import { SidebarModule } from './common/sidebar/sidebar.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CookieService } from 'ngx-cookie-service';
import { AuthGuard } from './services/auth.guard';
const ErrorHandler = new GlobalErrorHandler();

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LoginComponent,
    AdminLayoutComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    MatCheckboxModule,
    FormsModule,
    SidebarModule,
    NgSelectizeModule,
    CommonModule,
    MatSliderModule,
    MatDialogModule,
    HttpClientModule,
    NgxImageZoomModule,
    NgxDaterangepickerMd.forRoot(),
    RouterModule.forRoot([
      { path: '', component: LoginComponent },
      {
        path: '',
        component: AdminLayoutComponent,
        children: [
            { path: '', loadChildren: () => import('./layout/admin-layout/admin-layout.module').then(m => m.AdminLayoutModule),canActivate: [AuthGuard] }
          ]}
    ]),
    BrowserAnimationsModule,
  ],
  providers: [
    {
      provide: ErrorHandler, 
      useClass: GlobalErrorHandler
    },CookieService
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
