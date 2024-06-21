import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SharedDataService } from 'src/app/shared/shared-data.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-second-section',
  templateUrl: './second-section.component.html',
  styleUrls: ['./second-section.component.css']
})
export class SecondSectionComponent implements OnInit {
  
  secondDetails:any = [];

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

  title = new FormControl('', [Validators.required]);
  pText1 = new FormControl('', [Validators.required]);
  pText2 = new FormControl('', [Validators.required]);
  pText3 = new FormControl('', [Validators.required]);
  hText1 = new FormControl('', [Validators.required]);
  hText2 = new FormControl('', [Validators.required]);
  hText3 = new FormControl('', [Validators.required]);
  imageUrl:string;

  public secondForm: FormGroup = new FormGroup({
    title:this.title,
    pText1: this.pText1,
    pText2: this.pText2,
    pText3: this.pText3,
    hText1: this.hText1,
    hText2: this.hText2,
    hText3: this.hText3
  });

  constructor(private http: HttpClient, private router:Router,
    public data:SharedDataService) {}

  ngOnInit(): void {
    this.second();
  }

  second(){
    this.http.get(''+this.data.apiDomainPathDash+'aboutUs/getAboutSectionTwo') // Get About us details
    .subscribe(data => {
      console.log(data);
      this.data.hideLoader();
      
      this.secondDetails = data;
      this.secondDetails = this.secondDetails.response[0];

      this.title.reset(this.secondDetails.title);
      this.pText1.reset(this.secondDetails.h5Content1);
      this.pText2.reset(this.secondDetails.h5Content2);
      this.pText3.reset(this.secondDetails.h5Content3);
      this.hText1.reset(this.secondDetails.h5Title1);
      this.hText2.reset(this.secondDetails.h5Title2);
      this.hText3.reset(this.secondDetails.h5Title3);
      this.imageUrl = this.secondDetails.image
    },
    err => {
      // Swal.fire(err);
    });
  }

  validateFormFields() {
    if (this.title.hasError('required') || this.pText3.hasError('required') || this.pText1.hasError('required') || this.pText2.hasError('required') || this.hText3.hasError('required') || this.hText2.hasError('required') || this.hText1.hasError('required') ) {
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
                if(width>=650 && height>650){
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
  editSecondSection(){
    var uploadData;
    if(this.fileAccept){
      uploadData = new FormData();
      uploadData.append('image', this.selectedFile, this.selectedFile.name);
      uploadData.append('title', this.title.value);
      uploadData.append('h5Title1', this.hText1.value);
      uploadData.append('h5Content1', this.pText1.value);
      uploadData.append('h5Title2', this.hText2.value);
      uploadData.append('h5Content2', this.pText2.value);
      uploadData.append('h5Title3', this.hText3.value);
      uploadData.append('h5Content3', this.pText3.value);
    }
    else
    {
      uploadData = new FormData();
      uploadData.append('title', this.title.value);
      uploadData.append('h5Title1', this.hText1.value);
      uploadData.append('h5Content1', this.pText1.value);
      uploadData.append('h5Title2', this.hText2.value);
      uploadData.append('h5Content2', this.pText2.value);
      uploadData.append('h5Title3', this.hText3.value);
      uploadData.append('h5Content3', this.pText3.value);
    }
    this.data.showLoader();
    this.http.post(''+this.data.apiDomainPathDash+'aboutUs/aboutSectionTwo',uploadData) // Get user details
    .subscribe(data => {
      console.log(data);
      this.uplodInfo = data;
      this.data.hideLoader();
      this.second();
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
