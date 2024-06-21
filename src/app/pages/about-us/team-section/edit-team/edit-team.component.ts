import { Component, OnInit, Inject  } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common'
import { SharedDataService } from 'src/app/shared/shared-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-edit-team',
  templateUrl: './edit-team.component.html',
  styleUrls: ['./edit-team.component.css']
})
export class EditTeamComponent implements OnInit {

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
  id:any;

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

  banner_text:any;
  constructor(private http: HttpClient,private location: Location, private router:Router,
              public data:SharedDataService, private snak:MatSnackBar, public dialogRef: MatDialogRef<EditTeamComponent>,
              @Inject(MAT_DIALOG_DATA) public data1: any) { 
                // console.log('data', this.data1.bannerData.id);
                console.log(this.data1.categoryData);
                this.name.reset(this.data1.categoryData.name);
                this.profession.reset(this.data1.categoryData.profession);
                this.experience.reset(this.data1.categoryData.experience);
                this.about.reset(this.data1.categoryData.content);
                this.id = this.data1.categoryData.id;
              }

  ngOnInit(): void {
    this.data.hideLoader();
  }

  validateFormFields() {
    if (this.name.hasError('required') || this.profession.hasError('required') || this.experience.hasError('required') || this.about.hasError('required')) {
      return 'Mandatory field';
    } else
    return '';
  }

  uplodInfo:any = [];
  editTeamFunc(){
      var uploadData;
      if(this.fileAccept){
        uploadData = new FormData();
        uploadData.append('image', this.selectedFile, this.selectedFile.name);
        uploadData.append('name', this.name.value);
        uploadData.append('profession', this.profession.value);
        uploadData.append('experience', this.experience.value);
        uploadData.append('content', this.about.value);
        uploadData.append('id', this.id);
      }
      else
      {
        uploadData = new FormData();
        uploadData.append('name', this.name.value);
        uploadData.append('profession', this.profession.value);
        uploadData.append('experience', this.experience.value);
        uploadData.append('content', this.about.value);
        uploadData.append('id', this.id);
      }
      this.data.showLoader();
      this.http.post(''+this.data.apiDomainPathDash+'aboutUs/editTeamSection',uploadData) // Get user details
      .subscribe(data => {
        console.log(data);
        this.data.hideLoader();
        this.uplodInfo = data;
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

