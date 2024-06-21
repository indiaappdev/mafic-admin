import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { SharedDataService } from 'src/app/shared/shared-data.service';

@Component({
  selector: 'app-banner-image',
  templateUrl: './banner-image.component.html',
  styleUrls: ['./banner-image.component.css']
})
export class BannerImageComponent implements OnInit {

  file_type:any;
  type_valid:boolean = false;

  selectedFile:any=[];
  imageUrl:string;
  file_data:any;
  file_name:string;
  file_size:number = 300001;
  acceptableImageArray = ['image/png','image/jpg','image/jpeg'];
  fileAccept:boolean;
  uploadImageUrl:any;
  fileInfos?: Observable<any>;

  getDataDetails:any = [];

  constructor(private http: HttpClient,public data:SharedDataService) {}

  ngOnInit(): void {
    this.getData();
    this.data.checkAccess('survey');
  }

  getData(){
      this.http.get(''+this.data.apiDomainPathDash+'getHeaderImages',{}) // Get Home page details
      .subscribe(data => {
        console.log(data);
        this.data.hideLoader();
        
        this.getDataDetails = data;
        this.imageUrl = this.getDataDetails.response[0].image1;
      },
      err => {
        // Swal.fire(err);
      });
  }

  bannerImage(event:any){
    if(event.target.files.length > 0){
      this.fileAccept = false;
      this.selectedFile = event.target.files[0]
      this.file_name = this.selectedFile.name;
      this.file_size = this.selectedFile.size;
      let fileType = this.selectedFile.type;
      if(this.acceptableImageArray.includes(fileType)){
        const reader = new FileReader();
        this.type_valid = true;
        // this.imagePath = files;
        reader.readAsDataURL(this.selectedFile); 
        reader.onload = () => { 
            
            const img = new Image();
            img.src = reader.result as string;
            img.onload = () => {
                const height = img.naturalHeight;
                const width = img.naturalWidth;
                console.log('Width and Height', width, height);
              // if((width>=2000 && width<=2100 && height>=700 && height<=1024)){
                this.fileAccept= true; 
                this.uploadImageUrl = reader.result; 
              // } else{
              //   this.data.firePopup(false,'Please upload HD image (2048 x 768)');
              //   this.fileAccept= false;
              // }
            };
        }
      } else{
        this.data.firePopup(false,'Please upload only PNG/JPEG format');
        this.fileAccept = false;
      }
    }
    console.log(this.selectedFile);
  }


  uplodInfo:any =[];
  editHeaderImage(){
    var uploadData;
    if(this.fileAccept){
      uploadData = new FormData();
      uploadData.append('image1', this.selectedFile, this.selectedFile.name);
    }
    else {
      this.data.firePopup(false,'Please select an image');
      return;
    }
    this.data.showLoader();
    this.http.post(''+this.data.apiDomainPathDash+'editHeaderImages',uploadData) // set logo details
    .subscribe(data => {
      console.log(data);
      this.uplodInfo = data;
      this.data.hideLoader();
      if(this.uplodInfo.responseCode == "200"){
        this.fileAccept = false;
        this.data.firePopup(true,'Data Updated');
        this.getData();
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
