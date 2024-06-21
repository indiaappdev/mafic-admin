import { Component, OnInit , Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { SharedDataService } from 'src/app/shared/shared-data.service';

@Component({
  selector: 'app-delete-team',
  templateUrl: './delete-team.component.html',
  styleUrls: ['./delete-team.component.css']
})
export class DeleteTeamComponent implements OnInit {


  id:string;

  constructor(
    public dialogRef: MatDialogRef<DeleteTeamComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpClient,private router:Router,private datas:SharedDataService) {
    console.log('data', this.data.categoryData.id);
    this.id  = this.data.categoryData.id;
  }

  ngOnInit(): void {
  }

  deleteMember(){
    this.http.post(''+this.datas.apiDomainPathDash+'aboutUs/deleteTeamSection',{id:this.id}) // Delete Team details
    .subscribe(data => { 
      console.log('Team Member deleted',data);
    },
    err => {
      // Swal.fire(err);
    });
  }


}

