import { Component, OnInit , Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { SharedDataService } from 'src/app/shared/shared-data.service';

@Component({
  selector: 'app-view-query',
  templateUrl: './view-query.component.html',
  styleUrls: ['./view-query.component.css']
})
export class ViewQueryComponent implements OnInit {

  queryData:any = [];

  constructor(
    public dialogRef: MatDialogRef<ViewQueryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpClient,private router:Router,public datas:SharedDataService) {
    // console.log('data', this.data);
    this.queryData  = this.data.id;
    
  }

  ngOnInit(): void {
  }

}

