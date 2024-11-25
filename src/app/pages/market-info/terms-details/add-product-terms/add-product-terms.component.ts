import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { SharedDataService } from 'src/app/shared/shared-data.service';

@Component({
  selector: 'app-add-product-terms',
  templateUrl: './add-product-terms.component.html',
  styleUrls: ['./add-product-terms.component.css']
})
export class AddProductTermsComponent implements OnInit {
  ProductCategoryList: any;
  selectedCategoryId: any;
  fileInputs: { id: number, previewSrc: any }[] = [{ id: 1, previewSrc: '' }];
  res: any;
  hsn_code: any;
  imagePreviews: string[] = [];
  deliveryOptions=['Yes','No']
  productImages: any;
  formData: any;
  imgs: any=[];
  slugOptions: { slug: string, name: string }[] = [];
  selectedFile: File | null = null;

  constructor(public sharedDataService: SharedDataService,
    private dialog: MatDialog,
    private http: HttpClient,) { }

  ngOnInit(): void {
    this.formData = new FormGroup({
      // content: new FormControl('', Validators.required),
      // hsn_code: new FormControl('', Validators.required),
      slug: new FormControl('', Validators.required),
      title: new FormControl('', Validators.required),
    });
    this.getSACData();
    this.fetchSlugOptions();
  }

  fetchSlugOptions(): void {
    const apiUrl = 'https://api-dev.themafic.co.in/api/MaficDashboard/terms/details';
    this.http.get<any>(apiUrl).subscribe(response => {
      if (response.responseCode === 200 && response.response) {
        this.slugOptions = response.response; // Store the API response in slugOptions
      }
    }, error => {
      console.error('Error fetching slug options', error); // Handle the error
    });
  }

  cancelForm(){
    this.dialog.closeAll();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  submitForm(form: NgForm) {
    if (form.valid) {
      this.addProductData();
    }
    else {
      console.log('Form is invalid.');
    }
  }
  
  getSACData(){
    // this.sharedDataService.showLoader();
    // try {
    //   this.http.get('https://api.themafic.com/api/MaficDashboard/getHsnCode').subscribe(data => {
    //     console.log(data);
    //     this.res = JSON.parse(JSON.stringify(data));
    //     console.log(this.res)
    //     if (this.res.responseCode == 200) {
    //       this.sharedDataService.hideLoader();
    //        this.hsn_code = this.res.response;
    //       console.log(this.hsn_code)
    //     }

    //   }, error => { },
    //     () => {
    //     });

    // }
    // catch (error) {
    //   console.error("not able to get response from getProductCategory API")
    // }
  }

  addFileInput() {
    const newId = this.fileInputs.length ? this.fileInputs[this.fileInputs.length - 1].id + 1 : 1;
    this.fileInputs.push({ id: newId, previewSrc: '' });
  }

  removeFileInput(index: number) {
    this.fileInputs.splice(index, 1);
  }

  previewImage(event: Event, inputId: number) {
    const input = event.target as HTMLInputElement;
    const file = input.files ? input.files[0] : null;
    console.log(file)
    this.imgs.push(file);
    console.log(this.imgs)
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const fileInput = this.fileInputs.find(input => input.id === inputId);
        if (fileInput) {
          fileInput.previewSrc = e.target.result;
        }
      };
      reader.readAsDataURL(file);
    }
  }

  
  addProductData(){
    this.sharedDataService.showLoader();
    var uploadData;
    uploadData = new FormData();
    // uploadData.append('content', this.formData.content);
    // uploadData.append('hsn_code', this.formData.hsn_code);
    uploadData.append('slug', this.formData.slug);
    uploadData.append('title', this.formData.title);

    if (this.selectedFile) {
      uploadData.append('file', this.selectedFile, this.selectedFile.name);
    }

    this.http.post('https://api-dev.themafic.co.in/api/terms', uploadData)
      .subscribe(data => {
        console.log(data);
        this.sharedDataService.hideLoader();
        this.dialog.closeAll();
      },
      error => { },
      () => { });
  }
}
