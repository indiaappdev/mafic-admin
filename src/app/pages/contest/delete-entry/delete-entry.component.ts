import { Component, OnInit , Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { SharedDataService } from 'src/app/shared/shared-data.service';

@Component({
  selector: 'app-delete-entry',
  templateUrl: './delete-entry.component.html',
  styleUrls: ['./delete-entry.component.css']
})
export class DeleteEntryComponent implements OnInit {

  uId:string;
  cId:string;
  ident:string;
  constructor(
    public dialogRef: MatDialogRef<DeleteEntryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpClient,private router:Router,public datas:SharedDataService) {
    console.log('data', this.data);
    this.uId  = this.data.uId;
    this.cId  = this.data.cId;
    this.ident = this.data.identifier;
  }

  ngOnInit(): void {
  }

  uplodInfo:any =[]
  deleteEntry(){
    this.datas.showLoader();
    this.http.post(''+this.datas.apiDomainPathDash+'deleteContestEntries',{contestId:this.cId, userId:this.uId,identifier:this.ident}) // Delete user details
    .subscribe(data => { 
      this.uplodInfo = data;
      this.datas.hideLoader();
        if(this.uplodInfo.responseCode == "200"){
          this.datas.firePopup(true,'Data Deleted');
        } else if(this.uplodInfo.responseCode == 803) {
          this.datas.firePopup(false,'Something went wrong..!!!');
        }else {
          this.datas.firePopup(false,this.uplodInfo.responseMsg);
        }
    },
    err => {
      // Swal.fire(err);
    });
  }


}

