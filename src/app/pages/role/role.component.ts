import { Component, OnInit, AfterViewInit, ViewChild  } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {MatPaginator} from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import {MatDialog} from '@angular/material/dialog';
import { DeletePopComponent } from './delete-pop/delete-pop.component';
import { ManageModuleComponent } from './manage-module/manage-module.component';
import { AddRoleComponent } from './add-role/add-role.component';
import { EditRoleComponent } from './edit-role/edit-role.component';
import { SharedDataService } from 'src/app/shared/shared-data.service';

export interface contestElement {
  id: number;
  name: string;
  description: string;
  noOfQuestion: string;
  url:string;
  startDate:any;
  endDate:any;
  isActive:string;
}

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['.././role/role.component.css']
})
export class RoleComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;

  userDetails:any = [];
  popupClass:string;
  // displayedColumns: string[] = ['id' , 'name', 'action'];
  displayedColumns: string[] = ['id' , 'name', 'Module', 'action'];
  dataSource:MatTableDataSource<any>;
  
  // constructor(private http: HttpClient) { }
  constructor(private http: HttpClient, private dialog:MatDialog, public datas:SharedDataService) { }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  openDeleteDialog(data:any) {
    const dialogRef = this.dialog.open(DeletePopComponent,{
      disableClose: true,
      data: {
        roleData: data
      }});

    dialogRef.afterClosed().subscribe(result => {
      this.getTableData();
    });
    console.log(data);
  }

  addRoleData(data:any) {
    const dialogRef = this.dialog.open(AddRoleComponent,{
      disableClose: true,
      data: {
        roleData: data
      }});

    dialogRef.afterClosed().subscribe(result => {
      this.getTableData();
    });
  }

  openModuleDialog(data:any) {
    const dialogRef = this.dialog.open(ManageModuleComponent,{
      disableClose: true,
      data: {
        roleData: data
      }});

    dialogRef.afterClosed().subscribe(result => {
      this.getTableData();
    });
    console.log(data);
  }

  openEditDialog(data:any) {
    const dialogRef = this.dialog.open(EditRoleComponent,{
      disableClose: true,
      data: {
        roleData: data
      }});

    dialogRef.afterClosed().subscribe(result => {
      this.getTableData();
    });
  }


  ngOnInit(): void {
    this.getTableData()
    this.datas.checkAccess('roles');
}

getTableData(){
  this.datas.showLoader();
  this.http.post(''+this.datas.apiDomainPathDash+'getRole',{}) // Get user details
    .subscribe(data => {
      console.log(data);
    this.datas.hideLoader();
      this.userDetails = data;
      this.userDetails = this.userDetails.response;
      this.dataSource = new MatTableDataSource(this.userDetails);
    });
  }
}

