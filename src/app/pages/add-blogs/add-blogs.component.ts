
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common'
import { SharedDataService } from 'src/app/shared/shared-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import {MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-blogs',
  templateUrl: './add-blogs.component.html',
  styleUrls: ['./add-blogs.component.css']
})

export class AddBlogsComponent implements OnInit {

  selectedFile:any=[];
  file_name:string;
  file_size:any;
  file_type:any;
  type_valid:boolean = false;

  title = new FormControl('', [Validators.required]);
  description = new FormControl('', [Validators.required]);
  image = new FormControl('', [Validators.required]);


  blogsImage(event:any){
    if(event.target.files.length > 0){
      this.selectedFile = event.target.files[0]
      this.file_name = this.selectedFile.name;
      this.file_size = this.selectedFile.size;
      this.file_type = this.selectedFile.type;
      this.file_size = this.file_size/1000;
      console.log(this.file_type);

      if (this.file_type == "image/jpeg" || this.file_type == "image/png"){
        this.type_valid = true;
     }

      
    }
  }
  
  formFilled:boolean = false;
  

  public addUserForm: FormGroup = new FormGroup({
    image: this.image,
    title: this.title,
    description: this.description
  });

  constructor(private http: HttpClient,private location: Location, private router:Router,
              private data:SharedDataService, private snak:MatSnackBar) { }

  ngOnInit(): void {
    this.data.hideLoader();
  }

  validateFormFields() {
    if (this.title.hasError('required') || this.description.hasError('required') || this.image.hasError('required') ) {
      this.formFilled = false;
      return 'Mandatory field';
    } else
    this.formFilled = true;
    // return this.type.hasError('email') ? 'Not a valid email' : '';
    return 1;
  }

 

  addBlogs(){

    if (this.type_valid == false){
       this.snak.open("Image should be jpg, png ","OK", {"duration": 2000})
    }
    else if (this.file_size >2000 ){
      this.snak.open("Image should be less than 2 MB ","OK", {"duration": 2000})
   }
    else{
      let uData = {
        title:this.title.value, 
        description:this.description.value, 
        image:this.image.value
      }
      var uploadData;
      if(this.selectedFile != undefined){
        uploadData = new FormData();
        uploadData.append('image', this.selectedFile, this.selectedFile.name);
        console.log(uploadData);
        uploadData.append('title', this.title.value);
        uploadData.append('description', this.description.value);
      }
      this.data.showLoader();
      console.log(uData);
      this.http.post(''+this.data.apiDomainPathDash+'AddBlogs',uploadData) // Get user details
      .subscribe(data => {
        console.log(data);
        this.snak.open("data Successfully inserted ","OK", {"duration": 4000})
        this.data.hideLoader();
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

