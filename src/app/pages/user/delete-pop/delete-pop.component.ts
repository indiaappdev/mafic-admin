import { Component, OnInit , Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { SharedDataService } from 'src/app/shared/shared-data.service';

@Component({
  selector: 'app-delete-pop',
  templateUrl: './delete-pop.component.html'
})
export class DeletePopComponent implements OnInit {

  deleteEmailId:string;

  constructor(
    public dialogRef: MatDialogRef<DeletePopComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpClient,private router:Router, public datas:SharedDataService) {
    console.log('data', this.data.userID.emailId);
    this.deleteEmailId  = this.data.userID.emailId;
  }

  ngOnInit(): void {
  }
  deleteRes:any = [];
  deleteUser(){
    this.datas.showLoader();
    this.http.post(''+this.datas.apiDomainPathDash+'userDelete',{emailId:this.deleteEmailId}) // Delete user details
    .subscribe(data => {
      this.datas.hideLoader();
      console.log('User deleted',data);
      this.deleteRes = data;
      if(this.deleteRes.responseCode == 200)
      this.datas.firePopup(true,'User deleted');
      else
      this.datas.firePopup(false,this.deleteRes.responseMsg);
    },
    err => {
      // Swal.fire(err);
    });
  }
}
