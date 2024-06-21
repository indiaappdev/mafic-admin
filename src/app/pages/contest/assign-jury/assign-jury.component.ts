import { Component, OnInit } from '@angular/core';
import { SharedDataService } from 'src/app/shared/shared-data.service';
import { HttpClient } from '@angular/common/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute,Router } from '@angular/router';

@Component({
  selector: 'app-assign-jury',
  templateUrl: './assign-jury.component.html',
  styleUrls: ['./assign-jury.component.css']
})
export class AssignJuryComponent implements OnInit {

  
  roundOne    = new FormControl('');
  roundTwo    = new FormControl('');
  roundThree  = new FormControl('');

  r1:string='';
  r2:string='';
  r3:string='';

  contestId:number;
  roundCount:number;

  juryDetails:any = [];
  juryAssignDetails:any=[];
  roundOneData:any = [];
  roundTwoData:any = [];
  roundThreeData:any = [];
  
  public assignJuryForm: FormGroup = new FormGroup({
    rOne: this.roundOne,
    rTwo: this.roundTwo,
    rThree: this.roundThree,
  });

  constructor(public data     :SharedDataService,
              private http    :HttpClient,
              private route   :ActivatedRoute,
              private router  :Router) { }

  ngOnInit(): void {
    const routeParams = this.route.snapshot.paramMap;
    this.contestId = Number(routeParams.get('cId'));
    this.roundCount = Number(routeParams.get('rCount'));
    this.http.get(''+this.data.apiDomainPathDash+'getAllJury',{}) // Get Jury details
    .subscribe(data => {
      console.log(data);
      this.juryDetails = data;
      this.juryDetails = this.juryDetails.response;
      this.roundOneData = [...this.juryDetails];
      this.roundTwoData = [...this.juryDetails];
      this.roundThreeData = [...this.juryDetails];
    },
    err => {
      // Swal.fire(err);
    });
    this.http.post(''+this.data.apiDomainPathDash+'getAssignJury',{contestId:this.contestId}) // Get Jury details
    .subscribe(data => {
      console.log(data);
      this.juryAssignDetails = data;
      this.roundOne.reset(this.juryAssignDetails.response[0].roundOneAssign);
      this.roundTwo.reset(this.juryAssignDetails.response[0].roundTwoAssign);
      this.roundThree.reset(this.juryAssignDetails.response[0].roundThreeAssign);
    },
    err => {
      // Swal.fire(err);
    });
  }

  validateFormFields() {
    if (this.roundOne.hasError('required') || this.roundTwo.hasError('required') || this.roundThree.hasError('required') ) {
      return 'Mandatory field';
    }
    return '';
  }

  // onChangeTypeOne(value:any){
  //   this.r1 = value.source.value;
  //   this.change();
  //   console.log(value.source.value);
  // }

  // onChangeTypeTwo(value:any){
  //   this.r2 = value.source.value;
  //   this.change();
  //   console.log(value.source.value);
  // }

  // onChangeTypeThree(value:any){
  //   this.r3 = value.source.value;
  //   this.change();
  //   console.log(value.source.value);
  // }

  // change(){
  //   this.roundOneData = [...this.juryDetails];
  //   this.roundTwoData = [...this.juryDetails];
  //   this.roundThreeData = [...this.juryDetails];
  //   for(var i = 0;i < this.roundOneData.length;i++){
  //     if(this.r2 == this.roundOneData[i].identifier){
  //       this.roundOneData.splice(i, 1);
  //     }
  //     if(this.r3 == this.roundOneData[i].identifier){
  //       this.roundOneData.splice(i, 1);
  //     }
  //   }
  //   for(var j = 0;j < this.roundTwoData.length;j++){
  //     if(this.r1 == this.roundTwoData[j].identifier){
  //       this.roundTwoData.splice(j, 1);
  //     }
  //     if(this.r3 == this.roundTwoData[j].identifier){
  //       this.roundTwoData.splice(j, 1);
  //     }
  //   }
  //   for(var k = 0;k < this.roundThreeData.length;k++){
  //     if(this.r1 == this.roundThreeData[k].identifier){
  //       this.roundThreeData.splice(k, 1);
  //     }
  //     if(this.r2 == this.roundThreeData[k].identifier){
  //       this.roundThreeData.splice(k, 1);
  //     }
  //   }
  // }

  juryResponse:any=[];
  assignJury(){
    this.data.showLoader();
    console.log(this.roundOne.value);
    console.log(this.roundTwo.value);
    console.log(this.roundThree.value);
    this.http.post(''+this.data.apiDomainPathDash+'assignJury',{contestId:this.contestId, roundOneAssign:this.roundOne.value, roundTwoAssign:this.roundTwo.value, roundThreeAssign:this.roundThree.value}) // set Jury details
    .subscribe(data => {
      console.log(data);
      this.juryResponse = data;
      this.data.hideLoader();
      if(this.juryResponse.responseCode == 200){
        this.data.firePopup(true,'Data Updated');
        this.router.navigate(['/contest']);
      }else{
        this.data.firePopup(false,this.juryResponse.responseMsg);
      }
    },
    err => {
      // Swal.fire(err);
    });
  }

}
