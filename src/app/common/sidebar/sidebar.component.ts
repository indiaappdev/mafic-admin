import { Component, OnInit } from '@angular/core';
import { SharedDataService } from '../../shared/shared-data.service';
declare var $: any;

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  collapser:string = 'd-none';
  arrow:string = 'fas fa-chevron-circle-up';
  cmsData:any=[];
  accesData:any = [];

  constructor(public data:SharedDataService){

  }

  ngOnInit(): void {

    for (let index = 0; index < this.data.moduleAccess.length; index++) { //check CMS
      if(this.data.moduleAccess[index].moduleName == 'cms') {
        this.cmsData = this.data.moduleAccess[index];
      } else {
        this.accesData.push(this.data.moduleAccess[index]);
      }
    }

  }

  collapse(){
    if(this.data.collapse){
      this.data.collapse = false;
    } else{
      this.data.collapse = true;
    }
  }

}
