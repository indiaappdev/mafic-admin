import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SharedDataService } from 'src/app/shared/shared-data.service';
import { ActivatedRoute,Router } from '@angular/router';

@Component({
  selector: 'app-survey-add-qtn',
  templateUrl: './survey-add-qtn.component.html',
  styleUrls: ['./survey-add-qtn.component.css']
})
export class SurveyAddQtnComponent implements OnInit {

  addSurvey:any = [];
  surveyID:number;
  surveyDetails:any=[];
  noOfQuestion:string;
  quetionDetails=[
    {
      question:'',
      answer:[''],
      type:'radio',
      surveyId:1
    }
  ];

  optionCount=[1];

  constructor(private http: HttpClient,public data:SharedDataService,private route:ActivatedRoute,private router:Router) {
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
      this.noOfQuestion = this.surveyDetails.noOfQuestion;
      if(this.surveyDetails.isAddQuestion == 1){
        this.router.navigate(['/survey']);
      }
    });
  }

  changeType(value:any,index:number){
    let qType = value;
    if(qType == 'textBox'){
      // this.regTypeArtOther = true;
      this.optionCount[index]  =  1;
      this.quetionDetails[index].answer=[''];
      this.quetionDetails[index].answer[0]="textbox"
    } else{
      this.quetionDetails[index].answer=[''];
      // this.regTypeArtOther = false;
    }
  }

  addQuetion(){
    if(this.quetionDetails.length <  Number(this.surveyDetails.noOfQuestion) ){
      this.quetionDetails.push( {
        question:'',
        answer:[''],
        type:'radio',
        surveyId:1
      });
      this.optionCount.push(1);
    } else{
      this.data.firePopup(false,'Number of questions not available for this survey');
    }
  }

  removeQuetion(){
    if(this.quetionDetails.length !=1){
      this.quetionDetails.pop();
      this.optionCount.pop();
    }
  }

  addOption(index:number){
    this.optionCount[index]++;
    console.log(this.optionCount)
  }

  deleteOption(index:number){
    if(this.optionCount[index] !=1){
      this.optionCount[index]--;
      console.log(this.optionCount)
    }
  }

  submitSurvey(){
    let response =[];
    let count = 0;
    for(let i=0;i<this.quetionDetails.length;i++){
      let data = {
        type:'',
        answer:'',
        question:''
      }
      data.answer = this.quetionDetails[i].answer.join('||');
      data.question = this.quetionDetails[i].question;
      data.type = this.quetionDetails[i].type;
      response.push(data);
      if(data.answer == '' || data.question == ''){
        count = 1;
      }
    }
    if (Number(this.noOfQuestion) != response.length ){
      this.data.firePopup(false,'Please check total question count');
      return;
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
