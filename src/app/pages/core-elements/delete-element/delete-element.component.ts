import { Component, OnInit , Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { SharedDataService } from 'src/app/shared/shared-data.service';

@Component({
  selector: 'app-delete-element',
  templateUrl: './delete-element.component.html',
  styleUrls: ['./delete-element.component.css']
})

export class DeleteElementComponent implements OnInit {

  id:string;

  constructor(
    public dialogRef: MatDialogRef<DeleteElementComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpClient,private router:Router,private datas:SharedDataService) {
    console.log('data', this.data.categoryData.id);
    this.id  = this.data.categoryData.id;
  }

  ngOnInit(): void {
  }

  deleteUser(){
    this.http.post(''+this.datas.apiDomainPathDash+'deleteArtOfCategory',{id:this.id}) // Delete user details
    .subscribe(data => { 
      console.log('Category deleted',data);
    },
    err => {
      // Swal.fire(err);
    });
  }


}
