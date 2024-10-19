import { Component, OnInit, AfterViewInit, ViewChild  } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {MatPaginator} from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { SharedDataService } from 'src/app/shared/shared-data.service';
import {MatDialog} from '@angular/material/dialog';
import { MarketBannerPopupComponent } from 'src/app/pages/marketBanner/marketBanner-popup/marketBanner-popup.component';
import { DeleteMarketBannerComponent } from 'src/app/pages/marketBanner/delete-marketBanner/delete-marketBanner.component';
import { EditMarketBannerComponent } from 'src/app/pages/marketBanner/edit-marketBanner/edit-marketBanner.component';
import { AddMarketBannerComponent } from 'src/app/pages/marketBanner/add-marketBanner/add-marketBanner.component';

@Component({
  selector: 'app-marketBanner',
  templateUrl: './marketBanner.component.html',
  styleUrls: ['./marketBanner.component.css']
})
export class MarketBannerComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;

  userDetails:any = [];
  popupClass:string;
  displayedColumns: string[] = ['id' , 'text', 'image', 'action'];
  dataSource:MatTableDataSource<any>;
  cNameDetails:any = [];
  cName = '';
  cID:number;

  configs = {
    labelField: 'label',
    valueField: 'value',
    maxItems: 1,
    highlight: true,
    create: false,
  };

  data = [
    {
      label: 'Show All',
      value: '1'
    },
      {
      label: 'Unread',
      value: '2'
    },
      {
      label: 'Read',
      value: '3'
    }
  ]
  
  constructor(private http: HttpClient, private dialog:MatDialog, public datas:SharedDataService) { }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  addCategory(data:any) {
    const dialogRef = this.dialog.open(AddMarketBannerComponent,{
      disableClose: true,
      data: {
        categoryData: data
      }});

    dialogRef.afterClosed().subscribe(result => {
      this.getTableData();
    });
    console.log(data);
  }

  openDeleteDialog(data:any) {
    const dialogRef = this.dialog.open(DeleteMarketBannerComponent,{
      disableClose: true,
      data: {
        categoryData: data
      }});
    dialogRef.afterClosed().subscribe(result => {
      this.getTableData();
    });
    console.log(data);
  }

  openEditDialog(data:any) {
    const dialogRef = this.dialog.open(EditMarketBannerComponent,{
      disableClose: true,
      data: {
        categoryData: data
      }});

    dialogRef.afterClosed().subscribe(result => {
      this.getTableData();
    });
    console.log(data);
  }


  imageOpen(data1:any){
    this.dialog.open(MarketBannerPopupComponent,{data:{
      value:data1
    }});
  }

  ngOnInit(): void {
    this.getTableData();
  }

  getTableData(){
    this.http.get(''+this.datas.apiDomainPathDash+'getCategory',{}) // Get Category details
    .subscribe(data => {
      console.log(data);
      this.userDetails = data;
      this.userDetails = this.userDetails.response;
      this.dataSource = new MatTableDataSource(this.userDetails);
    });
    this.http.get(''+this.datas.apiDomainPathDash+'getCategoryTitle',{}) // Get Category details
    .subscribe(data => {
      console.log(data);
      this.cNameDetails = data;
      this.cID = this.cNameDetails.response[0].id;
      this.cName = this.cNameDetails.response[0].title;
      
    },
    err => {
      // Swal.fire(err);
    });
    this.popupClass = "popupHead d-none"
  }
  uplodInfo:any = [];
  updateCName(){
    if(this.cName == ''){
      this.datas.firePopup(false,'Please enter contest name');
      return;
    }
    this.datas.showLoader();
    this.http.post(''+this.datas.apiDomainPathDash+'editCategoryTitle',{title:this.cName}) // Set Category details
    .subscribe(data => {
      console.log(data);
      this.datas.hideLoader();
        this.uplodInfo = data;
        if(this.uplodInfo.responseCode == "200"){
          this.datas.firePopup(true,'Data Updated');
          this.getTableData();
        } else if(this.uplodInfo.responseCode == 803) {
          this.datas.firePopup(false,'Something went wrong..!!!');
        }else {
          this.datas.firePopup(false,this.uplodInfo.responseMsg);
        }
    },
    err => {
      // Swal.fire(err);
    });
  }

}


