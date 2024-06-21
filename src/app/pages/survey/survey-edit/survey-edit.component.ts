import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SharedDataService } from 'src/app/shared/shared-data.service';
import { formatDate } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-survey-edit',
  templateUrl: './survey-edit.component.html',
  styleUrls: ['./survey-edit.component.css']
})
export class SurveyEditComponent implements OnInit {
  addSurvey:any=[];
  surveyName = '';
  surveyDescription = '';
  surveySDate = '';
  surveyEDate = '';
  surveyQtnNo = '';
  surveyID:number;
  surveyDetails:any = [];
  active = true;

  constructor(private http: HttpClient,public data:SharedDataService,private router:Router,private route:ActivatedRoute) {
  }


  ngOnInit(): void {
    const routeParams = this.route.snapshot.paramMap;
    this.surveyID = Number(routeParams.get('sId'));
    // console.log(this.quetionDetails.length)
    this.http.post(''+this.data.apiDomainPathDash+'getSingleSurvey',{surveyId:this.surveyID}) // Get user details
    .subscribe(data => {
      console.log(data);
      this.surveyDetails = data;
      this.surveyDetails = this.surveyDetails.response[0];
      this.surveySDate = this.surveyDetails.startDate;
      this.surveyEDate = this.surveyDetails.endDate;
      this.surveyQtnNo = this.surveyDetails.noOfQuestion;
      this.surveyDescription = this.surveyDetails.description;
      this.surveyName = this.surveyDetails.name;
      if(this.surveyDetails.active == 1){
        this.active = true;
      } else{
        this.active = false;
      }
    });
  }

  submitSurveyData(){
    if(this.surveyName == '' || this.surveyDescription  == '' || this.surveyEDate == '' || this.surveySDate == '' || this.surveyQtnNo == ''){
      this.data.firePopup(false,'Please fill the form');
      return;
    }
    let sDate = formatDate(this.surveySDate, 'yyyy-MM-dd', 'en-US');
    let eDate = formatDate(this.surveyEDate, 'yyyy-MM-dd', 'en-US');
    if(sDate>=eDate){
      this.data.firePopup(false,'Check start date and end date');
      return;
    }
    let activeres;
    if(this.active){
      activeres  = 1;
    } else{
      activeres  = 0;
    }
    this.data.showLoader();
    this.http.post(''+this.data.apiDomainPathDash+'editSurvey',{name:this.surveyName, description:this.surveyDescription, noOfQuestion:this.surveyQtnNo, startDate:formatDate(this.surveySDate, 'yyyy-MM-dd', 'en-US'), endDate:formatDate(this.surveyEDate, 'yyyy-MM-dd', 'en-US'),surveyId:this.surveyID,active:activeres}) // Set survey details
    .subscribe(data => {
      console.log(data);
      this.data.hideLoader();
      this.addSurvey = data;
      if(this.addSurvey.responseCode == 200){
        this.data.firePopup(true,'Survey Data Editted');
        this.router.navigate(['/survey']);
      }else if(this.addSurvey.responseCode == 820){
        this.data.firePopup(false,this.addSurvey.responseMsg);
      }else{
        this.data.firePopup(false,'Error in submitting survey');
      }
    });
  }

}
