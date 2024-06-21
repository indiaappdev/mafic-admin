import { Component } from '@angular/core';
import { SharedDataService } from './shared/shared-data.service';
import { Router  } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'maficDashboard';
  storedUserData:any = [];
  currentRoute:any = [];
  constructor(public data:SharedDataService,private router:Router){}
  ngOnInit(): void {
    // if(localStorage.loggedUserDataAdmin == undefined || localStorage.loggedUserDataAdmin == '' || localStorage.loggedUserDataAdmin == '{}'){
    //   // console.log('dummy');
    // // this.router.navigate(['//']);
    //  } else{
    //    this.storedUserData = JSON.parse(localStorage.loggedUserDataAdmin);
    //    this.data.loggedUser(this.storedUserData);
    //  }
    // if(localStorage.loggedUserDataDashboardTwo == "false" || localStorage.loggedUserDataDashboardTwo == undefined){
    //   this.router.navigate(['/']);
    // }
    console.log( this.router.url);
    localStorage.loggedUserDataDashboardOne = ""
    if(localStorage.loggedUserDataDashboardTwo == "true"){
      this.router.navigate(['/dashboard/']);
      this.data.emailId = localStorage.loggedUserDataDashboardTwoMail;
      
      this.data.adminData = JSON.parse(localStorage.loggedUserDataDashboardTwoadmin);
      this.data.moduleAccess = JSON.parse(localStorage.loggedUserDataDashboardTwoaccess);
      return;
    } else {
      this.router.navigate(['//']);
    }

  }
}
