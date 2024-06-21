import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { SharedDataService } from 'src/app/shared/shared-data.service';

@Component({
  selector: 'app-manage-module',
  templateUrl: './manage-module.component.html',
  styleUrls: ['./manage-module.component.css']
})

export class ManageModuleComponent implements OnInit {

  userDetails:any = [];
  displayedColumns: string[] = ['moduleName', 'readAccess', 'writeAccess', 'editAccess', 'deleteAccess'];
  dataSource:MatTableDataSource<any>;

  addRole:any = [];

  constructor(private http: HttpClient, public dailogRef:MatDialogRef<ManageModuleComponent>,
    @Inject(MAT_DIALOG_DATA) public data1: any, public datas:SharedDataService) { 
      console.log(this.data1.roleData);
    }

  ngAfterViewInit() {
  }

  ngOnInit(): void {

    this.http.post(''+this.datas.apiDomainPathDash+'getModulesAccess',{roleId:this.data1.roleData.id}) // Get user details
    .subscribe(data => {
      console.log(data);
      this.userDetails = data;
      this.userDetails = this.userDetails.response;
      for (let index = 0; index < this.userDetails.length; index++) {
        if (this.userDetails[index].readAccess == 1)
          this.userDetails[index].readAccess = true;
        else if (this.userDetails[index].readAccess == 0)
          this.userDetails[index].readAccess = false;
        if (this.userDetails[index].writeAccess == 1)
          this.userDetails[index].writeAccess = true;
        else if (this.userDetails[index].writeAccess == 0)
          this.userDetails[index].writeAccess = false;
        if (this.userDetails[index].editAccess == 1)
          this.userDetails[index].editAccess = true;
        else if (this.userDetails[index].editAccess == 0)
          this.userDetails[index].editAccess = false;
        if (this.userDetails[index].deleteAccess == 1)
          this.userDetails[index].deleteAccess = true;
        else if (this.userDetails[index].deleteAccess == 0)
          this.userDetails[index].deleteAccess = false;
      }
      this.dataSource = new MatTableDataSource(this.userDetails);
    });

  }

  assignModule() {
    this.datas.showLoader();
    for (let index = 0; index < this.dataSource.filteredData.length; index++) {
      this.addRole[index] = {
        "roleId":"",
        "moduleId":"",
        "read":"",
        "write":"",
        "edit":"",
        "delete":""
      }
      this.addRole[index].roleId = this.data1.roleData.id;
      this.addRole[index].moduleId = this.userDetails[index].moduleId;
      this.addRole[index].write   = this.userDetails[index].writeAccess;
      this.addRole[index].edit    = this.userDetails[index].editAccess;
      this.addRole[index].delete  = this.userDetails[index].deleteAccess; 
      if (this.userDetails[index].moduleName == 'dashboard')
        this.addRole[index].read = true;
      else
        this.addRole[index].read    = this.userDetails[index].readAccess;
    }

    this.http.post(''+this.datas.apiDomainPathDash+'manageModules', this.addRole) // Manage role
    .subscribe(data => {
      let uplodInfo:any = [];
      uplodInfo = data;
      this.datas.hideLoader();
        if(uplodInfo.responseCode == "200"){
          this.datas.firePopup(true,'Acces Editted');
        } else if(uplodInfo.responseCode == 803) {
          this.datas.firePopup(false,'Something went wrong..!!!');
        }else {
          this.datas.firePopup(false,uplodInfo.responseMsg);
        }
    });
   }
}

