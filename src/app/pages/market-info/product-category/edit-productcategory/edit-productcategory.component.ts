import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SharedDataService } from 'src/app/shared/shared-data.service';

@Component({
  selector: 'app-edit-productcategory',
  templateUrl: './edit-productcategory.component.html',
  styleUrls: ['./edit-productcategory.component.css']
})
export class EditProductcategoryComponent implements OnInit {



  selectedFile: any = [];
  file_name: string;
  file_size: number = 300001;
  acceptableImageArray = ['image/png', 'image/jpg', 'image/jpeg'];
  fileAccept: boolean;
  type_valid: boolean = false;

  editComplete: EventEmitter<any> = new EventEmitter();
  imageUrl: string | ArrayBuffer | null = null;

  formData = {
    id: '',
    text: this.data.element.category,
    image: null as File | null  // Type assertion for file input
  };

  constructor(private http: HttpClient,
    public shareddata: SharedDataService,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.imageUrl = data.element.images
  }

  ngOnInit(): void {
  }
  submitForm(form: NgForm) {
    if (form.valid) {
      this.EditProductItem();
    }
    else {
      console.log('Form is invalid.');
    }
  }
  onFileSelected(event: any) {
    //this.imgValidation(event);
    this.selectedFile = File = event.target.files[0];
    this.file_name = this.selectedFile.name;
    this.file_size = this.selectedFile.size;
    let fileType = this.selectedFile.type;
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imageUrl = e.target.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  EditProductItem() {
    var uploadData = new FormData();
    uploadData.append('image', this.selectedFile)
    uploadData.append('text', this.formData.text);
    uploadData.append('id', this.data.element.id);
    console.log(uploadData)
    this.http.post('https://api.themafic.com/api/MaficDashboard/editProductCategory', uploadData)
      .subscribe(data => {
        console.log(data);
        this.editComplete.emit();
        this.data.hideLoader();
        this.dialog.closeAll();
      },
        error => { },
        () => { });
  }

}
