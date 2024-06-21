import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SharedDataService } from 'src/app/shared/shared-data.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-first-section',
  templateUrl: './first-section.component.html',
  styleUrls: ['./first-section.component.css']
})
export class FirstSectionComponent implements OnInit {

  firstDetails:any=[];

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

  pText1 = new FormControl('', [Validators.required]);
  title = new FormControl('', [Validators.required]);
  imageUrl:string;

  public firstForm: FormGroup = new FormGroup({
    title: this.title,
    pText1: this.pText1
  });

  constructor(private http: HttpClient, private router:Router,
    public data:SharedDataService) {}

  ngOnInit(): void {
    this.first();
  }

  first(){
    this.http.get(''+this.data.apiDomainPathDash+'aboutUs/getSectionOne') // Get About us details
    .subscribe(data => {
      console.log(data);
      this.data.hideLoader();
      
      this.firstDetails = data;
      this.firstDetails = this.firstDetails.response[0];

      this.pText1.reset(this.firstDetails.content);
      this.title.reset(this.firstDetails.title);
      this.imageUrl = this.firstDetails.image
    },
    err => {
      // Swal.fire(err);
    });
  }

  validateFormFields() {
    if (this.pText1.hasError('required') || this.title.hasError('required')) {
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
                if(width>=800 && height>500){
                this.fileAccept= true; 
                this.uploadImageUrl = reader.result; 
                } else{
                this.data.firePopup(false,'Please upload HD image (800 x 500)');
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
  editFirstSection(){
    var uploadData;
    if(this.fileAccept){
      uploadData = new FormData();
      uploadData.append('image', this.selectedFile, this.selectedFile.name);
      uploadData.append('content', this.pText1.value);
      uploadData.append('title', this.title.value);
    }
    else
    {
      uploadData = new FormData();
      uploadData.append('content', this.pText1.value);
      uploadData.append('title', this.title.value);
    }
    this.data.showLoader();
    this.http.post(''+this.data.apiDomainPathDash+'aboutUs/aboutSectionOne',uploadData) // Get user details
    .subscribe(data => {
      console.log(data);
      this.uplodInfo = data;
      this.data.hideLoader();
      this.first();
      if(this.uplodInfo.responseCode == "200"){
        this.fileAccept = false;
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
