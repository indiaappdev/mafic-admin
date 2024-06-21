import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SharedDataService } from 'src/app/shared/shared-data.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-third-section',
  templateUrl: './third-section.component.html',
  styleUrls: ['./third-section.component.css']
})
export class ThirdSectionComponent implements OnInit {

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

  content = new FormControl('', [Validators.required]);
  header = new FormControl('', [Validators.required]);
  point1 = new FormControl('', [Validators.required]);
  point2 = new FormControl('', [Validators.required]);
  point3 = new FormControl('', [Validators.required]);
  number1 = new FormControl('');
  number2 = new FormControl('');
  number3 = new FormControl('');
  number4 = new FormControl('');
  text1 = new FormControl('');
  text2 = new FormControl('');
  text3 = new FormControl('');
  text4 = new FormControl('');
  imageUrl:string;

  public thirdForm: FormGroup = new FormGroup({
    content: this.content,
    header: this.header,
    point1: this.point1,
    point2: this.point2,
    point3: this.point3,
    number1: this.number1,
    number2: this.number2,
    number3:this.number3,
    number4:this.number4,
    text1:this.text1,
    text2:this.text2,
    text3:this.text3,
    text4:this.text4
  });

  constructor(private http: HttpClient, private router:Router,
    public data:SharedDataService) {}

  ngOnInit(): void {
    this.third();
  }

  third(){
    this.http.get(''+this.data.apiDomainPathDash+'aboutUs/getAboutSectionThree') // Get About us details
    .subscribe(data => {
      console.log(data);
      this.data.hideLoader();
      
      this.thirdDetails = data;
      this.thirdDetails = this.thirdDetails.response[0];

      this.content.reset(this.thirdDetails.content);
      this.header.reset(this.thirdDetails.title);
      this.point1.reset(this.thirdDetails.point1);
      this.point2.reset(this.thirdDetails.point2);
      this.point3.reset(this.thirdDetails.point3);
      this.number1.reset(this.thirdDetails.number1);
      this.number2.reset(this.thirdDetails.number2);
      this.number3.reset(this.thirdDetails.number3);
      this.number4.reset(this.thirdDetails.number4);
      this.text1.reset(this.thirdDetails.text1);
      this.text2.reset(this.thirdDetails.text2);
      this.text3.reset(this.thirdDetails.text3);
      this.text4.reset(this.thirdDetails.text4);
      this.imageUrl = this.thirdDetails.image;
    },
    err => {
      // Swal.fire(err);
    });
  }

  validateFormFields() {
    if (this.header.hasError('required') ||this.content.hasError('required') || this.point1.hasError('required') || this.point2.hasError('required') || this.point3.hasError('required')) {
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
                if(width>=600 && height>650){
                this.fileAccept= true; 
                this.uploadImageUrl = reader.result; 
                } else{
                this.data.firePopup(false,'Please upload HD image (600 x 650)');
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
  editThirdSection(){
    var uploadData;
    uploadData = new FormData();
    if(this.fileAccept){
      uploadData.append('image', this.selectedFile, this.selectedFile.name);
    }
      uploadData.append('title', this.header.value);
      uploadData.append('content', this.content.value);
      uploadData.append('point1', this.point1.value);
      uploadData.append('point2', this.point2.value);
      uploadData.append('point3', this.point3.value);
      uploadData.append('number1', this.number1.value);
      uploadData.append('number2', this.number2.value);
      uploadData.append('number3', this.number3.value);
      uploadData.append('number4', this.number4.value);
      uploadData.append('text1', this.text1.value);
      uploadData.append('text2', this.text2.value);
      uploadData.append('text3', this.text3.value);
      uploadData.append('text4', this.text4.value);
    this.data.showLoader();
    this.http.post(''+this.data.apiDomainPathDash+'aboutUs/aboutSectionThree',uploadData) // Get user details
    .subscribe(data => {
      console.log(data);
      this.uplodInfo = data;
      this.data.hideLoader();
      this.third();
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
