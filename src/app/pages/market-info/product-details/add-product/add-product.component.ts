import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { SharedDataService } from 'src/app/shared/shared-data.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {
  ProductCategoryList: any;
  selectedCategoryId: any;
  // formData = {
  //   productName: '',
  //   artName: '' ,
  //   artistName:'' ,
  //   productCategory:'',
  //   subCategory:'',
  //   productPrice:'',
  //   productDiscount:'',
  //   productSACHSNCode:'',
  //   quantity:'',
  //   productSKU:'',
  //   size:'',
  //   warranty:'',
  //   returnPolicy:'',
  //   Delivery:'',
  //   descriptionHeader:'',
  //   Description:'',
  //   imgs: [] as string[]

  // };
  fileInputs: { id: number, previewSrc: any }[] = [{ id: 1, previewSrc: '' }];
  res: any;
  productSACHSNCode: any;
  imagePreviews: string[] = [];
  deliveryOptions=['Yes','No']
  productImages: any;
  formData: any;
  imgs: any=[];

  constructor(public sharedDataService: SharedDataService,
    private dialog: MatDialog,
    private http: HttpClient,) { }

  ngOnInit(): void {
    this.formData = new FormGroup({
      productName: new FormControl('', Validators.required),
      artName: new FormControl('', Validators.required),
      artistName: new FormControl('', Validators.required),
      productCategory: new FormControl('', Validators.required),
      subCategory: new FormControl('', Validators.required),
      productPrice: new FormControl('', Validators.required),
      productDiscount: new FormControl('', Validators.required),
      productSACHSNCode: new FormControl('', Validators.required),
      quantity: new FormControl('', Validators.required),
      productSKU: new FormControl('', Validators.required),
      size: new FormControl(''),
      warranty: new FormControl(''),
      returnPolicy: new FormControl(''),
      Delivery: new FormControl('', Validators.required),
      descriptionHeader: new FormControl(''),
      Description: new FormControl(''),
      imageCount: new FormControl(''),
      imgs: new FormControl([]) // Initialize as empty array
    });
    this.ProductCategoryList = this.sharedDataService.ProductCategoryList
    this.getSACData();
  }
  cancelForm(){
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
  getSACData(){
    this.sharedDataService.showLoader();
    try {
      this.http.get('https://api.themafic.com/api/MaficDashboard/getHsnCode').subscribe(data => {
        console.log(data);
        this.res = JSON.parse(JSON.stringify(data));
        console.log(this.res)
        if (this.res.responseCode == 200) {
          this.sharedDataService.hideLoader();
           this.productSACHSNCode = this.res.response;
          console.log(this.productSACHSNCode)
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
     
      var image_count = this.imgs.length
      for(let i=0; i<this.imgs.length; i++){
        var image_number = (i + 1)
        uploadData.append('image'+image_number, this.imgs[i]);
      }
      uploadData.append('imageCount', image_count);
      uploadData.append('name', this.formData.productName);
      uploadData.append('art_name', this.formData.artName);
      uploadData.append('artist_name', this.formData.artistName);
      uploadData.append('category', this.formData.productCategory);
      uploadData.append('sub_category', this.formData.subCategory);
      uploadData.append('price', this.formData.productPrice);
      uploadData.append('discount', this.formData.productDiscount);
      uploadData.append('hsn_code', this.formData.productSACHSNCode);
      uploadData.append('quantity', this.formData.quantity);
      uploadData.append('sku', this.formData.productSKU);
      uploadData.append('size', this.formData.size);
      uploadData.append('brand_warranty', this.formData.warranty);
      uploadData.append('return_policy', this.formData.returnPolicy);
      uploadData.append('delivery', this.formData.Delivery);
      uploadData.append('descriptionHeader', this.formData.descriptionHeader);
      uploadData.append('description', this.formData.Description);

      this.http.post('https://api.themafic.com/api/MaficDashboard/addProductData', uploadData)
        .subscribe(data => {
          console.log(data);
          this.sharedDataService.hideLoader();
          this.dialog.closeAll();
        },
          error => { },
          () => { });
    
    
  }
}
