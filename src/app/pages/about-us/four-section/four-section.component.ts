import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SharedDataService } from 'src/app/shared/shared-data.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-four-section',
  templateUrl: './four-section.component.html',
  styleUrls: ['./four-section.component.css']
})
export class FourSectionComponent implements OnInit {

  fourthDetails:any = [];

  file_type:any;
  type_valid:boolean = false;

  selectedFile: File;
  file_data:any;
  file_name:string = '';
  file_size:number = 300001;
  acceptableImageArray = ['image/png','image/jpg','image/jpeg'];
  fileAccept:boolean= false;
  uploadImageUrl:any = '';
  fileInfos?: Observable<any>;

  header = new FormControl('', [Validators.required]);
  content = new FormControl('', [Validators.required]);
  point1 = new FormControl('', [Validators.required]);
  point2 = new FormControl('', [Validators.required]);
  point3 = new FormControl('', [Validators.required]);
  imageUrl:string;

  public thirdForm: FormGroup = new FormGroup({
    content: this.content,
    header: this.header,
    point1: this.point1,
    point2: this.point2,
    point3: this.point3
  });

  constructor(private http: HttpClient, private router:Router,
    public data:SharedDataService) {}

  ngOnInit(): void {
    this.four();
  }

  four(){
    this.http.get(''+this.data.apiDomainPathDash+'aboutUs/getAboutSectionFour') // Get About us details
    .subscribe(data => {
      console.log(data);
      this.data.hideLoader();
      
      this.fourthDetails = data;
      this.fourthDetails = this.fourthDetails.response[0];

      this.content.reset(this.fourthDetails.pTitle);
      this.header.reset(this.fourthDetails.h1Title);
      this.point1.reset(this.fourthDetails.content1);
      this.point2.reset(this.fourthDetails.content2);
      this.point3.reset(this.fourthDetails.content3);
      this.imageUrl = this.fourthDetails.image;
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
                if(width>=1024 && height>768){
                this.fileAccept= true; 
                this.uploadImageUrl = reader.result; 
                } else{
                this.data.firePopup(false,'Please upload HD image (1024 x 768)');
                this.fileAccept= false;
                }
            };
        }
      } else{
        this.data.firePopup(false,'Please upload only PNG/JPEG format');
        this.fileAccept= false;
      }
    }
    console.log(this.selectedFile);
  }

  validateFormFields() {
    if (this.header.hasError('required') ||this.content.hasError('required') || this.point1.hasError('required') || this.point2.hasError('required') || this.point3.hasError('required') ) {
      return 'Mandatory field';
    } else
    return '';
  }
 
  uplodInfo:any =[];
  editFourthSection(){
    var uploadData;
    uploadData = new FormData();
    if(this.fileAccept){
      uploadData.append('image', this.selectedFile, this.selectedFile.name);
    }
      uploadData.append('h1Title', this.header.value);
      uploadData.append('pTitle', this.content.value);
      uploadData.append('content1', this.point1.value);
      uploadData.append('content2', this.point2.value);
      uploadData.append('content3', this.point3.value);
      uploadData.append('imageName', this.fourthDetails.imageName);
    this.data.showLoader();
    this.http.post(''+this.data.apiDomainPathDash+'aboutUs/aboutSectionFour',uploadData) // Get user details
    .subscribe(data => {
      console.log(data);
      this.uplodInfo = data;
      this.data.hideLoader();
      this.four();
      if(this.uplodInfo.responseCode == "200"){
        this.data.firePopup(true,'Data Updated');
        this.fileAccept = false;
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