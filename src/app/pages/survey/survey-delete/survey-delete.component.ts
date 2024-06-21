import { Component, OnInit , Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { SharedDataService } from 'src/app/shared/shared-data.service';

@Component({
  selector: 'app-survey-delete',
  templateUrl: './survey-delete.component.html',
  styleUrls: ['./survey-delete.component.css']
})
export class SurveyDeleteComponent implements OnInit {

  deleteSurveyId:string;

  constructor(
    public dialogRef: MatDialogRef<SurveyDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpClient,private router:Router, public datas:SharedDataService) {
    console.log('data', this.data.surveyId);
    this.deleteSurveyId  = this.data.surveyId;
  }

  ngOnInit(): void {
  }
  deleteRes:any = [];
  deleteSurvey(){
    this.datas.showLoader();
    this.http.post(''+this.datas.apiDomainPathDash+'deleteSurvey',{surveyId:this.deleteSurveyId}) // Delete survey details
    .subscribe(data => {
      this.datas.hideLoader();
      console.log('Survey deleted',data);
      this.deleteRes = data;
      if(this.deleteRes.responseCode == 200)
      this.datas.firePopup(true,'Survey deleted');
      else
      this.datas.firePopup(false,this.deleteRes.responseMsg);
    },
    err => {
      // Swal.fire(err);
    });
  }
}
