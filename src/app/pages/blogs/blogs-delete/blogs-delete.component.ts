// import { Component, OnInit } from '@angular/core';

// @Component({
//   selector: 'app-blogs-delete',
//   templateUrl: './blogs-delete.component.html',
//   styleUrls: ['./blogs-delete.component.css']
// })
// export class BlogsDeleteComponent implements OnInit {

//   constructor() { }

//   ngOnInit(): void {
//   }

// }

import { Component, OnInit , Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-blogs-delete',
  templateUrl: './blogs-delete.component.html',
  styleUrls: ['./blogs-delete.component.css']
})

export class BlogsDeleteComponent implements OnInit {

  id:string;

  constructor(
    public dialogRef: MatDialogRef<BlogsDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpClient,private router:Router) {
    console.log('data', this.data.bannerData.id);
    this.id  = this.data.bannerData.id;
  }

  ngOnInit(): void {
  }

  deleteUser(){
    this.http.post(''+this.data.apiDomainPathDash+'deleteBlogs',{id:this.id}) // Delete user details
    .subscribe(data => { 
      console.log('blog deleted',data);
    },
    err => {
      // Swal.fire(err);
    });
  }


}
