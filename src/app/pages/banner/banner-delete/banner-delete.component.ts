import { Component, OnInit , Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { SharedDataService } from 'src/app/shared/shared-data.service';

@Component({
  selector: 'app-banner-delete',
  templateUrl: './banner-delete.component.html',
  styleUrls: ['./banner-delete.component.css']
})

export class BannerDeleteComponent implements OnInit {

  id:string;

  constructor(
    public dialogRef: MatDialogRef<BannerDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpClient,private router:Router, public datas:SharedDataService) {
    console.log('data', this.data.bannerData.id);
    this.id  = this.data.bannerData.id;
  }

  ngOnInit(): void {
  }

  deleteRes:any = [];
  deleteUser(){
    this.http.post(''+this.datas.apiDomainPathDash+'DeleteBanner',{id:this.id}) // Delete user details
    .subscribe(data => { 
      this.deleteRes = data;
      if(this.deleteRes.responseCode == 200)
      this.datas.firePopup(true,'Banner deleted');
      else
      this.datas.firePopup(false,this.deleteRes.responseMsg);
    },
    err => {
      // Swal.fire(err);
    });
  }


}
