import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SharedDataService } from 'src/app/shared/shared-data.service';
import { formatDate } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-survey-add',
  templateUrl: './survey-add.component.html',
  styleUrls: ['./survey-add.component.css']
})
export class SurveyAddComponent implements OnInit {

  addSurvey:any=[];
  surveyName = '';
  surveyDescription = '';
  surveySDate = '';
  surveyEDate = '';
  surveyQtnNo = '';

  constructor(private http: HttpClient,public data:SharedDataService,private  router:Router) {
  }


  ngOnInit(): void {
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
    this.data.showLoader()

    this.http.post(''+this.data.apiDomainPathDash+'addSurvey',{name:this.surveyName, description:this.surveyDescription, noOfQuestion:this.surveyQtnNo, startDate:formatDate(this.surveySDate, 'yyyy-MM-dd', 'en-US'), endDate:formatDate(this.surveyEDate, 'yyyy-MM-dd', 'en-US')}) // Set survey details
    .subscribe(data => {
      console.log(data);
      this.data.hideLoader();
      this.addSurvey = data;
      if(this.addSurvey.responseCode == 200){
        this.data.firePopup(true,'Survey Submitted');
        this.router.navigate(['/survey']);
      }else{
        this.data.firePopup(false,'Error in submitting survey');
      }
    },
    err => {
      // Swal.fire(err);
    });
  }

}
