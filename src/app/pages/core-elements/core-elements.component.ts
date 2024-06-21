import { Component, OnInit, AfterViewInit, ViewChild  } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {MatPaginator} from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { SharedDataService } from 'src/app/shared/shared-data.service';
import {MatDialog} from '@angular/material/dialog';
import { AddElementComponent } from './add-element/add-element.component';
import { DeleteElementComponent } from './delete-element/delete-element.component';
import { EditElementComponent } from './edit-element/edit-element.component';
import { ImageElementComponent } from './image-element/image-element.component';

@Component({
  selector: 'app-core-elements',
  templateUrl: './core-elements.component.html',
  styleUrls: ['./core-elements.component.css']
})
export class CoreElementsComponent implements OnInit {

 
  @ViewChild(MatPaginator) paginator: MatPaginator;

  coreDetails:any = [];
  popupClass:string;
  displayedColumns: string[] = ['id' , 'title','content', 'image', 'action'];
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
  
  constructor(private http: HttpClient, private dialog:MatDialog, public datas:SharedDataService) { }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  addElement() {
    const dialogRef = this.dialog.open(AddElementComponent,{
      disableClose: true});

    dialogRef.afterClosed().subscribe(result => {
      this.getTableData();
    });
  }

  openDeleteDialog(data:any) {
    const dialogRef = this.dialog.open(DeleteElementComponent,{
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
    const dialogRef = this.dialog.open(EditElementComponent,{
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
    this.dialog.open(ImageElementComponent,{data:{
      value:data1
    }});
  }

  ngOnInit(): void {
    this.getTableData();
  }

  getTableData(){
    this.http.post(''+this.datas.apiDomainPathDash+'getArtOfCategory',{}) // Get user details
    .subscribe(data => {
      console.log(data);
      this.coreDetails = data;
      this.coreDetails = this.coreDetails.response;
      this.dataSource = new MatTableDataSource(this.coreDetails);
    },
    err => {
      // Swal.fire(err);
    });
  }


}


