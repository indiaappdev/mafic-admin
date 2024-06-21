import { Component, OnInit, AfterViewInit, ViewChild  } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {MatPaginator} from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { SharedDataService } from 'src/app/shared/shared-data.service';
import {MatDialog} from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { ViewQueryComponent } from './view-query/view-query.component';
import { SendResponseComponent } from './send-response/send-response.component';
declare var $: any;

@Component({
  selector: 'app-query',
  templateUrl: './query.component.html',
  styleUrls: ['./query.component.css']
})
export class QueryComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;

  skuDetails       :any = [];
  popupClass        :string;
  displayedColumns  : string[] = ['id', 'name', 'comments','phoneNumber','emailId', 'view', 'replay'];
  dataSource        :MatTableDataSource<any>;
  image:string = '';
  
  constructor(private http    : HttpClient, 
              private dialog  : MatDialog, 
              public datas    : SharedDataService) { }

  openViewDialog(data:any) {
    const dialogRef = this.dialog.open(ViewQueryComponent,{
      disableClose: true,
      data: {
        id: data
      }});

    dialogRef.afterClosed().subscribe(result => {
      this.getTableData();
    });
    // console.log(data);
  }
  
  openReplayDialog(data:any) {
    const dialogRef = this.dialog.open(SendResponseComponent,{
      disableClose: true,
      data: {
        id: data
      }});

    dialogRef.afterClosed().subscribe(result => {
      this.getTableData();
    });
    // console.log(data);
  }

  ngOnInit(): void {
    this.getTableData();
    this.datas.checkAccess('sku');
  }
  
  getTableData(){
    this.http.get(''+this.datas.apiDomainPathDash+'getQueries') // Get query details
    .subscribe(data => {
      console.log(data);
      this.skuDetails = data;
      this.skuDetails = this.skuDetails.response;
      this.setTableData(this.skuDetails);
    });
    this.popupClass = "popupHead d-none"
  }

  openImage(url:string){
    this.image = url;
    $("#image_pup_sku").modal("show");
  }

  setTableData(tData:any){
    this.dataSource = new MatTableDataSource(tData);
      this.dataSource.paginator = this.paginator;
      console.log(this.dataSource);
      // this.dataSource.sort = this.sort;
      setTimeout(() => {
        this.dataSource.sort = this.sort;
      });
  }

}

