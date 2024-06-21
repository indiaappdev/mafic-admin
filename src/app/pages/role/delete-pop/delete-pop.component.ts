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

  id:string;

  constructor(
    public dialogRef: MatDialogRef<DeletePopComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpClient,private router:Router, public datas:SharedDataService) {
    console.log('data', this.data.roleData.id);
    this.id  = this.data.roleData.id;
  }

  ngOnInit(): void {
  }

  deleteUser(){
    this.datas.showLoader();
    this.http.post(''+this.datas.apiDomainPathDash+'deleteRole',{id:this.id}) // Delete user details
    .subscribe(data => { 
      let uplodInfo:any = [];
      uplodInfo = data;
      this.datas.hideLoader();
        if(uplodInfo.responseCode == "200"){
          this.datas.firePopup(true,'Data Deleted');
        } else if(uplodInfo.responseCode == 803) {
          this.datas.firePopup(false,'Something went wrong..!!!');
        }else {
          this.datas.firePopup(false,uplodInfo.responseMsg);
        }
    },
    err => {
      // Swal.fire(err);
    });
  }


}
