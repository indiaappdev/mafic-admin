import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute,Params } from '@angular/router';
import { SharedDataService } from 'src/app/shared/shared-data.service';
import { ViewEncapsulation } from '@angular/core';
import { saveAs } from 'file-saver';
import * as FileSaver from 'file-saver';

// const download = require('image-downloader').images;


@Component({
  selector: 'app-contest-check',
  templateUrl: './contest-check.component.html',
  styleUrls: ['./contest-check.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ContestCheckComponent implements OnInit {

  contestId:string;
  userId:string;
  entryDetails:any = [];
  winnerDetails:any = [];
  acceptCheck:number = 0;

  acptRjctCommnt:string='';

  contestDetails:any=[];
  artName = '';
  contestName = '';
  winnerType:string = '';

  constructor(private http: HttpClient,private route: ActivatedRoute,
    public data:SharedDataService) { }
              

  ngOnInit(): void {

    
    const routeParams = this.route.snapshot.paramMap;
    this.contestId = String(routeParams.get('cId'));
    this.userId = String(routeParams.get('uId'));
    this.contestName = this.contestId;

    this.http.post(''+this.data.apiDomainPathDash+'getSingleUserEntry',{eventId:this.contestId,userId:this.userId}) // Get user details
    .subscribe(data => {
      console.log(data);
      this.entryDetails = data;
      this.entryDetails = this.entryDetails.response[0];
      this.artName = this.entryDetails.artName;
      this.acceptCheck = this.entryDetails.isRejected;
      if(this.entryDetails.profileUrl == null)
        this.entryDetails.profileUrl = this.data.dummyProfilePic;
    },
    err => {
      
    });

    this.http.post(''+this.data.apiDomainPathDash+'getContest',{}) // Get contest details
    .subscribe(data => {
      console.log(data);
      this.contestDetails = data;
      this.contestDetails = this.contestDetails.response;
    },
    err => {
      
    });

    this.http.post(''+this.data.apiDomainPathDash+'getwinnerAssign',{eventId:this.contestId}) // Get winner details
    .subscribe(data => {
      console.log(data);
      this.winnerDetails = data;
      this.winnerDetails = this.winnerDetails.response;
      this.winnerType = this.winnerDetails[this.winnerDetails.length-1].winnerType;
    },
    err => {
      
    });
  }

  acceptContestEntry(num:number){
    this.data.showLoader();
    this.http.post(''+this.data.apiDomainPathDash+'acceptEntries',{eventId:this.contestId,userId:this.userId,status:num,comment:this.acptRjctCommnt}) // Accept Entries
    .subscribe(data => {
      console.log(data);
      this.data.hideLoader();
      this.acceptCheck = num;
    },
    err => {
      
    });
  }

  addWinner(){
    this.data.showLoader();
    this.http.post(''+this.data.apiDomainPathDash+'winnerAssign',{eventId:this.contestId,userId:this.userId,winnerType:this.winnerType}) // Add winner
    .subscribe(data => {
      console.log(data);
      this.data.hideLoader();
      this.data.firePopup(true,'Winner type assigned')
    },
    err => {
      
    });
  }

  downloadUrl(url:any){
    // this.http.get(''+this.data.apiDomainPathDash+'imageDownload',{responseType: 'blob' }).subscribe(
    //   (d:any)=>{
    //     console.log("image url data",d);
    //     saveAs(d, "image.png");
    
    //   },
    //   (err:any)=>{
    //     console.log("error",err)
    //   }
    // )
    FileSaver.saveAs("https://httpbin.org/image",'image.png');
  }

  uplodInfo:any=[];
  changeContest(){

    if(this.artName == '' || this.contestName == ''){
      this.data.firePopup(false,'All fields are mandatory');
      return;
    }
    
    if(this.artName == this.entryDetails.artName && this.contestName == this.contestId){
      return;
    }

    this.data.showLoader();
    var uploadData;
    uploadData = new FormData();
    uploadData.append('artName', this.artName);
    uploadData.append('newContestId', this.contestName);
    uploadData.append('oldContestId', this.contestId);
    uploadData.append('identifier', this.entryDetails.identifier);
    uploadData.append('userId', this.entryDetails.UserId);

    this.http.post(''+this.data.apiDomainPathDash+'changeContestEntries',uploadData) // Get user details
    .subscribe(data => {
      console.log(data);
      // this.snak.open("Data updated successfully","OK", {"duration": 4000})
      this.uplodInfo = data;
      this.data.hideLoader();
        if(this.uplodInfo.responseCode == "200"){
          this.data.firePopup(true,'Data Updated');
        } else if(this.uplodInfo.responseCode == 803) {
          this.data.firePopup(false,'Something went wrong..!!!');
        }else {
          this.data.firePopup(false,this.uplodInfo.responseMsg);
        }
    },
    err => {
      // Swal.fire(err);
    });

  }

}
