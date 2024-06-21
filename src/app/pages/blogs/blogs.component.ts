
import { Component, OnInit, AfterViewInit, ViewChild  } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {MatPaginator} from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import {MatDialog } from '@angular/material/dialog';
import { BannerPopupComponent } from 'src/app/pages/banner/banner-popup/banner-popup.component';
import { BlogsDeleteComponent } from 'src/app/pages/blogs/blogs-delete/blogs-delete.component';
import { EditBlogsComponent } from 'src/app/pages/blogs/edit-blogs/edit-blogs.component';
import { SharedDataService } from 'src/app/shared/shared-data.service';

@Component({
  selector: 'app-blogs',
  templateUrl: './blogs.component.html',
  styleUrls: ['./blogs.component.css']
})
export class BlogsComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;

  userDetails:any = [];
  popupClass:string;
  displayedColumns: string[] = ['id' , 'title','description', 'image', 'action'];
  dataSource:MatTableDataSource<any>;

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
  
  // constructor(private http: HttpClient) { }
  constructor(private http: HttpClient, private dialog:MatDialog, public datas:SharedDataService) { }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }


  openDeleteDialog(data:any) {
    const dialogRef = this.dialog.open(BlogsDeleteComponent,{
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
    const dialogRef = this.dialog.open(EditBlogsComponent,{
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
  }

  getTableData(){
    this.http.post(''+this.datas.apiDomainPathDash+'getBlogs',{}) // Get user details
    .subscribe(data => {
      console.log(data);
      this.userDetails = data;
      this.userDetails = this.userDetails.response;
      this.dataSource = new MatTableDataSource(this.userDetails);
    },
    err => {
      // Swal.fire(err);
    });
    this.popupClass = "popupHead d-none"
  }

}


