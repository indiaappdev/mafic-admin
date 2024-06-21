import { Component, OnInit, ViewChild } from '@angular/core';
import { DeletePopComponent } from './delete-pop/delete-pop.component';
import { SharedDataService } from 'src/app/shared/shared-data.service';
import { HttpClient } from '@angular/common/http';
import { ViewEncapsulation } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import {MatDialog,} from '@angular/material/dialog';
import { EditUserPopComponent } from './edit-user-pop/edit-user-pop.component';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
  encapsulation: ViewEncapsulation.None
})


export class UserComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;

  userDetails:any = [];
  popupClass:string;
  displayedColumns: string[] = ['slno','identifier', 'firstName', 'roles','interestCat' ,'createdDate','countryCode', 'mobileNo', 'emailId','isActive','lastName'];
  userTableData:any=[];
  dataSource:MatTableDataSource<any>;

  searchValue:string = '';
  searchTableValues:any=[];


  constructor(private http: HttpClient,public dialog: MatDialog, public datas:SharedDataService) { }


  ngOnInit(): void {
    this.getTableData();
    this.popupClass = "popupHead d-none";
    this.datas.checkAccess('user');
  }

  getTableData(){
    this.http.post(''+this.datas.apiDomainPathDash+'getAllUsers',{}) // Get user details
    .subscribe(data => {
      this.userDetails = data;
      this.userDetails = this.userDetails.response.allUserData;
      this.userTableData = this.userDetails;
      this.setTableData(this.userTableData);
    },
    err => {
      // Swal.fire(err);
    });
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

  popImage(){
    this.popupClass = "popupHead d-block";
  } 

  closePopImage(){
    this.popupClass = "popupHead d-none";
  }

  openDeleteDialog(data:any) {
    const dialogRef = this.dialog.open(DeletePopComponent,{
      disableClose: true,
      data: {
        userID: data
      }});

    dialogRef.afterClosed().subscribe(result => {
      this.getTableData();
    });
    console.log(data);
  }

  openEditDialog(data:any) {
    const dialogRef = this.dialog.open(EditUserPopComponent,{
      disableClose: true,
      data: {
        userID: data
      }});

    dialogRef.afterClosed().subscribe(result => {
      this.getTableData();
    });
    console.log(data);
  }

  searchKey(){
    if(this.searchValue== ''){
      // this.data.firePopup(false,'Enter keywords to search');
      this.setTableData(this.userTableData)
      return;
    }
    this.searchTableValues = [];
    let searchElem = this.searchValue

    searchElem = searchElem.toLowerCase();
    const srchArray = searchElem.split(" ");
    let count = 0;
    srchArray.forEach((sElem: any) => {
      for(let ind = 0;ind<this.userTableData.length;ind++){
        if(this.userTableData[ind].identifier.toLowerCase().includes(sElem)){
          this.searchTableValues[count] = this.userTableData[ind];
          count++;
        }
      }
    });

    if(count == 0){ 
      srchArray.forEach((sElem: any) => {
        for(let ind = 0;ind<this.userTableData.length;ind++){
          if(this.userTableData[ind].firstName != null)
          if(this.userTableData[ind].firstName.toLowerCase().includes(sElem)){
            this.searchTableValues[count] = this.userTableData[ind];
            count++;
          }
        }
      });
    }

    if(count == 0){ 
      srchArray.forEach((sElem: any) => {
        for(let ind = 0;ind<this.userTableData.length;ind++){
          if(this.userTableData[ind].roles != null)
          if(this.userTableData[ind].roles.toLowerCase().includes(sElem)){
            this.searchTableValues[count] = this.userTableData[ind];
            count++;
          }
        }
      });
    }

    if(count == 0){ 
      srchArray.forEach((sElem: any) => {
        for(let ind = 0;ind<this.userTableData.length;ind++){
          if(this.userTableData[ind].interestCat != null)
          if(this.userTableData[ind].interestCat.toLowerCase().includes(sElem)){
            this.searchTableValues[count] = this.userTableData[ind];
            count++;
          }
        }
      });
    }

    if(count == 0){ 
      srchArray.forEach((sElem: any) => {
        for(let ind = 0;ind<this.userTableData.length;ind++){
          if(this.userTableData[ind].mobileNo != null)
          if(this.userTableData[ind].mobileNo.includes(sElem)){
            this.searchTableValues[count] = this.userTableData[ind];
            count++;
          }
        }
      });
    }

    if(count == 0){ 
      srchArray.forEach((sElem: any) => {
        for(let ind = 0;ind<this.userTableData.length;ind++){
          if(this.userTableData[ind].emailId != null)
          if(this.userTableData[ind].emailId.toLowerCase().includes(sElem)){
            this.searchTableValues[count] = this.userTableData[ind];
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