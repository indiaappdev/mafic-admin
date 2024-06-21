import { Component, OnInit , Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { SharedDataService } from 'src/app/shared/shared-data.service';

@Component({
  selector: 'app-send-response',
  templateUrl: './send-response.component.html',
  styleUrls: ['./send-response.component.css']
})
export class SendResponseComponent implements OnInit {

  queryData:any = [];
  comment:string = '';

  constructor(
    public dialogRef: MatDialogRef<SendResponseComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpClient,private router:Router,public datas:SharedDataService) {
    // console.log('data', this.data);
    this.queryData  = this.data.id.emailId;
    
  }

  ngOnInit(): void {
  }

  sendReplay(){

    if (this.comment == '') {
      this.datas.firePopup(false,'Please enter message');
      return;
    }

    var uploadData;
    uploadData = new FormData();
    uploadData.append('emailId', this.queryData);
    uploadData.append('comment', this.comment);
    uploadData.append('question', this.data.id.comments);
    this.datas.showLoader();
    this.http.post(''+this.datas.apiDomainPathDash+'QueryResponse',uploadData) // send query response details
    .subscribe(data => { 
      let uplodInfo:any = []
      uplodInfo = data;
      this.datas.hideLoader();
        if(uplodInfo.responseCode == "200"){
          this.datas.firePopup(true,'Email Sent');
        } else if(uplodInfo.responseCode == 803) {
          this.datas.firePopup(false,'Something went wrong..!!!');
        }else {
          this.datas.firePopup(false,uplodInfo.responseMsg);
        }
    });
  }

}

