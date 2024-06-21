import { Component, OnInit , Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { SharedDataService } from 'src/app/shared/shared-data.service';

@Component({
  selector: 'app-delete-contest',
  templateUrl: './delete-contest.component.html',
  styleUrls: ['./delete-contest.component.css']
})
export class DeleteContestComponent implements OnInit {

  id:string;

  constructor(
    public dialogRef: MatDialogRef<DeleteContestComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpClient,private router:Router,public datas:SharedDataService) {
    console.log('data', this.data.roleData);
    this.id  = this.data.roleData;
  }

  ngOnInit(): void {
  }

  deleteUser(){
    this.http.post(''+this.datas.apiDomainPathDash+'deleteContest',{id:this.id}) // Delete user details
    .subscribe(data => { 
      this.datas.firePopup(true,'Contest deleted');
    },
    err => {
      // Swal.fire(err);
    });
  }


}

