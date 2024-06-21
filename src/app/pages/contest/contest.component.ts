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
import { MatSort } from '@angular/material/sort';
import { FormControl } from '@angular/forms';

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
  selector: 'app-contest',
  templateUrl: './contest.component.html',
  styleUrls: ['.././contest/contest.component.css']
})
export class ContestComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;

  userDetails       :any = [];
  popupClass        :string;
  displayedColumns  :string[] = ['id', 'name', 'category', 'type', 'startDate','endDate','entries', 'action', 'assign'];
  dataSource        :MatTableDataSource<any>;
  filterCount       :any = '';
  searchValue       :string = '';
  searchTableValues :any=[];
  categoryData      :any = [];
  
  sorter =              new FormControl('');

  configs = {
    labelField: 'label',
    valueField: 'value',
    maxItems: 1,
    highlight: true,
    create: false,
    onChange: (value: any) => {
      // Nothing happens when typing into input
      console.log(value);
      this.changed(value);
    }
  };

  data:any = [
    {
      label: 'All',
      value: 'All'
    }
  ];
  
  constructor(private http    : HttpClient, 
              private dialog  : MatDialog, 
              public datas    : SharedDataService) { }

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

    // dialogRef.afterClosed().subscribe(result => {
    //   this.getTableData();
    // });
    // console.log(data);
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
    // console.log(data);
  }


  ngOnInit(): void {
    this.getTableData();
    this.datas.checkAccess('contest');
    this.http.get(''+this.datas.apiDomainPathDash+'getCategory',{}) // Get Category details
    .subscribe(data => {
      console.log(data);
      this.categoryData = data;
      this.categoryData = this.categoryData.response;
      for (let index = 0; index < this.categoryData.length; index++) {
        let obj = {
          label: this.categoryData[index].category,
          value: this.categoryData[index].category
        }
        this.data.push(obj);
      }
    });
    {
      
    }
  }
  getTableData(){
    this.http.post(''+this.datas.apiDomainPathDash+'getContest',{}) // Get contest details
    .subscribe(data => {
      console.log(data);
      this.userDetails = data;
      this.userDetails = this.userDetails.response;
      this.userDetails.forEach((sElem: any) => {
        if(sElem.type == "paid"){
          sElem.type = sElem.cost;
        }
      });
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
    
    this.filterCount = '';
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
          if(this.userDetails[ind].category != null)
          if(this.userDetails[ind].category.toLowerCase().includes(sElem)){
            this.searchTableValues[count] = this.userDetails[ind];
            count++;
          }
        }
      });
    }

    if(count == 0){ 
      srchArray.forEach((sElem: any) => {
        for(let ind = 0;ind<this.userDetails.length;ind++){
          if(this.userDetails[ind].type != null)
          if(this.userDetails[ind].type.toLowerCase().includes(sElem)){
            this.searchTableValues[count] = this.userDetails[ind];
            count++;
          }
        }
      });
    }
    if(count == 0){ 
      srchArray.forEach((sElem: any) => {
        for(let ind = 0;ind<this.userDetails.length;ind++){
          if(this.userDetails[ind].price != null)
          if(this.userDetails[ind].price.toLowerCase().includes(sElem)){
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
      this.filterCount = '';
    }
  }

  changed(value:any){
    
    this.filterCount = '';
    let count = 0;
    if (value == 'All'){
      this.setTableData(this.userDetails);
      return;
    }

    for(let ind = 0;ind<this.userDetails.length;ind++){
      if(this.userDetails[ind].category != null)
      if(this.userDetails[ind].category.includes(value)){
        this.searchTableValues[count] = this.userDetails[ind];
        count++;
      }
    }
    if(count !=0){
      this.setTableData(this.searchTableValues);
      this.filterCount = this.searchTableValues.length;
    } else{
      this.datas.firePopup(false,'No Data Found');
    }
  }

}


 