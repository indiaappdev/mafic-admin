import { Component, OnInit, AfterViewInit, ViewChild  } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {MatPaginator} from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { SharedDataService } from 'src/app/shared/shared-data.service';
import {MatDialog} from '@angular/material/dialog';
import { AddTeamComponent } from './add-team/add-team.component';
import { DeleteTeamComponent } from './delete-team/delete-team.component';
import { EditTeamComponent } from './edit-team/edit-team.component';
import { ImageTeamComponent } from './image-team/image-team.component';

@Component({
  selector: 'app-team-section',
  templateUrl: './team-section.component.html',
  styleUrls: ['./team-section.component.css']
})
export class TeamSectionComponent implements OnInit {

  
  @ViewChild(MatPaginator) paginator: MatPaginator;

  coreDetails:any = [];
  popupClass:string;
  displayedColumns: string[] = ['id' , 'name','profession','experience','content' ,'image', 'action'];
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
    const dialogRef = this.dialog.open(AddTeamComponent,{
      disableClose: true});

    dialogRef.afterClosed().subscribe(result => {
      this.getTableData();
    });
  }

  openDeleteDialog(data:any) {
    const dialogRef = this.dialog.open(DeleteTeamComponent,{
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
    const dialogRef = this.dialog.open(EditTeamComponent,{
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
    this.dialog.open(ImageTeamComponent,{data:{
      value:data1
    }});
  }

  ngOnInit(): void {
    this.getTableData();
  }

  getTableData(){
    this.http.get(''+this.datas.apiDomainPathDash+'aboutUs/getTeamSection',{}) // Get user details
    .subscribe(data => {
      console.log(data);
      this.coreDetails = data;
      this.coreDetails = this.coreDetails.response;
      this.dataSource = new MatTableDataSource(this.coreDetails);
    },
    err => {
      // Swal.fire(err);
    });
    this.popupClass = "popupHead d-none"
  }
}


