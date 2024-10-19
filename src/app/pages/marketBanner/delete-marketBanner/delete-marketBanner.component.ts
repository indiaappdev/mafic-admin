import { Component, OnInit , Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { SharedDataService } from 'src/app/shared/shared-data.service';

@Component({
  selector: 'app-delete-marketBanner',
  templateUrl: './delete-marketBanner.component.html',
  styleUrls: ['./delete-marketBanner.component.css']
})

export class DeleteMarketBannerComponent implements OnInit {

  id:string;

  constructor(
    public dialogRef: MatDialogRef<DeleteMarketBannerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpClient,private router:Router,private datas:SharedDataService) {
    console.log('data', this.data.categoryData.id);
    this.id  = this.data.categoryData.id;
  }

  ngOnInit(): void {
  }

  deleteRes:any = []
  deleteUser(){
    const formData = new FormData();
    formData.append('id', this.id.toString());
    this.http.post(''+this.datas.apiDomainPathDashTwo+'banner/delete',formData) // Delete user details
    .subscribe(data => {
      this.deleteRes = data;
      if(this.deleteRes.responseCode == 200)
      this.datas.firePopup(true,'Category deleted');
      else
      this.datas.firePopup(false,this.deleteRes.responseMsg);
    },
    err => {
      // Swal.fire(err);
    });
  }


}
