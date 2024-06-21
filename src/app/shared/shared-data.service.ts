import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {

  loginFlag :boolean = true;
  apiDomainPath:string = 'https://demoonline.xyz/api/Mafic/';
  apiDomainPathDash:string = 'https://demoonline.xyz/api/MaficDashboard/';
  loggedUserData:any;
  dummyProfilePic:string = '../../assets/images/blank-profile-picture.png'
  profileUrl:string = '';
  firstName:string = '';
  lastName:string = '';
  emailId:string;
  adminData:any = [];
  moduleAccess:any = [];
  writeDisable:boolean = false;
  readDisable:boolean = false;
  deleteDisable:boolean = false;
  editDisable:boolean = false;
  
  loadingClass = 'loadBG d-none';

  collapse:boolean = false;

  popupClass:string = 'overlay d-none';
  popupState:boolean = false;
  popupText:string ='';

  confirmCLass =  'overlay d-none'

  sideBar:string ='d-block';
  hideSidebarClass:string ='';

  constructor(private router:Router) { }

  showLoader(){
    this.loadingClass = 'loadBG d-block';
  }

  hideLoader(){
    this.loadingClass = 'loadBG d-none';
  }

  firePopup(state:boolean,text:string){
    this.popupState = state;
    this.popupText = text;
    this.popupClass ='overlay d-block cut_pup';
  } 

  signOutCheck(){
    this.confirmCLass = 'overlay d-block'
  }

  signOutAll(): void {
    this.confirmCLass = 'overlay d-none';
    // localStorage.loggedUserDataCommunity = {};
    
    localStorage.loggedUserDataDashboardTwo = false;
    this.loginFlag = false;  
    this.router.navigate(['//'])
    this.firePopup(true,'You have been logged out');
  }

  loggedUser(data:any){
    localStorage.loggedUserDataAdmin = JSON.stringify(data);
    if(localStorage.loggedUserDataAdmin != '{}'){
      this.loggedUserData = data;
      this.storeUserData(this.loggedUserData);
    }
    console.log(data);
  }

  storeUserData(refreshData:any){
    this.loginFlag = true;
    this.profileUrl = refreshData.profileUrl;
    this.firstName = refreshData.firstName;
    this.lastName = refreshData.lastName;
    this.emailId = refreshData.emailId;
    this.moduleAccess = refreshData.moduleAccess;
    if(this.profileUrl == null)
      this.profileUrl = this.dummyProfilePic;
  }

  showHideSide(){
    if(this.sideBar == 'd-block'){
      this.sideBar = 'd-none';
      this.hideSidebarClass = 'hideSidebarClass';
    }
    else{
      this.sideBar = 'd-block';
      this.hideSidebarClass = '';
    }
  }

  fireClose(){
    this.popupClass ='overlay d-none';
    this.confirmCLass = 'overlay d-none';
  }

  checkAccess(accesser:string){
    for (let index = 0; index < this.moduleAccess.length; index++) { //check acces
      if(this.moduleAccess[index].moduleName == accesser) {
        if(this.moduleAccess[index].writeAccess == '0')
          this.writeDisable = true;
        else
          this.writeDisable = false;

        if(this.moduleAccess[index].deleteAccess == '0')
          this.deleteDisable = true;
        else
          this.deleteDisable = false;
          
        if(this.moduleAccess[index].editAccess == '0')
          this.editDisable = true;
        else
          this.editDisable = false;
      }
    }
  }

  denieAccess(){
    this.firePopup(false,'Access Denied');
  }

  getRandomColor() {
    let letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
}
