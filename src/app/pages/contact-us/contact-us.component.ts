import { Component, OnInit, Inject  } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { SharedDataService } from 'src/app/shared/shared-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css']
})

export class ContactUsComponent implements OnInit {
  selectedFile:any=[];
  contactDetails:any=[];

  text = new FormControl('', [Validators.required]);
  mobileNo = new FormControl('', [Validators.required]);
  emailId = new FormControl('', [Validators.required]);
  address = new FormControl('', [Validators.required]);

  formFilled:boolean = false;

  public addUserForm: FormGroup = new FormGroup({
    text: this.text,
    mobileNo: this.mobileNo,
    emailId: this.emailId,
    address: this.address,
  });

  constructor(private http: HttpClient,public data:SharedDataService) {}

  ngOnInit(): void {
    this.data.hideLoader();
    this.getContactUs();
    this.data.checkAccess('survey');
  }

  getContactUs(){
    this.http.post(''+this.data.apiDomainPathDash+'getContactUs',{}) // Get user details
    .subscribe(data => {
      console.log(data);
      this.data.hideLoader();
      
      this.contactDetails = data;
      this.contactDetails = this.contactDetails.response[0];

      this.text.reset(this.contactDetails.header);
      this.mobileNo.reset(this.contactDetails.mobileNo);
      this.emailId.reset(this.contactDetails.emailId);
      this.address.reset(this.contactDetails.address);
    },
    err => {
      // Swal.fire(err);
    });
  }

  validateFormFields() {
    if (this.text.hasError('required') || this.mobileNo.hasError('required') || this.emailId.hasError('required') || this.address.hasError('required') ) {
      return 'Mandatory field';
    } else
    return '';
  }

  
  
  uplodInfo:any = [];
  updateContactUs(){
      var uploadData;
      uploadData = new FormData();
      uploadData.append('header', this.text.value);
      uploadData.append('mobileNo', this.mobileNo.value);
      uploadData.append('emailId', this.emailId.value);
      uploadData.append('address', this.address.value);
      this.data.showLoader();
      this.http.post(''+this.data.apiDomainPathDash+'contactUs',uploadData) // Get user details
      .subscribe(data => {
        console.log(data);
        this.uplodInfo = data;
        if(this.uplodInfo.responseCode == "200"){
          this.data.firePopup(true,'Data Updated');
          this.getContactUs();
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

