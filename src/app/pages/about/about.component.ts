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
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})

export class AboutComponent implements OnInit {
 
  aboutDetails:any=[];
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
  heading = new FormControl('', [Validators.required]);
  pText = new FormControl('', [Validators.required]);
  number1 = new FormControl('');
  number2 = new FormControl('');
  number3 = new FormControl('');
  number4 = new FormControl('');
  text1 = new FormControl('');
  text2 = new FormControl('');
  text3 = new FormControl('');
  text4 = new FormControl('');

  uplodInfo:any = [];

  formFilled:boolean = false;

  public addUserForm: FormGroup = new FormGroup({
    // image: this.image,
    pText:this.pText,
    header: this.header,
    heading: this.heading,
    number1: this.number1,
    number2: this.number2,
    number3: this.number3,
    number4: this.number4,
    text1:this.text1,
    text2:this.text2,
    text3:this.text3,
    text4:this.text4
  });

  banner_text:any;
  dataB = {
    image:""
  }
  constructor(private http: HttpClient,private location: Location, private router:Router,
              public data:SharedDataService, private snak:MatSnackBar) { 

              }

  ngOnInit(): void {
    this.data.hideLoader();
    this.getabout();
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
                if(width>=400 && height>500){
                this.fileAccept= true; 
                this.uploadImageUrl = reader.result; 
                } else{
                this.data.firePopup(false,'Please upload HD image (400 x 500)');
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

  getabout(){
    this.http.get(''+this.data.apiDomainPathDash+'getWhyChooseUs') // Get user details
    .subscribe(data => {
      console.log(data);
      this.data.hideLoader();
      
      this.aboutDetails = data;
      this.aboutDetails = this.aboutDetails.response[0];

      this.header.reset(this.aboutDetails.h2Content);
      this.heading.reset(this.aboutDetails.h3Content);
      this.pText.reset(this.aboutDetails.pContent);
      this.number1.reset(this.aboutDetails.number1);
      this.number2.reset(this.aboutDetails.number2);
      this.number3.reset(this.aboutDetails.number3);
      this.number4.reset(this.aboutDetails.number4);
      this.text1.reset(this.aboutDetails.text1);
      this.text2.reset(this.aboutDetails.text2);
      this.text3.reset(this.aboutDetails.text3);
      this.text4.reset(this.aboutDetails.text4);
      this.dataB.image = this.aboutDetails.image;
      console.log(this.dataB.image);
    },
    err => {
      // Swal.fire(err);
    });
  }

  validateFormFields() {
    if (this.pText.hasError('required') || this.heading.hasError('required') || this.header.hasError('required') || this.number1.hasError('required') || this.number2.hasError('required') || this.number3.hasError('required'))
      return 'Mandatory field';
      else
      return ''
  }

  
  
  editWhyChoose(){
      var uploadData;
      uploadData = new FormData();
      if(this.fileAccept){
        uploadData.append('image', this.selectedFile, this.selectedFile.name);
      }
        uploadData.append('h2Content', this.header.value);
        uploadData.append('h3Content', this.heading.value);
        uploadData.append('pContent', this.pText.value);
        uploadData.append('number1', this.number1.value);
        uploadData.append('number2', this.number2.value);
        uploadData.append('number3', this.number3.value);
        uploadData.append('number4', this.number4.value);
        uploadData.append('text1', this.text1.value);
        uploadData.append('text2', this.text2.value);
        uploadData.append('text3', this.text3.value);
        uploadData.append('text4', this.text4.value);
      this.data.showLoader();
      this.http.post(''+this.data.apiDomainPathDash+'whyChooseUs',uploadData) // set about details
      .subscribe(data => {
        console.log(data);
        this.uplodInfo = data;
        this.data.hideLoader();
        // this.router.navigate(['/about']);
        this.getabout();
        if(this.uplodInfo.responseCode == "200"){
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

