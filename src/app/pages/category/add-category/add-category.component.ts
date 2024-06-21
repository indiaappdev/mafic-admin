import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common'
import { SharedDataService } from 'src/app/shared/shared-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.css']
})

export class AddCategoryComponent implements OnInit {

  file_type:any;
  type_valid:boolean = false;

  selectedFile: File;
  file_data:any;
  file_name:string = '';
  file_size:number = 800001;
  acceptableImageArray = ['image/png','image/jpg','image/jpeg'];
  fileAccept:boolean= false;
  uploadImageUrl:any = '';
  fileInfos?: Observable<any>;

  text = new FormControl('', [Validators.required]);


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
                if(width>=1024 && height>678){
                this.fileAccept= true; 
                this.uploadImageUrl = reader.result; 
                } else{
                this.data.firePopup(false,'Please upload HD image (1024 x 678)');
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

  public addUserForm: FormGroup = new FormGroup({
    text: this.text
  });

  constructor(private http: HttpClient,private location: Location, private router:Router,
              public data:SharedDataService, private snak:MatSnackBar) { }

  ngOnInit(): void {
    this.data.hideLoader();
  }

  validateFormFields() {
    if (this.text.hasError('required')) {
      return 'Mandatory field';
    } else
    return '';
  }

  uplodInfo:any = [];
  addCategory(){
      var uploadData;
      if(this.fileAccept){
        uploadData = new FormData();
        uploadData.append('image', this.selectedFile, this.selectedFile.name);
        uploadData.append('text', this.text.value);
      } else{
        this.data.firePopup(false,'Please upload image');
        return;
      }
      this.data.showLoader();
      this.http.post(''+this.data.apiDomainPathDash+'addCategory',uploadData) // Get user details
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

