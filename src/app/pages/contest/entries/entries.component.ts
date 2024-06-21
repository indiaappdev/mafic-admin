import { Component, OnInit, AfterViewInit, ViewChild  } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {MatPaginator} from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import {MatDialog} from '@angular/material/dialog';
import { SharedDataService } from 'src/app/shared/shared-data.service';
import { TitlePopupComponent } from 'src/app/pages/contest/title-popup/title-popup.component';
import { ImagePopupComponent } from 'src/app/pages/contest/image-popup/image-popup.component';
import { ContestDetailsComponent } from 'src/app/pages/contest/contest-details/contest-details.component';
import { ActivatedRoute,Params } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { DeleteEntryComponent } from '../delete-entry/delete-entry.component';
import { formatDate } from '@angular/common';

export interface contestElement {
  id: number;
  name: string;
  emailId: string;
  mobile: string;
  contest: string;
  image: string;
}


@Component({
  selector: 'app-entries',
  templateUrl: './entries.component.html',
  styleUrls: ['./entries.component.css']
})
export class EntriesComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatPaginator) paginatorTab2: MatPaginator;
  @ViewChild(MatPaginator) paginatorTab3: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  @ViewChild(MatSort, {static: false}) sortTab2: MatSort;
  @ViewChild(MatSort, {static: false}) sortTab3: MatSort;

  userDetails:any = [];
  popupClass:string;
  contestId:any;
  displayedColumns: string[] = ['id', 'firstName', 'emailId','mobileNo','image','delete'];
  displayedColumnsTab2: string[] = ['name', 'artName', 'roundOneAssign','roundTwoAssign','roundThreeAssign'];
  displayedColumnsTab3: string[] = ['name', 'artName', 'acceptOne','acceptTwo','acceptThree'];
  dataSource:MatTableDataSource<any>;
  dataSourceTab2:MatTableDataSource<any>;
  dataSourceTab3:MatTableDataSource<any>;

  juryDetails:any = [];
  currentDate = new Date();
  
  constructor(private http: HttpClient, private dialog:MatDialog, private route: ActivatedRoute, public datas:SharedDataService) { }

  ngOnInit(): void {

    const routeParams = this.route.snapshot.paramMap;
    this.contestId = String(routeParams.get('cId'));
    console.log(this.contestId);
    
    this.getTableData();
  }

  getTableData(){
    this.http.post(''+this.datas.apiDomainPathDash+'getEntries',{eventId:this.contestId}) // Get Entries details
    .subscribe(data => {
      console.log(data);
      this.userDetails = data;
      this.userDetails = this.userDetails.response;
      this.http.get(''+this.datas.apiDomainPathDash+'getAllJury',{}) // Get Jury details
      .subscribe(data => {
        console.log(data);
        this.juryDetails = data;
        this.juryDetails = this.juryDetails.response;
        for (let index = 0; index < this.juryDetails.length; index++) { //Assign Jury name according to ID
          if(this.juryDetails[index].identifier === this.userDetails[0].roundOneAssign){
            for (let r1 = 0; r1 < this.userDetails.length; r1++) {
              this.userDetails[r1].roundOneAssign = ''+this.juryDetails[index].firstName+' '+this.juryDetails[index].lastName+'';
            }
          }
          else if(this.juryDetails[index].identifier === this.userDetails[0].roundTwoAssign){
            for (let r2 = 0; r2 < this.userDetails.length; r2++) {
              this.userDetails[r2].roundTwoAssign = ''+this.juryDetails[index].firstName+' '+this.juryDetails[index].lastName+'';
            }
          }
          else if(this.juryDetails[index].identifier === this.userDetails[0].roundThreeAssign){
            for (let r3 = 0; r3 < this.userDetails.length; r3++) {
              this.userDetails[r3].roundThreeAssign = ''+this.juryDetails[index].firstName+' '+this.juryDetails[index].lastName+'';
            }
          }
        }

        let cDate = formatDate(this.currentDate, 'yyyy-MM-dd', 'en-US');
        if (this.userDetails[0].roundCount > 0){
          for (let i = 0; i < this.userDetails.length; i++) { // Check time of contest
            this.userDetails[i].roundOneEndDate = formatDate( this.userDetails[i].roundOneEndDate, 'yyyy-MM-dd', 'en-US');
            if(this.userDetails[i].roundOneStartDate < cDate){
              this.userDetails[i].roundOneClass = 'yts';
              this.userDetails[i].roundTwoClass = 'yts';
              this.userDetails[i].roundThreeClass = 'yts';
            } else if(this.userDetails[i].roundOneEndDate >= cDate){
              this.userDetails[i].roundOneClass = 'onGoing';
              this.userDetails[i].roundTwoClass = 'yts';
              this.userDetails[i].roundThreeClass = 'yts';
            }else if(this.userDetails[i].roundTwoStartDate < cDate){
              this.userDetails[i].roundOneClass = 'completed';
              this.userDetails[i].roundTwoClass = 'yts';
              this.userDetails[i].roundThreeClass = 'yts';
            } else if(this.userDetails[i].roundTwoEndDate >= cDate){
              this.userDetails[i].roundOneClass = 'completed';
              this.userDetails[i].roundTwoClass = 'onGoing';
              this.userDetails[i].roundThreeClass = 'yts';
            }else if(this.userDetails[i].roundThreeStartDate < cDate){
              this.userDetails[i].roundOneClass = 'completed';
              this.userDetails[i].roundTwoClass = 'onGoing';
              this.userDetails[i].roundThreeClass = 'yts';
            } else if(this.userDetails[i].roundThreeEndDate >= cDate){
              this.userDetails[i].roundOneClass = 'completed';
              this.userDetails[i].roundTwoClass = 'completed';
              this.userDetails[i].roundThreeClass = 'onGoing';
            }else{
              this.userDetails[i].roundOneClass = 'completed';
              this.userDetails[i].roundTwoClass = 'completed';
              this.userDetails[i].roundThreeClass = 'completed';
            }
          }
        }
        
        console.log(this.userDetails);
        this.dataSource = new MatTableDataSource(this.userDetails);
        this.dataSource.paginator = this.paginator;
        setTimeout(() => {
          this.dataSource.sort = this.sort;
        });
        this.dataSourceTab2 = new MatTableDataSource(this.userDetails);
        this.dataSource.paginator = this.paginatorTab2;
        setTimeout(() => {
          this.dataSourceTab2.sort = this.sortTab2;
        });
        this.dataSourceTab3 = new MatTableDataSource(this.userDetails);
        this.dataSource.paginator = this.paginatorTab3;
        setTimeout(() => {
          this.dataSourceTab3.sort = this.sortTab3;
        });
      },
      err => {
        // Swal.fire(err);
      });      
    },
    err => {
      
    });
  }

  openDeleteDialog(data1:any,data2:any,data3:any) {
    const dialogRef = this.dialog.open(DeleteEntryComponent,{
      disableClose: true,
      data: {
        cId: data1,
        uId:data2,
        identifier:data3
      }});

    dialogRef.afterClosed().subscribe(result => {
      this.getTableData();
    });
    // console.log(data);
  }
}

