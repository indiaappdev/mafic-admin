import { Component, OnInit, AfterViewInit, ViewChild  } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {MatPaginator} from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { SharedDataService } from 'src/app/shared/shared-data.service';
import {MatDialog} from '@angular/material/dialog';
import { TitlePopupComponent } from 'src/app/pages/contest/title-popup/title-popup.component';
import { ContestDetailsComponent } from 'src/app/pages/contest/contest-details/contest-details.component';
import { DeleteContestComponent } from 'src/app/pages/contest/delete-contest/delete-contest.component';
import { ActivatedRoute,Params } from '@angular/router';
import { Router } from '@angular/router';
import { MatSort, Sort } from '@angular/material/sort';
import {LiveAnnouncer} from '@angular/cdk/a11y';

export interface contestElement {
  id: number;
  firstName: string;
  createdDate: string;
  mobileNo: string;
  emailId:string;
  isActive:string;
  lastName:string;
}

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['.././contest/contest.component.css']
})

export class EventsComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;

  userDetails:any = [];
  popupClass:string;
  displayedColumns: string[] = ['id', 'name', 'contestType','city', 'startDate','endDate','entries', 'action'];
  dataSource:MatTableDataSource<any>;

  searchValue:string = '';
  searchTableValues:any=[];

  constructor(private http: HttpClient, private dialog:MatDialog, public datas:SharedDataService) { }

  ngAfterViewInit() {
  }

  titleOpen(data1:any){
    this.dialog.open(TitlePopupComponent,{data:{
      value:data1
    }});
  }

  ContestDetailsOpen(data:any) {
    const dialogRef = this.dialog.open(ContestDetailsComponent,{
      disableClose: true,
      data: {
        contestData: data
      }});
  }

  openDeleteDialog(data:any) {
    const dialogRef = this.dialog.open(DeleteContestComponent,{
      disableClose: true,
      data: {
        roleData: data
      }});
    dialogRef.afterClosed().subscribe(result => {
      this.getTableData();
    });
  }

  ngOnInit(): void {
    this.getTableData();
    this.datas.checkAccess('contest');
  }

  getTableData(){
    this.http.post(''+this.datas.apiDomainPathDash+'getContest',{}) // Get user details
    .subscribe(data => {
      console.log(data);
      this.userDetails = data;
      this.userDetails = this.userDetails.response;
      this.setTableData(this.userDetails);
    },
    err => {
      // Swal.fire(err);
    });
    this.popupClass = "popupHead d-none"
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

  searchKey(){
    if(this.searchValue== ''){
      // this.data.firePopup(false,'Enter keywords to search');
      this.setTableData(this.userDetails);
      return;
    }
    this.searchTableValues = [];
    let searchElem = this.searchValue

    searchElem = searchElem.toLowerCase();
    const srchArray = searchElem.split(" ");
    let count = 0;
    srchArray.forEach((sElem: any) => {
      for(let ind = 0;ind<this.userDetails.length;ind++){
        if(this.userDetails[ind].name.toLowerCase().includes(sElem)){
          this.searchTableValues[count] = this.userDetails[ind];
          count++;
        }
      }
    });

    if(count == 0){ 
      srchArray.forEach((sElem: any) => {
        for(let ind = 0;ind<this.userDetails.length;ind++){
          if(this.userDetails[ind].contestType != null)
          if(this.userDetails[ind].contestType.toLowerCase().includes(sElem)){
            this.searchTableValues[count] = this.userDetails[ind];
            count++;
          }
        }
      });
    }

    if(count == 0){ 
      srchArray.forEach((sElem: any) => {
        for(let ind = 0;ind<this.userDetails.length;ind++){
          if(this.userDetails[ind].city != null)
          if(this.userDetails[ind].city.toLowerCase().includes(sElem)){
            this.searchTableValues[count] = this.userDetails[ind];
            count++;
          }
        }
      });
    }
    
    if(count !=0){
      this.setTableData(this.searchTableValues);
    } else{
      this.datas.firePopup(false,'No Data Found');
    }
  }

}

