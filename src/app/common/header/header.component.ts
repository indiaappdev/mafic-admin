import { Component, OnInit } from '@angular/core';
import { SharedDataService } from '../../shared/shared-data.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
declare var $: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  searchVal:string = '';
  knownComponents = ['user','dashboard','events','contest'];
  oldPass:string='';
  newPass:string='';
  cnfrmPass:string='';

  changePassword:any =[];

  constructor(public data:SharedDataService, public router:Router, private http:HttpClient){
  }

  ngOnInit(): void {
  }

  globalSearch(){
    var displayed = false;
    this.searchVal = this.searchVal.toLowerCase();
    const srchArray = this.searchVal.split(" ");

    srchArray.forEach((sElem: any) => {
      if(!displayed)
      // sElem = sElem.replace(sElem, ""+ sElem+" d-block");
      for(let ind = 0;ind<this.knownComponents.length;ind++){
        if(this.knownComponents[ind].toLowerCase().includes(sElem.trim())){
          displayed = true;
          if(ind == 0){
            this.router.navigate(['/user'])
          } else{
            this.router.navigate(['/'+sElem.trim()+'']);
            return
          }
        }
      }
    });
  }

  chngPswd(){

    if(this.oldPass == '' || this.cnfrmPass == '' || this.newPass == ''){
      this.data.firePopup(false,'Please enter all the fields');
      return;
    }

    if(this.cnfrmPass != this.newPass){
      this.data.firePopup(false,'Password is not matching');
      return;
    }
    this.data.showLoader();
    var cpData = { // Storing email and passwords for change password
      "emailId":this.data.emailId,
      "oldPassword":this.oldPass,
      "password":this.newPass
    }

    this.http.post(''+this.data.apiDomainPath+'changePassword',cpData) // Post call for changing the password
    .subscribe(data => {
      console.log(data);
      this.changePassword = data;
      this.data.hideLoader();
      if(this.changePassword.responseCode == 200){
        this.oldPass= '';
        this.newPass = '';
        this.cnfrmPass = '';
        this.data.firePopup(true,'The pasword has been changed');
        $("#chngPass_pup").modal("hide");
      } else if(this.changePassword.responseCode == 805){
        this.data.firePopup(false,"Current passowrd dosen't match");
      } else {
        this.data.firePopup(false,this.changePassword.responseMsg);
      }
    },
    err => {
      this.data.firePopup(false,this.changePassword.responseMsg);
    });
  }

}
