// import { Component, OnInit } from '@angular/core';
// import { HttpClient } from '@angular/common/http';

import { Component, OnInit, AfterViewInit, ViewChild  } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {MatPaginator} from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { SharedDataService } from 'src/app/shared/shared-data.service';

export interface contestElement {
  id: number;
  Module: string;
}

@Component({
  selector: 'app-add-role',
  templateUrl: './add-role.component.html',
  styleUrls: ['./add-role.component.css']
})
export class AddRoleComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;

  userDetails:any = [];
  displayedColumns: string[] = ['Module', 'Read', 'Write', 'Edit', 'Delete'];
  dataSource:MatTableDataSource<any>;

  addRole:any = [];
  roleName:string = ''

  constructor(private http: HttpClient, public datas:SharedDataService) { }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {

    this.http.post(''+this.datas.apiDomainPathDash+'getModule',{}) // Get user details
    .subscribe(data => {
      console.log(data);
      this.userDetails = data;
      this.userDetails = this.userDetails.response;
      for (let index = 0; index < this.userDetails.length; index++) {
        this.userDetails[index].read = false;
        this.userDetails[index].write = false;
        this.userDetails[index].edit = false;
        this.userDetails[index].delete = false;
      }
      this.dataSource = new MatTableDataSource(this.userDetails);
    });

  }

  doSubmitForm(){
    this.datas.showLoader();
    for (let index = 0; index < this.dataSource.filteredData.length; index++) {
      this.addRole[index] = {
        roleName:"",
        moduleId:"",
        read:"",
        write:"",
        edit:"",
        delete:""
      }
      this.addRole[index].roleName = this.roleName;
      this.addRole[index].moduleId = this.userDetails[index].id;
      this.addRole[index].write   = this.userDetails[index].write;
      this.addRole[index].edit    = this.userDetails[index].edit;
      this.addRole[index].delete  = this.userDetails[index].delete;
      if (this.userDetails[index].moduleName == 'dashboard')
        this.addRole[index].read = true;
      else
        this.addRole[index].read = this.userDetails[index].read;
    }

    // // this.flag=true;
    this.http.post(''+this.datas.apiDomainPathDash+'addModulesAccess',this.addRole) // Get user details
    .subscribe(data => {
      let uplodInfo:any = [];
      uplodInfo = data;
      this.datas.hideLoader();
        if(uplodInfo.responseCode == "200"){
          this.datas.firePopup(true,'Role Added');
        } else if(uplodInfo.responseCode == 803) {
          this.datas.firePopup(false,'Something went wrong..!!!');
        }else {
          this.datas.firePopup(false,uplodInfo.responseMsg);
        }
    });
  }
}
