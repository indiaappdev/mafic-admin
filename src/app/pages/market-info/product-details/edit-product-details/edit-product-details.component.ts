import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SharedDataService } from 'src/app/shared/shared-data.service';

@Component({
  selector: 'app-edit-product-details',
  templateUrl: './edit-product-details.component.html',
  styleUrls: ['./edit-product-details.component.css']
})
export class EditProductDetailsComponent implements OnInit {
  ProductCategoryList: any;
  selectedCategoryId: any;  
  fileInputs: { id: number, images: any }[] = [{ id: 1, images: '' }];
  res: any;
  productSACHSNCode: any;
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
  
  constructor(public sharedDataService: SharedDataService,
    private dialog: MatDialog,
    private http: HttpClient,
    @Inject(MAT_DIALOG_DATA) public data: any,) {
    this.productID = data.element.id
  }

  ngOnInit(): void {
    this.ProductCategoryList = this.sharedDataService.ProductCategoryList
    this.getSACData();
    this.getSingleProductData();
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
  getSingleProductData() {
    this.sharedDataService.showLoader();
    try {
      var httpbody: Object = {
        "productId": this.productID
      }
      this.http.post('https://api.themafic.com/api/MaficDashboard/getSingleProduct', httpbody).subscribe(data => {
        console.log(data);
        this.res = JSON.parse(JSON.stringify(data));
        console.log(this.res)
        if (this.res.responseCode == 200) {
          this.sharedDataService.hideLoader();
          this.SingleProductData = this.res.response;
          this.productData = this.SingleProductData.productData;
          this.fileInputs = this.productExistingImage = this.SingleProductData.productImages
          console.log(this.productData)
          console.log(this.productExistingImage)

          // 
          this.formData = {
            productName: this.productData[0].name,
            artName: this.productData[0].art_name,
            artistName: this.productData[0].artist_name,
            productCategory: this.productData[0].category,
            subCategory: this.productData[0].sub_category,
            productPrice: this.productData[0].price,
            productDiscount: this.productData[0].discount,
            productSACHSNCode: this.productData[0].hsn_code,
            quantity: this.productData[0].quantity,
            productSKU: this.productData[0].sku,
            size: this.productData[0].size,
            warranty: this.productData[0].brand_warranty,
            returnPolicy: this.productData[0].return_policy,
            Delivery: this.productData[0].delivery,
            descriptionHeader: this.productData[0].header,
            Description: this.productData[0].description
          };
          this.fileInputs = this.productExistingImage
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
    var image_number = 0;
    if (this.imgs.length > 0) {
      var image_count = this.imgs.length
      for (let i = 0; i < this.imgs.length; i++) {
        image_number = (i + 1)
        uploadData.append('image' + image_number, this.imgs[i]);
        
      }
      uploadData.append('imageCount', image_count);
    }
    else
    uploadData.append('imageCount', '0');


    
    uploadData.append('productId', this.productID);
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

    this.http.post('https://api.themafic.com/api/MaficDashboard/editProductData', uploadData)
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
