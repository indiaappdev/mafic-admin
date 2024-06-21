import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { SharedDataService } from '../shared/shared-data.service';
import { CookieService } from 'ngx-cookie-service';
declare var $: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  userName:string = '';
  passWord:string = '';
  remember:boolean = false;
  emailId:string = '';
  forgotData:any = [];

  loginSuccessData:any = [];
  constructor(private http: HttpClient,
              public router: Router,
              public datas:SharedDataService,
              private cookieService:CookieService) { }

  ngOnInit(): void {
    if(localStorage.loggedUserDataDashboardTwo == "true"){
      this.router.navigate(['/dashboard/']);
      this.datas.emailId = localStorage.loggedUserDataDashboardTwoMail;
      return;
    }
    if(this.cookieService.get('rememberD')  == "true"){
      this.userName = this.cookieService.get('userD')
      this.passWord = this.cookieService.get('passD')
      this.remember = true;
    }
  }

  logCheck(){
    
    if(this.userName == '' || this.passWord == ''){
      this.datas.firePopup(false,'Please enter all the fields');
      return;
    }
    
    this.datas.showLoader();
    
    var loginData = {
      emailId:this.userName,
      password:this.passWord
    }
    // this.loadingClass = 'loadBG d-block';
    this.http.post(''+this.datas.apiDomainPathDash+'login',loginData)
    .subscribe(data => {
      this.datas.hideLoader();
      console.log(data);
      this.loginSuccessData = data;
      if(this.loginSuccessData.responseCode == "200"){
        localStorage.loggedUserDataDashboardTwo = true;
        localStorage.loggedUserDataDashboardTwoMail = this.userName;
        this.datas.adminData = this.loginSuccessData.response.adminData[0];
        this.datas.moduleAccess = this.loginSuccessData.response.modulesAccess;
        localStorage.loggedUserDataDashboardTwoadmin = JSON.stringify(this.datas.adminData);
        localStorage.loggedUserDataDashboardTwoaccess = JSON.stringify(this.datas.moduleAccess);
        this.datas.emailId = this.userName;
        if(this.remember){
          this.cookieService.set('rememberD',String(this.remember));
          this.cookieService.set('userD',this.userName);
          this.cookieService.set('passD',this.passWord);
        } else{
          this.cookieService.set('userD','');
          this.cookieService.set('passD','');
          this.cookieService.set('rememberD','');
        }
        this.router.navigate(['/dashboard/']);
      }else if(this.loginSuccessData.responseCode == "805"){
        this.datas.firePopup(false,'Password Missmatch');
      }else if(this.loginSuccessData.responseCode == "804"){
        this.datas.firePopup(false,this.loginSuccessData.responseMsg);
      } else{
        this.datas.firePopup(false,'Something went wrong. Please contact your system admin.');
      }
    },
    err => {
        // Swal.fire('err.error.message');
    });
  }

  forgotPaswd(){

    if(this.emailId == ''){
      this.datas.firePopup(false,'Please enter your E-mail ID.');
      return;
    }
    this.datas.showLoader();
    var forgotData =  {
      emailId:this.emailId,
    }
    
    // this.data.loadingClass = 'loadBG d-block';
    this.http.post(''+this.datas.apiDomainPath+'forgetPassword',forgotData)
    .subscribe(data => {
      console.log(data);
      this.forgotData = data;
      this.datas.hideLoader();
      if(this.forgotData.responseCode == "200"){
        $("#forgot_pup").modal("hide");
        this.emailId = '';
        this.datas.firePopup(true,'Password sent to your E-mail ID.');
      } else{
        this.datas.firePopup(false,this.forgotData.responseMsg);
      }
    },
    err => {
      this.datas.firePopup(false,err.error.message);
    });
  }

}
