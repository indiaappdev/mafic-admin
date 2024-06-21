import { Component, OnInit, AfterViewInit, ViewChild  } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {MatPaginator} from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { SharedDataService } from 'src/app/shared/shared-data.service';
import {MatDialog} from '@angular/material/dialog';
import { BannerPopupComponent } from 'src/app/pages/banner/banner-popup/banner-popup.component';
import { BannerDeleteComponent } from 'src/app/pages/banner/banner-delete/banner-delete.component';
import { EditBannerComponent } from 'src/app/pages/banner/edit-banner/edit-banner.component';
import { BannerAddComponent } from 'src/app/pages/banner/banner-add/banner-add.component';


@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.css']
})
export class BannerComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;

  userDetails:any = [];
  popupClass:string;
  displayedColumns: string[] = ['id' , 'text', 'image', 'action'];
  dataSource:MatTableDataSource<any>;

  constructor(private http: HttpClient, private dialog:MatDialog, public datas:SharedDataService) { }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  addBanner(data:any) {
    const dialogRef = this.dialog.open(BannerAddComponent,{
      disableClose: true,
      data: {
        bannerData: data
      }});

    dialogRef.afterClosed().subscribe(result => {
      this.getTableData();
    });
    console.log(data);
  }

  openDeleteDialog(data:any) {
    const dialogRef = this.dialog.open(BannerDeleteComponent,{
      disableClose: true,
      data: {
        bannerData: data
      }});

    dialogRef.afterClosed().subscribe(result => {
      this.getTableData();
    });
    console.log(data);
  }

  openEditDialog(data:any) {
    const dialogRef = this.dialog.open(EditBannerComponent,{
      disableClose: true,
      data: {
        bannerData: data
      }});

    dialogRef.afterClosed().subscribe(result => {
      this.getTableData();
    });
    console.log(data);
  }


  imageOpen(data1:any){
    this.dialog.open(BannerPopupComponent,{data:{
      value:data1
    }});
  }

  ngOnInit(): void {
    this.getTableData();
    this.datas.checkAccess('survey');
  }

  getTableData(){
    this.http.post(''+this.datas.apiDomainPathDash+'getBanner',{}) // Get user details
    .subscribe(data => {
      console.log(data);
      this.userDetails = data;
      this.userDetails = this.userDetails.response;
      this.dataSource = new MatTableDataSource(this.userDetails);
    });
    this.popupClass = "popupHead d-none"
  }

}


