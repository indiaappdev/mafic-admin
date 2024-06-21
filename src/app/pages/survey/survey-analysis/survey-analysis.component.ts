import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SharedDataService } from 'src/app/shared/shared-data.service';
import { ActivatedRoute,Router } from '@angular/router';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-survey-analysis',
  templateUrl: './survey-analysis.component.html',
  styleUrls: ['./survey-analysis.component.css']
})
export class SurveyAnalysisComponent implements OnInit {

  surveyID:number;
  surveyDetails:any=[];
  questions:any = [];
  options:any = [];
  optionTrack:any  = [];
  totalAttended:any=[];
  optVal:any=[];
  surveyQtnDetails:any=[];
  survey_name:string;
  survey_description:string;
  optionName:any=[];
  optionId:any=[];
  
  ctx:any;
  myChart:any=[];
  // chartData:any = [];
  // ChartBg:any = []

  constructor(private http: HttpClient,public data:SharedDataService,private route:ActivatedRoute,private router:Router) {
  }

  ngOnInit(): void {
    this.data.showLoader();
    const routeParams = this.route.snapshot.paramMap;
    this.surveyID = Number(routeParams.get('sId'));
    this.http.get('https://demoonline.xyz/api/survey/'+this.surveyID+'/get-question') // Get user details
    .subscribe(data => {
      console.log(data);
      this.surveyDetails = data;
      if(this.surveyDetails.responseCode == 814){
        this.data.firePopup(false,'No  records found');
        this.router.navigate(['/survey']);
        this.data.hideLoader();
        return;
      }
      this.data.hideLoader();
      this.surveyQtnDetails = data;
      this.survey_name = this.surveyQtnDetails.response.surveyName;
      this.survey_description = this.surveyQtnDetails.response.surveyDescription;
      this.surveyQtnDetails = this.surveyQtnDetails.response.analysisData;
      console.log(this.surveyQtnDetails);
      let chartData = [];
      let ChartBg = [];
    //   for(let i = 0;i < this.surveyQtnDetails.length;i++){
    //     for(let j = 0;j < this.surveyQtnDetails[i].options.length;j++){
    //       chartData.push(this.surveyQtnDetails[i].options[j].percentage);
    //       ChartBg.push(this.data.getRandomColor());
    //     }
    //     this.myChart[i] = new Chart('can'+i+'vas', {
    //       type: 'doughnut',
    //       data: {
    //         datasets: [
    //           { 
    //             data: chartData,
    //             backgroundColor: ChartBg,
    //             weight:0.1
    //           },
    //         ]
    //       }
    //     });
    //   }
    //  console.log(this.myChart)
      this.data.hideLoader();
    },
    err => {
      // Swal.fire(err);
    });
  }

}
