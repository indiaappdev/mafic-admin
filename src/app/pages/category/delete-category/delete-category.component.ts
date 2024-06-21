import { Component, OnInit , Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { SharedDataService } from 'src/app/shared/shared-data.service';

@Component({
  selector: 'app-delete-category',
  templateUrl: './delete-category.component.html',
  styleUrls: ['./delete-category.component.css']
})

export class DeleteCategoryComponent implements OnInit {

  id:string;

  constructor(
    public dialogRef: MatDialogRef<DeleteCategoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpClient,private router:Router,private datas:SharedDataService) {
    console.log('data', this.data.categoryData.id);
    this.id  = this.data.categoryData.id;
  }

  ngOnInit(): void {
  }

  deleteRes:any = []
  deleteUser(){
    this.http.post(''+this.datas.apiDomainPathDash+'deleteCategory',{id:this.id}) // Delete user details
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
