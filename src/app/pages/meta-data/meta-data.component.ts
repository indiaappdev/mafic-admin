import { Component, OnInit, Inject  } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SharedDataService } from 'src/app/shared/shared-data.service';

@Component({
  selector: 'app-meta-data',
  templateUrl: './meta-data.component.html',
  styleUrls: ['./meta-data.component.css']
})
export class MetaDataComponent implements OnInit {

  metaDataDetails:any=[];
  
  pText1 = new FormControl('', [Validators.required]);
  pText2 = new FormControl('', [Validators.required]);

  public metaForm: FormGroup = new FormGroup({
    pText1: this.pText1,
    pText2: this.pText2
  });

  constructor(private http: HttpClient, private router:Router,
    public data:SharedDataService) {}

  ngOnInit(): void {
    this.meta();
    this.data.checkAccess('survey');
  }

  meta(){
    this.http.post(''+this.data.apiDomainPathDash+'getMetaData',{}) // Get Footer letter details
    .subscribe(data => {
      console.log(data);
      this.data.hideLoader();
      
      this.metaDataDetails = data;
      this.metaDataDetails = this.metaDataDetails.response[0];

      this.pText1.reset(this.metaDataDetails.description);
      this.pText2.reset(this.metaDataDetails.keywords);
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
  editMetaSection(){
    var uploadData;
      uploadData = new FormData();
      uploadData.append('description', this.pText1.value);
      uploadData.append('keywords', this.pText2.value);
    this.data.showLoader();
    this.http.post(''+this.data.apiDomainPathDash+'editMetaData',uploadData) // Set News details
    .subscribe(data => {
      console.log(data);
      this.uplodInfo = data;
      this.data.hideLoader();
      this.meta();
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
