
import { Component, OnInit, Inject  } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common'
import { SharedDataService } from 'src/app/shared/shared-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-blogs',
  templateUrl: './edit-blogs.component.html',
  styleUrls: ['./edit-blogs.component.css']
})

export class EditBlogsComponent implements OnInit {

  selectedFile:any=[];
  file_name:string;
  file_size:any;
  file_type:any;
  type_valid:boolean = false;

  title = new FormControl('', [Validators.required]);
  description = new FormControl('', [Validators.required]);
  // image = new FormControl('', [Validators.required]);


  blogsImage(event:any){
    if(event.target.files.length > 0){
      this.selectedFile = event.target.files[0]
      this.file_name = this.selectedFile.name;
      this.file_size = this.selectedFile.size;
      this.file_type = this.selectedFile.type;
      this.file_size = this.file_size/1000;
      console.log(this.selectedFile);
      if (this.file_type == "image/jpeg" || this.file_type == "image/png"){
        this.type_valid = true;
     }
    }
  }

  formFilled:boolean = false;

  public addUserForm: FormGroup = new FormGroup({
    // image: this.image,
    title: this.title,
    description: this.description
  });

  banner_text:any;
  dataB = {
    title:"",
    description:"",
    id:""
  }
  constructor(private http: HttpClient,private location: Location, private router:Router,
              private data:SharedDataService, private snak:MatSnackBar, public dialogRef: MatDialogRef<EditBlogsComponent>,
              @Inject(MAT_DIALOG_DATA) public data1: any) { 
                // console.log('data', this.data1.bannerData.id);
                console.log(this.data1.bannerData.title);
                this.banner_text = this.data1.bannerData.title;
                this.dataB.title = this.data1.bannerData.title;
                this.dataB.description = this.data1.bannerData.description;
                this.dataB.id = this.data1.bannerData.id;
                // this.id  = this.data.bannerData.id;
              }

  ngOnInit(): void {
    this.data.hideLoader();
  }

  validateFormFields() {
    if (this.title.hasError('required') ) {
      this.formFilled = false;
      return 'Mandatory field';
    } else
    this.formFilled = true;
    return 1;
  }

  
  
  editBlogs(){
    if(this.file_name == undefined){
      this.type_valid = true;
      this.file_size = 1;
    }
    if (this.type_valid == false){
      this.snak.open("Image should be jpg, png ","OK", {"duration": 2000})
    }
    else if (this.file_size >2000 ){
      this.snak.open("Image should be less than 2 MB ","OK", {"duration": 2000})
    }
    else{

      var uploadData;
      if(this.file_name != undefined){
        uploadData = new FormData();
        uploadData.append('image', this.selectedFile, this.selectedFile.name);
        uploadData.append('title', this.title.value);
        uploadData.append('description', this.description.value);
        uploadData.append('id', this.dataB.id);
      }
      else
      {
        uploadData = new FormData();
        uploadData.append('title', this.title.value);
        uploadData.append('description', this.description.value);
        uploadData.append('id', this.dataB.id);
      }
      this.data.showLoader();
      this.http.post(''+this.data.apiDomainPathDash+'editBlogs',uploadData) // Get user details
      .subscribe(data => {
        console.log(data);
        this.snak.open("data Successfully Updated ","OK", {"duration": 3000})
        this.data.hideLoader();
        this.dialogRef.close();
        this.router.navigate(['/blogs']);
        
        // this.userDetails = data;
        // this.userDetails = this.userDetails.response.allUserData;
      },
      err => {
        // Swal.fire(err);
      });
  }
 }

}

