import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common'
import { SharedDataService } from 'src/app/shared/shared-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-add-team',
  templateUrl: './add-team.component.html',
  styleUrls: ['./add-team.component.css']
})
export class AddTeamComponent implements OnInit {

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

  name = new FormControl('', [Validators.required]);
  profession = new FormControl('', [Validators.required]);
  experience = new FormControl('', [Validators.required]);
  about = new FormControl('', [Validators.required]);
  


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
                if(width>=150 && height>=150 && width<=200 && height<=200){
                  this.fileAccept= true; 
                  this.uploadImageUrl = reader.result; 
                  } else{
                  this.data.firePopup(false,'Please upload HD Circle image (150 x 150)');
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

  formFilled:boolean = false;

  public addTeamForm: FormGroup = new FormGroup({
    name: this.name,
    exprnc: this.experience,
    profs: this.profession,
    about:this.about
  });

  constructor(private http: HttpClient,private location: Location, private router:Router,
              public data:SharedDataService) { }

  ngOnInit(): void {
    this.data.hideLoader();
  }

  validateFormFields() {
    if (this.name.hasError('required') || this.profession.hasError('required') || this.about.hasError('required') || this.experience.hasError('required')) {
      return 'Mandatory field';
    } else
    return '';
  }

  uplodInfo:any =[];
  addTeamSection(){
    var uploadData;
    if(this.fileAccept){
      uploadData = new FormData();
      uploadData.append('image', this.selectedFile, this.selectedFile.name);
      uploadData.append('name', this.name.value);
      uploadData.append('profession', this.profession.value);
      uploadData.append('experience', this.experience.value);
      uploadData.append('content', this.about.value);
    }
    else
    {
      uploadData = new FormData();
      uploadData.append('name', this.name.value);
      uploadData.append('profession', this.profession.value);
      uploadData.append('experience', this.experience.value);
      uploadData.append('content', this.about.value);
    }
    this.data.showLoader();
    this.http.post(''+this.data.apiDomainPathDash+'aboutUs/addTeamSection',uploadData) // set element details
    .subscribe(data => {
      console.log(data);
      this.uplodInfo = data;
      this.data.hideLoader();
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