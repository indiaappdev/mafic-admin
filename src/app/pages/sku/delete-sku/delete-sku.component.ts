import { Component, OnInit , Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { SharedDataService } from 'src/app/shared/shared-data.service';

@Component({
  selector: 'app-delete-sku',
  templateUrl: './delete-sku.component.html',
  styleUrls: ['./delete-sku.component.css']
})
export class DeleteSkuComponent implements OnInit {

  id:string;
  constructor(
    public dialogRef: MatDialogRef<DeleteSkuComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpClient,private router:Router,public datas:SharedDataService) {
    console.log('data', this.data);
    this.id  = this.data.id;
  }

  ngOnInit(): void {
  }

  uplodInfo:any = [];
  deleteSKU(){
    this.datas.showLoader();
    this.http.post(''+this.datas.apiDomainPathDash+'deleteSku',{id:this.id}) // Delete SKU details
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
    });
  }


}


