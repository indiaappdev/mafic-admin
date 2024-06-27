import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { SharedDataService } from 'src/app/shared/shared-data.service';


@Component({
  selector: 'app-add-product-category',
  templateUrl: './add-product-category.component.html',
  styleUrls: ['./add-product-category.component.css']
})
export class AddProductCategoryComponent implements OnInit {
  imageUrl: string | ArrayBuffer | null = null;

  constructor(private http: HttpClient, public data: SharedDataService,
    private dialog: MatDialog) {
 }

  selectedFile: any = [];
  file_name: string;
  file_size: number = 300001;
  acceptableImageArray = ['image/png', 'image/jpg', 'image/jpeg'];
  fileAccept: boolean;
  type_valid: boolean = false;


  ngOnInit(): void {
  }

  formData = {
    category: '',
    image: null as File | null  // Type assertion for file input
  };

  imgValidation(event: Event | any) {
    const inputElement = event.currentTarget as HTMLInputElement;
    if (inputElement && inputElement.files && inputElement.files.length > 0) {
      this.fileAccept = true;
      this.selectedFile = inputElement.files[0];
      console.log(this.selectedFile)
      this.file_name = this.selectedFile.name;
      this.file_size = this.selectedFile.size;
      let fileType = this.selectedFile.type;
      if (this.acceptableImageArray.includes(fileType)) {
        const reader = new FileReader();
        this.type_valid = true;
        // this.imagePath = files;
        reader.readAsDataURL(this.selectedFile);
        if (this.selectedFile) {
          const reader = new FileReader();
          reader.onload = (e: any) => {
            this.imageUrl = e.target.result;
          };
          reader.readAsDataURL(this.selectedFile);
        }
      } else {
        this.data.firePopup(false, 'Please upload only PNG/JPEG format');
        this.fileAccept = false;
      }
    }
    console.log(this.selectedFile);
  }

  submitForm(form: NgForm) {
    if (form.valid) {
      this.addProductCategory();
    }
    else {
      console.log('Form is invalid.');
    }
  }

  addProductCategory() {
    this.data.showLoader();
    var uploadData;
    if (this.fileAccept) {
      uploadData = new FormData();
      console.log(this.selectedFile)
      uploadData.append('image', this.selectedFile)
      uploadData.append('text', this.formData.category);
      this.http.post('https://api.themafic.com/api/MaficDashboard/addProductCategory', uploadData)
        .subscribe(data => {
          console.log(data);
          this.data.hideLoader();
          this.dialog.closeAll();
        },
          error => { },
          () => { });
    }
    else {
      this.data.firePopup(false, 'Please select an image');
      return;
    }


  }



  cancelForm() {
    console.log('Form canceled.');
    this.dialog.closeAll();
  }



}
