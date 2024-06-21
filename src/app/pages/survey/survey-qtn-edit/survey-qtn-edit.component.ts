import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SharedDataService } from 'src/app/shared/shared-data.service';
import { ActivatedRoute,Router } from '@angular/router';

@Component({
  selector: 'app-survey-qtn-edit',
  templateUrl: './survey-qtn-edit.component.html',
  styleUrls: ['./survey-qtn-edit.component.css']
})
export class SurveyQtnEditComponent implements OnInit {

  addSurvey:any = [];
  surveyID:number;
  surveyDetails:any=[];

  optionCount:any=[];
  questionId:any =[];

  constructor(private http: HttpClient,public data:SharedDataService,private route:ActivatedRoute,private router:Router) {
   }

  ngOnInit(): void {
    const routeParams = this.route.snapshot.paramMap;
    this.surveyID = Number(routeParams.get('sId'));
    // console.log(this.surveyDetails.length)
    this.http.get('https://demoonline.xyz/api/survey/'+this.surveyID+'/show') // Get survey details
    .subscribe(data => {
      this.data.loadingClass = 'loadBG d-none';
      this.surveyDetails = data
      this.surveyDetails = this.surveyDetails.response.questionData;
      this.surveyDetails.forEach((survey: { answer: any;question: any;type: any }) => {
        survey.answer = survey.answer.split('||');
      });
      for (let index = 0; index < this.surveyDetails.length; index++) {
        this.surveyDetails[index].oldQues = this.surveyDetails[index].question;
        this.surveyDetails[index].isEdit = "false";
      }
      console.log(data);
      console.log(this.surveyDetails);
    },
    err => {
      // Swal.fire(err);
    });
  }

  changeType(value:any,index:number){
    let qType = value.value;
    if(qType == 'textBox'){
      // this.regTypeArtOther = true;
      this.surveyDetails[index].answer[0]="textBox"
    } else{
      // this.regTypeArtOther = false;
    }
  }

  editted(num:number){
      this.surveyDetails[num].isEdit = "true";
      console.log(this.surveyDetails);
  }

  submitSurvey(){
    let response =[];
    let count = 0;
    for(let i = 0;i < this.surveyDetails.length;i++){
      let data = {
        type:'',
        answer:'',
        question:'',
        isEdit:false,
        oldQues:''
      }
      data.answer = this.surveyDetails[i].answer.join('||');
      data.question = this.surveyDetails[i].question;
      data.type = this.surveyDetails[i].type;
      data.isEdit = this.surveyDetails[i].isEdit;
      data.oldQues = this.surveyDetails[i].oldQues;
      if(data.answer == '' || data.question == ''){
        count = 1;
      }
      response.push(data);
    }
    if(count  == 0){
      this.data.showLoader();
      console.log(response);
      this.http.post('https://demoonline.xyz/api/survey/'+this.surveyID+'/add',response) // Set survey details
      .subscribe(data => {
        console.log(data);
        this.addSurvey = data;
        this.data.hideLoader();
        if(this.addSurvey.responseCode == 200){
          this.data.firePopup(true,'Survey quetions submitted');
          this.router.navigate(['/survey']);
        }else{
          this.data.firePopup(false,'Error in submitting survey');
        }
      },
      err => {
        // Swal.fire(err);
      });
    } else{
      this.data.firePopup(false,'Please fill all the fields');
    }
  }

}
