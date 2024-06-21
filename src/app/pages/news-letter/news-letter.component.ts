import { Component, OnInit, Inject  } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { SharedDataService } from 'src/app/shared/shared-data.service';

@Component({
  selector: 'app-news-letter',
  templateUrl: './news-letter.component.html',
  styleUrls: ['./news-letter.component.css']
})
export class NewsLetterComponent implements OnInit {

  newsDetails:any=[];
  
  pText1 = new FormControl('', [Validators.required]);
  pText2 = new FormControl('', [Validators.required]);
  imageUrl:string;

  public newsForm: FormGroup = new FormGroup({
    pText1: this.pText1,
    pText2: this.pText2
  });

  constructor(private http: HttpClient, private router:Router,
    public data:SharedDataService) {}

  ngOnInit(): void {
   this.news();
   this.data.checkAccess('survey');
  }

  news(){
    this.http.post(''+this.data.apiDomainPathDash+'getHomePageSubscribe',{}) // Get News letter details
    .subscribe(data => {
      console.log(data);
      this.data.hideLoader();
      
      this.newsDetails = data;
      this.newsDetails = this.newsDetails.response[0];

      this.pText1.reset(this.newsDetails.h3Title);
      this.pText2.reset(this.newsDetails.pContent);
    },
    err => {
      // Swal.fire(err);
    });
  }

  validateFormFields() {
    if (this.pText1.hasError('required') || this.pText2.hasError('required')) {
      return 'Mandatory field';
    } else
    return '';
  }

  uplodInfo:any =[];
  editNewsSection(){
    var uploadData;
      uploadData = new FormData();
      uploadData.append('h3Title', this.pText1.value);
      uploadData.append('pContent', this.pText2.value);
    this.data.showLoader();
    this.http.post(''+this.data.apiDomainPathDash+'editHomePageSubscribe',uploadData) // Set News details
    .subscribe(data => {
      console.log(data);
      this.uplodInfo = data;
      this.data.hideLoader();
      this.news();
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
