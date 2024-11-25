import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SharedDataService } from 'src/app/shared/shared-data.service';

@Component({
  selector: 'app-edit-product-terms',
  templateUrl: './edit-product-terms.component.html',
  styleUrls: ['./edit-product-terms.component.css']
})
export class EditProductTermsComponent implements OnInit {
  ProductCategoryList: any;
  selectedCategoryId: any;  
  fileInputs: { id: number, images: any }[] = [{ id: 1, images: '' }];
  res: any;
  hsn_code: any;
  imagePreviews: string[] = [];
  deliveryOptions = ['Yes', 'No']
  productImages: any;
  formData: any;
  imgs: any = [];
  productID: any;
  SingleProductData: any;
  productData: any;
  productExistingImage: any;
  viewComplete: EventEmitter<any> = new EventEmitter();
  slugOptions: { slug: string, name: string }[] = [];
  selectedFile: File | null = null;

  isActiveOptions = [
    { label: 'Yes', value: 1 },
    { label: 'No', value: 0 }
  ]; // Dropdown options for Is Active
  
  constructor(public sharedDataService: SharedDataService,
    private dialog: MatDialog,
    private http: HttpClient,
    @Inject(MAT_DIALOG_DATA) public data: any,) {
    this.productID = data.element.id
    console.log("productID: ",this.productID);
  }

  ngOnInit(): void {
    this.ProductCategoryList = this.sharedDataService.ProductCategoryList
    this.getSACData();
    this.getSingleProductData();
    this.formData = new FormGroup({
      // content: new FormControl('', Validators.required),
      // hsn_code: new FormControl('', Validators.required),
      slug: new FormControl('', Validators.required),
      title: new FormControl('', Validators.required),
      // is_active: new FormControl(1, Validators.required),
    });
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

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  removeFile() {
    this.formData.existingFile = null;
    this.selectedFile = null;
  }

  cancelForm() {
    this.dialog.closeAll();
  }
  submitForm(form: NgForm) {
    if (form.valid) {
      this.addProductData();
    }
    else {
      console.log('Form is invalid.');
    }
  }
  getSACData() {
    this.sharedDataService.showLoader();
    try {
      this.http.get('https://api.themafic.com/api/MaficDashboard/getHsnCode').subscribe(data => {
        console.log(data);
        this.res = JSON.parse(JSON.stringify(data));
        console.log(this.res)
        if (this.res.responseCode == 200) {
          this.sharedDataService.hideLoader();
          this.hsn_code = this.res.response;
          console.log(this.hsn_code)
        }

      }, error => { },
        () => {
        });

    }
    catch (error) {
      console.error("not able to get response from getProductCategory API")
    }
  }
  getSingleProductData() {
    this.sharedDataService.showLoader();
    try {
        this.http.get(`https://api-dev.themafic.co.in/api/terms/show?id=${this.productID}`).subscribe(data => {
        console.log(data);
        this.res = JSON.parse(JSON.stringify(data));
        console.log(this.res)
        if (this.res.status == 200) {
          this.sharedDataService.hideLoader();
          this.SingleProductData = this.res.data;

          this.formData = {
            // content: this.SingleProductData.content,
            // hsn_code: this.SingleProductData.hsn_code,
            slug: this.SingleProductData.slug,
            title: this.SingleProductData.title,
            existingFile: this.SingleProductData.file
            // is_active: this.SingleProductData.is_active ? 1 : 0
          };
          // this.fileInputs = this.productExistingImage
        }

      }, error => { },
        () => {
        });

    }
    catch (error) {
      console.error("not able to get response from getProductCategory API")
    }
  }

  addFileInput() {
    const newId = this.fileInputs.length ? this.fileInputs[this.fileInputs.length - 1].id + 1 : 1;
    this.fileInputs.push({ id: newId, images: '' });
  }

  removeFileInput(index: number, payloadID: any) {
    this.fileInputs.splice(index, 1);
    try {
      var httpbody: Object = {
        "productImageId": payloadID
      }
      this.http.post('https://api.themafic.com/api/MaficDashboard/deleteProductImage', httpbody).subscribe(data => {
        console.log(data);
        this.res = JSON.parse(JSON.stringify(data));
        console.log(this.res)
        if (this.res.responseCode == 200) {
          this.sharedDataService.hideLoader();
          var response = this.res.response;
          this.ProductCategoryList = this.sharedDataService.ProductCategoryList
          this.getSACData();
          this.getSingleProductData();
          this.sharedDataService.firePopup(true, 'deleted successfully');
        }

      }, error => { },
        () => {
        });

    }
    catch (error) {
      console.error("not able to get response from getProductCategory API")
    }

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
          fileInput.images = e.target.result;
        }
      };
      reader.readAsDataURL(file);
    }
  }


  addProductData() {
    this.sharedDataService.showLoader();

    var uploadData;

    uploadData = new FormData();

    uploadData.append('id', this.productID);
    // uploadData.append('content', this.formData.content);
    // uploadData.append('hsn_code', this.formData.hsn_code);
    uploadData.append('slug', this.formData.slug);
    uploadData.append('title', this.formData.title);
    // uploadData.append('is_active', '1');
    // uploadData.append('is_active', this.formData.is_active.toString());
    if (this.selectedFile) {
      uploadData.append('file', this.selectedFile, this.selectedFile.name);
    }
    console.log(uploadData, 'uploaded data');

    this.http.post('https://api-dev.themafic.co.in/api/terms/update', uploadData)
      .subscribe(data => {
        console.log(data);
        this.sharedDataService.hideLoader();
        this.dialog.closeAll();
        this.viewComplete.emit();
      },
        error => { },
        () => { });


  }
}
