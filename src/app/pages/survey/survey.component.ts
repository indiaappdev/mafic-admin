import { Component, OnInit, AfterViewInit, ViewChild  } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {MatPaginator} from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import {MatDialog} from '@angular/material/dialog';
import { SharedDataService } from 'src/app/shared/shared-data.service';
import { DescdialogComponent } from 'src/app/pages/survey/descdialog/descdialog.component';
import Chart from 'chart.js/auto';
import { Clipboard } from '@angular/cdk/clipboard';
import { MatSort } from '@angular/material/sort';
import { SurveyDeleteComponent } from './survey-delete/survey-delete.component';
import { SurveyQtnDeleteComponent } from './survey-qtn-delete/survey-qtn-delete.component';
import { ExcelService } from './services/ExcelServices';

@Component({
  selector: 'app-survey',
  templateUrl: './survey.component.html',
  styleUrls: ['.././survey/survey.component.css']
})
export class SurveyComponent implements OnInit {
  ctx:any;
  myChart:any;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;

  userDetails:any = [];
  surveyDetails:any = [];
  surveyTypeDetails:any = [];
  popupClass:string;
  displayedColumns: string[] = ['id' , 'name', 'description', 'noOfQuestion', 'url', 'startDate', 'endDate','active','action','details'];
  dataSource:MatTableDataSource<any>;
  
  searchValue:string = '';
  searchTableValues:any=[];

  exportData:any = [];
  exporting:string = 'pe-auto';
  
  // constructor(private http: HttpClient) { }
  constructor(private http: HttpClient, private dialog:MatDialog, public datas:SharedDataService,private clipboard: Clipboard,
    private excelService:ExcelService) { }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  descOpen(data1:any){
    this.dialog.open(DescdialogComponent,{data:{
      value:data1
    }});
  }

  ngOnInit(): void {
    this.getTableData();
    this.datas.checkAccess('survey');
  }

  getTableData(){
    this.http.post(''+this.datas.apiDomainPathDash+'getSurvey',{}) // Get user details
    .subscribe(data => {
      console.log(data);
      this.userDetails = data;
      this.userDetails = this.userDetails.response;
      this.setTableData(this.userDetails);
    },
    err => {
      // Swal.fire(err);
    });
    this.http.post(''+this.datas.apiDomainPathDash+'getTotalSurvey',{}) // Get user details
    .subscribe(data => {
      console.log(data);
      this.surveyDetails = data;
      this.surveyDetails = this.surveyDetails.response;
    },
    err => {
      // Swal.fire(err);
    });
    this.http.post(''+this.datas.apiDomainPathDash+'getOptionType',{}) // Get user details
    .subscribe(data => {
      console.log(data);
      this.surveyTypeDetails = data;
      this.surveyTypeDetails = this.surveyTypeDetails.response;
      this.myChart = new Chart('canvas', {
        type: 'doughnut',
        data: {
          labels: ['Open','Radio','Checkbox'],
          datasets: [
            { 
              data: [Number(this.surveyTypeDetails.textbox),(Number(this.surveyTypeDetails.radio)+Number(this.surveyTypeDetails.btn_check)),Number(this.surveyTypeDetails.checkbox)],
              backgroundColor: ['rgb(172,134,112)','rgb(255,212,76)','rgb(135,220,254)'],
              weight:0.1
            },
          ]
        }
      });
    },
    err => {
      // Swal.fire(err);
    });
  }

  goToLink(url: string,check:any){
    if(check == 0){
      this.datas.firePopup(false,'Questions not added');
    } else
      window.open(url, "_blank");
  }

  openDeleteDialog(data:any) {
    const dialogRef = this.dialog.open(SurveyDeleteComponent,{
      disableClose: true,
      data: {
        surveyId: data
      }});

    dialogRef.afterClosed().subscribe(result => {
      this.getTableData();
    });
    console.log(data);
  }

  openDeleteQtnDialog(data:any) {
    const dialogRef = this.dialog.open(SurveyQtnDeleteComponent,{
      disableClose: true,
      data: {
        surveyId: data
      }});

    dialogRef.afterClosed().subscribe(result => {
      this.getTableData();
    });
    console.log(data);
  }


  copyUrl(val: string){
    this.clipboard.copy(val);
    this.datas.firePopup(true,'URL copied');
  }

  setTableData(tData:any){
    this.dataSource = new MatTableDataSource(tData);
      this.dataSource.paginator = this.paginator;
      console.log(this.dataSource);
      // this.dataSource.sort = this.sort;
      setTimeout(() => {
        this.dataSource.sort = this.sort;
      });
  }

  searchKey(){
    if(this.searchValue== ''){
      // this.data.firePopup(false,'Enter keywords to search');
      this.setTableData(this.userDetails)
      return;
    }
    this.searchTableValues = [];
    let searchElem = this.searchValue

    searchElem = searchElem.toLowerCase();
    const srchArray = searchElem.split(" ");
    let count = 0;

    if(count == 0){ 
      srchArray.forEach((sElem: any) => {
        for(let ind = 0;ind<this.userDetails.length;ind++){
          if(this.userDetails[ind].name != null)
          if(this.userDetails[ind].name.toLowerCase().includes(sElem)){
            this.searchTableValues[count] = this.userDetails[ind];
            count++;
          }
        }
      });
    }

    if(count == 0){ 
      srchArray.forEach((sElem: any) => {
        for(let ind = 0;ind<this.userDetails.length;ind++){
          if(this.userDetails[ind].description != null)
          if(this.userDetails[ind].description.toLowerCase().includes(sElem)){
            this.searchTableValues[count] = this.userDetails[ind];
            count++;
          }
        }
      });
    }

    if(count !=0){
      this.setTableData(this.searchTableValues);
    } else{
      this.datas.firePopup(false,'No Data Found');
    }
  }

  downloadSheet(sId:string,sName:string){
    this.exporting = 'pe-none';
    this.http.post(''+this.datas.apiDomainPathDash+'getSurveyData',{surveyId:sId}) // Get user details
    .subscribe(data => {
      console.log(data);
      this.exportData = data;
      this.exportData  = this.exportData.response.data;
      sName = sName.replace(' ','_');
      this.excelService.exportAsExcelFile(this.exportData,sName);
      this.exporting = 'pe-auto';
    },
    err => {
      // Swal.fire(err);
    });
  }
}
