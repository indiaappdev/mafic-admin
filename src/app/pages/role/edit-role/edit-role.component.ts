import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { SharedDataService } from 'src/app/shared/shared-data.service';

@Component({
  selector: 'app-edit-role',
  templateUrl: './edit-role.component.html',
  styleUrls: ['./edit-role.component.css']
})
export class EditRoleComponent implements OnInit {

  data = {
    id:"",
    role:""
  }

  constructor(private http: HttpClient, public dailogRef:MatDialogRef<EditRoleComponent>,
    @Inject(MAT_DIALOG_DATA) public data1: any, public datas:SharedDataService) { 
      console.log(this.data1.roleData.roles);
      this.data.role = this.data1.roleData.roles;
      this.data.id = this.data1.roleData.id;
    }

  ngOnInit(): void {
  }

  doEditForm(){
    this.datas.showLoader();
    this.http.post(''+this.datas.apiDomainPathDash+'editRole',this.data) // set edit role
    .subscribe(data => {
      let uplodInfo:any = [];
      uplodInfo = data;
      this.datas.hideLoader();
        if(uplodInfo.responseCode == "200"){
          this.datas.firePopup(true,'Data Editted');
        } else if(uplodInfo.responseCode == 803) {
          this.datas.firePopup(false,'Something went wrong..!!!');
        }else {
          this.datas.firePopup(false,uplodInfo.responseMsg);
        }
    });

  }
}
