import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SharedDataService } from 'src/app/shared/shared-data.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home-last-sec',
  templateUrl: './home-last-sec.component.html',
  styleUrls: ['./home-last-sec.component.css']
})
export class HomeLastSecComponent implements OnInit {

  lifeatCompetiton:any=[];

  file_type:any;
  type_valid:boolean = false;

  selectedFile:any=[];
  selectedFile2: File;
  selectedFile3: File;
  selectedFile4: File;
  selectedFile5: File;
  selectedFile6: File;
  selectedFile7: File;
  file_data:any;
  file_name:any = [];
  file_size:number = 300001;
  acceptableImageArray = ['image/png','image/jpg','image/jpeg'];
  fileAccept:any=[];
  uploadImageUrl:any = [];
  fileInfos?: Observable<any>;

  header = new FormControl('', [Validators.required]);
  pText1 = new FormControl('', [Validators.required]);
  pText2 = new FormControl('', [Validators.required]);
  imageUrl1:string;
  imageUrl2:string;
  imageUrl3:string;
  imageUrl4:string;
  imageUrl5:string;
  imageUrl6:string;
  imageUrl7:string;

  public firstForm: FormGroup = new FormGroup({
    header: this.header,
    pText1: this.pText1,
    pText2: this.pText2
  });

  constructor(private http: HttpClient, private router:Router,
    public data:SharedDataService) {}

  ngOnInit(): void {
    this.hLast();
  }

  hLast(){
    this.http.post(''+this.data.apiDomainPathDash+'getHomePageContent',{}) // Get Home page details
    .subscribe(data => {
      console.log(data);
      this.data.hideLoader();
      
      this.lifeatCompetiton = data;
      this.lifeatCompetiton = this.lifeatCompetiton.response[0];

      this.header.reset(this.lifeatCompetiton.h2Title);
      this.pText2.reset(this.lifeatCompetiton.h3GreenContent);
      this.pText1.reset(this.lifeatCompetiton.h4Content);
      this.imageUrl1 = this.lifeatCompetiton.image1;
      this.imageUrl2 = this.lifeatCompetiton.image2;
      this.imageUrl3 = this.lifeatCompetiton.image3;
      this.imageUrl4 = this.lifeatCompetiton.image4;
      this.imageUrl5 = this.lifeatCompetiton.image5;
      this.imageUrl6 = this.lifeatCompetiton.image6;
      this.imageUrl7 = this.lifeatCompetiton.image7;
    },
    err => {
      // Swal.fire(err);
    });
  }

  validateFormFields() {
    if (this.pText1.hasError('required') || this.pText2.hasError('required') || this.header.hasError('required')) {
      return 'Mandatory field';
    } else
    return '';
  }

  bannerImage(event:any,index:number){
    if(event.target.files.length > 0){
      this.fileAccept[index] = false;
      this.selectedFile[index] = event.target.files[0];
      this.file_name = this.selectedFile[index].name;
      this.file_size = this.selectedFile[index].size;
      let fileType = this.selectedFile[index].type;
      if(this.acceptableImageArray.includes(fileType)){
        const reader = new FileReader();
        this.type_valid = true;
        // this.imagePath = files;
        reader.readAsDataURL(this.selectedFile[index]); 
        reader.onload = () => { 
            
            const img = new Image();
            img.src = reader.result as string;
            img.onload = () => {
              const height = img.naturalHeight;
              const width = img.naturalWidth;
              console.log('Width and Height', width, height);
              if(width>=230 && height>=200){
                this.fileAccept[index]= true; 
                this.uploadImageUrl[index] = reader.result; 
              } else{
                this.data.firePopup(false,'Please upload HD image (230 x 200)');
                this.fileAccept[index]= false;
              }
            };
        }
      } else{
        this.data.firePopup(false,'Please upload only PNG/JPEG format');
        this.fileAccept[index]= false;
      }
    }
    console.log(this.selectedFile[index]);
  }

  uplodInfo:any =[];
  editLastSection(){
    var uploadData;
    uploadData = new FormData();
    for(let i = 0;i < this.fileAccept.length;i++)
    if(this.fileAccept[i]){
      uploadData.append('image'+(i+1), this.selectedFile[i], this.selectedFile[i].name);
    }
      uploadData.append('h2Title', this.header.value);
      uploadData.append('h3GreenContent', this.pText2.value);
      uploadData.append('h4Content', this.pText1.value);
    this.data.showLoader();
    this.http.post(''+this.data.apiDomainPathDash+'editHomePageContent',uploadData) // Get user details
    .subscribe(data => {
      console.log(data);
      this.uplodInfo = data;
      this.data.hideLoader();
      this.hLast();
      if(this.uplodInfo.responseCode == "200"){
        this.data.firePopup(true,'Data Updated');
        for(let i = 0;i < this.fileAccept.length;i++){
          this.fileAccept[i] = false;
          this.uploadImageUrl[i] = ''
          this.selectedFile[i] = null;
        }
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


