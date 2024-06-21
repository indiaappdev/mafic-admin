import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SharedDataService } from 'src/app/shared/shared-data.service';

@Component({
  selector: 'app-consent-of-data',
  templateUrl: './consent-of-data.component.html',
  styleUrls: ['./consent-of-data.component.css']
})
export class ConsentOfDataComponent implements OnInit {

  consentDetails:any=[];

  header = new FormControl('', [Validators.required]);
  pText1 = new FormControl('', [Validators.required]);

  public consentForm: FormGroup = new FormGroup({
    header:this.header,
    pText1: this.pText1
  });

  constructor(private http: HttpClient, private router:Router,
    public data:SharedDataService) {}

  ngOnInit(): void {
    this.getData();
  }

  getData(){
    this.http.get(''+this.data.apiDomainPathDash+'getConsentOfData') // Get privacy details
    .subscribe(data => {
      console.log(data);
      this.data.hideLoader();
      
      this.consentDetails = data;
      this.consentDetails = this.consentDetails.response[0];

      this.pText1.reset(this.consentDetails.content);
      this.header.reset(this.consentDetails.title);
    },
    err => {
      // Swal.fire(err);
    });
  }

  validateFormFields() {
    if (this.pText1.hasError('required') || this.header.hasError('required')) {
      return 'Mandatory field';
    } else
    return '';
  }

 

  uplodInfo:any =[];
  consentSection(){
    var uploadData;
      uploadData = new FormData();
      uploadData.append('content', this.pText1.value);
      uploadData.append('title', this.header.value);
    this.data.showLoader();
    this.http.post(''+this.data.apiDomainPathDash+'editConsentOfData',uploadData) // Set privacy details
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

