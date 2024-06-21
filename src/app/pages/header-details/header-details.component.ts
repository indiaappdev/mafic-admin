import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SharedDataService } from 'src/app/shared/shared-data.service';

@Component({
  selector: 'app-header-details',
  templateUrl: './header-details.component.html',
  styleUrls: ['./header-details.component.css']
})
export class HeaderDetailsComponent implements OnInit {

  headerDetails:any=[];

  phone = new FormControl('', [Validators.required]);
  email = new FormControl('', [Validators.required]);

  public headerForm: FormGroup = new FormGroup({
    phone:this.phone,
    email: this.email
  });

  constructor(private http: HttpClient, private router:Router,
    public data:SharedDataService) {}

  ngOnInit(): void {
    this.getData();
    this.data.checkAccess('survey');
  }

  getData(){
    this.http.get(''+this.data.apiDomainPathDash+'getHeaderDetails') // Get privacy details
    .subscribe(data => {
      console.log(data);
      this.data.hideLoader();
      
      this.headerDetails = data;
      this.headerDetails = this.headerDetails.response[0];

      this.phone.reset(this.headerDetails.mobileNo);
      this.email.reset(this.headerDetails.emailId);
    },
    err => {
      // Swal.fire(err);
    });
  }

  validateFormFields() {
    if (this.phone.hasError('required') || this.email.hasError('required')) {
      return 'Mandatory field';
    } else
    return '';
  }

 

  uplodInfo:any =[];
  headerSection(){
    var uploadData;
      uploadData = new FormData();
      uploadData.append('mobileNo', this.phone.value);
      uploadData.append('emailId', this.email.value);
    this.data.showLoader();
    this.http.post(''+this.data.apiDomainPathDash+'editHeaderDetails',uploadData) // Set privacy details
    .subscribe(data => {
      console.log(data);
      this.uplodInfo = data;
      this.data.hideLoader();
      this.getData();
      if(this.uplodInfo.responseCode == "200"){
        this.data.firePopup(true,'Data Updated');
      } else if(this.uplodInfo.responseCode == 803) {
        this.data.firePopup(false,'Something went wrong..!!!');
      }else {
        this.data.firePopup(false,this.uplodInfo.responseMsg);
      }
    },
    err => {
      // Swal.fire(err);
    });
  }
}

