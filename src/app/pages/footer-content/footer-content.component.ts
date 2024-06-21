import { Component, OnInit, Inject  } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SharedDataService } from 'src/app/shared/shared-data.service';

@Component({
  selector: 'app-footer-content',
  templateUrl: './footer-content.component.html',
  styleUrls: ['./footer-content.component.css']
})
export class FooterContentComponent implements OnInit {

  newsDetails:any=[];
  
  pText1 = new FormControl('', [Validators.required]);
  copyRight = new FormControl('', [Validators.required]);

  public footerForm: FormGroup = new FormGroup({
    pText1: this.pText1
  });

  constructor(private http: HttpClient, private router:Router,
    public data:SharedDataService) {}

  ngOnInit(): void {
    this.foot();
    this.data.checkAccess('survey');
  }

  foot(){
    this.http.post(''+this.data.apiDomainPathDash+'getFooterContent',{}) // Get Footer letter details
    .subscribe(data => {
      console.log(data);
      this.data.hideLoader();
      
      this.newsDetails = data;
      this.newsDetails = this.newsDetails.response[0];

      this.pText1.reset(this.newsDetails.content);
      this.copyRight.reset(this.newsDetails.bottomText);
    },
    err => {
      // Swal.fire(err);
    });
  }

  validateFormFields() {
    if (this.pText1.hasError('required') || this.copyRight.hasError('required')) {
      return 'Mandatory field';
    } else
    return '';
  }

  uplodInfo:any =[];
  editFootSection(){
    var uploadData;
      uploadData = new FormData();
      uploadData.append('content', this.pText1.value);
      uploadData.append('bottomText', this.copyRight.value);
    this.data.showLoader();
    this.http.post(''+this.data.apiDomainPathDash+'editFooterContent',uploadData) // Set News details
    .subscribe(data => {
      console.log(data);
      this.uplodInfo = data;
      this.data.hideLoader();
      this.foot();
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
