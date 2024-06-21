import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SharedDataService } from 'src/app/shared/shared-data.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-fifth-section',
  templateUrl: './fifth-section.component.html',
  styleUrls: ['./fifth-section.component.css']
})
export class FifthSectionComponent implements OnInit {

  thirdDetails:any = [];

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
  point1 = new FormControl('', [Validators.required]);
  point2 = new FormControl('', [Validators.required]);
  point3 = new FormControl('');
  point4 = new FormControl('');
  point5 = new FormControl('');
  point6 = new FormControl('');
  point7 = new FormControl('');
  imageUrl:string;

  public fifthForm: FormGroup = new FormGroup({
    header: this.header,
    point1: this.point1,
    point2: this.point2,
    point3: this.point3,
    point4: this.point4,
    point5: this.point5,
    point6: this.point6,
    point7: this.point7,
  });

  constructor(private http: HttpClient, private router:Router,
    public data:SharedDataService) {}

  ngOnInit(): void {
    this.five();
  }

  five(){
    this.http.get(''+this.data.apiDomainPathDash+'aboutUs/getAboutSectionFive') // Get About us details
  .subscribe(data => {
    console.log(data);
    this.data.hideLoader();
    
    this.thirdDetails = data;
    this.thirdDetails = this.thirdDetails.response[0];

    this.header.reset(this.thirdDetails.title);
    this.point1.reset(this.thirdDetails.point1);
    this.point2.reset(this.thirdDetails.point2);
    this.point3.reset(this.thirdDetails.point3);
    this.point4.reset(this.thirdDetails.point4);
    this.point5.reset(this.thirdDetails.point5);
    this.point6.reset(this.thirdDetails.point6);
    this.point7.reset(this.thirdDetails.point7);
    this.imageUrl = this.thirdDetails.image;
  },
  err => {
    // Swal.fire(err);
  });
  }

  validateFormFields() {
    if (this.header.hasError('required') || this.point1.hasError('required') || this.point2.hasError('required') || this.point3.hasError('required') || this.point4.hasError('required') || this.point5.hasError('required') || this.point6.hasError('required') || this.point7.hasError('required')) {
      return 'Mandatory field';
    } else
    return '';
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
                if(width>=650 && height>=650){
                this.fileAccept= true; 
                this.uploadImageUrl = reader.result; 
                } else{
                this.data.firePopup(false,'Please upload HD image (650 x 650)');
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
  uplodInfo:any =[];
  editFifthSection(){
    var uploadData;
    uploadData = new FormData();
    if(this.fileAccept){
      uploadData.append('image', this.selectedFile, this.selectedFile.name);
    }
      uploadData.append('title', this.header.value);
      uploadData.append('point1', this.point1.value);
      uploadData.append('point2', this.point2.value);
      uploadData.append('point3', this.point3.value);
      uploadData.append('point4', this.point4.value);
      uploadData.append('point5', this.point5.value);
      uploadData.append('point6', this.point6.value);
      uploadData.append('point7', this.point7.value);
    this.data.showLoader();
    this.http.post(''+this.data.apiDomainPathDash+'aboutUs/aboutSectionFive',uploadData) // Get user details
    .subscribe(data => {
      console.log(data);
      this.uplodInfo = data;
      this.data.hideLoader();
      this.five();
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
