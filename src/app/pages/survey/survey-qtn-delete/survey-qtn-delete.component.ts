import { Component, OnInit , Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { SharedDataService } from 'src/app/shared/shared-data.service';

@Component({
  selector: 'app-survey-qtn-delete',
  templateUrl: './survey-qtn-delete.component.html',
  styleUrls: ['./survey-qtn-delete.component.css']
})
export class SurveyQtnDeleteComponent implements OnInit {

  deleteSurveyId:string;

  constructor(
    public dialogRef: MatDialogRef<SurveyQtnDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpClient,private router:Router, public datas:SharedDataService) {
    console.log('data', this.data.surveyId);
    this.deleteSurveyId  = this.data.surveyId;
  }

  ngOnInit(): void {
  }
  deleteRes:any = [];
  deleteUser(){
    this.datas.showLoader();
    this.http.post(''+this.datas.apiDomainPathDash+'deleteSurveyQuestion',{surveyId:this.deleteSurveyId}) // Delete survey qtn details
    .subscribe(data => {
      this.datas.hideLoader();
      console.log('Survey Question deleted',data);
      this.deleteRes = data;
      if(this.deleteRes.responseCode == 200)
      this.datas.firePopup(true,'Survey Question deleted');
      else
      this.datas.firePopup(false,this.deleteRes.responseMsg);
    },
    err => {
      // Swal.fire(err);
    });
  }
}
