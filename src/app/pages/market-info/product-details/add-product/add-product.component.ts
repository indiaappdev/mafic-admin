import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { SharedDataService } from 'src/app/shared/shared-data.service';
import { ViewProductTermsAddComponent } from '../view-product-terms-add/view-product-terms-add.component';

interface DropdownOption {
  id: string;
  title: string;
}

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {
  ProductCategoryList: any;
  selectedCategoryId: any;
  fileInputs: { id: number, previewSrc: any }[] = [{ id: 1, previewSrc: '' }];
  res: any;
  productSACHSNCode: any;
  productCountry: any;
  imagePreviews: string[] = [];
  deliveryOptions=['Yes','No']
  productImages: any;
  formData: any;
  imgs: any=[];
  
  certificationAndComplianceOptions: DropdownOption[] = [];
  materialOrderingOptions: DropdownOption[] = [];
  boxingAndPackagingOptions: DropdownOption[] = [];
  freightOptions: DropdownOption[] = [];
  insuranceOptions: DropdownOption[] = [];
  incotermOptions: DropdownOption[] = [];
  brandWarrantyOptions: DropdownOption[] = [];
  returnPolicyOptions: DropdownOption[] = [];


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
      productCountry: new FormControl('', Validators.required),
      quantity: new FormControl('', Validators.required),
      productSKU: new FormControl(''),
      sizeLength: new FormControl(''),
      sizeWidth: new FormControl(''),
      sizeHeight: new FormControl(''),
      warranty: new FormControl(''),
      returnPolicy: new FormControl(''),
      delivery: new FormControl('', Validators.required),
      descriptionHeader: new FormControl(''),
      Description: new FormControl(''),
      imageCount: new FormControl(''),

      finalProductPrice: new FormControl('', Validators.required),
      productSizeLength: new FormControl('', Validators.required),
      productSizeWidth: new FormControl('', Validators.required),
      productSizeHeight: new FormControl('', Validators.required),
      grossWeight: new FormControl('', Validators.required),
      netWeight: new FormControl('', Validators.required),
      material: new FormControl('', Validators.required),
      originCountry: new FormControl('', Validators.required),
      productFeatures: new FormControl('', Validators.required),
      certificationAndComplianceId: new FormControl(),
      minOrderQuantity: new FormControl(''),
      sampleMaterialId: new FormControl(''),
      materialOrderingAndPaymentTermsId: new FormControl(),
      boxingAndPackagingId: new FormControl(),
      freightId: new FormControl(),
      insuranceId: new FormControl(),
      incotermId: new FormControl(),
      preShipmentInspectionId: new FormControl(),
      imgs: new FormControl([]) // Initialize as empty array
    });
    this.ProductCategoryList = this.sharedDataService.ProductCategoryList
    this.getSACData();
    this.getCountryData();
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
  getSACData() {
    this.sharedDataService.showLoader();  // Show loader before API call
  
    this.http.get('https://api-dev.themafic.co.in/api/hsn').subscribe({
      next: (data) => {
        console.log(data);
        this.res = data;  // Directly assign the response
  
        if (this.res.status === 200) {
          this.productSACHSNCode = this.res.data;
          console.log(this.productSACHSNCode);
        } else {
          console.error('Error: Response status is not 200');
        }
      },
      error: (error) => {
        console.error("Error fetching SAC data:", error);
      },
      complete: () => {
        this.sharedDataService.hideLoader();  // Hide loader after API call completes, whether success or failure
      }
    });
  }  

  getCountryData() {
    this.sharedDataService.showLoader();  // Show loader before API call
  
    this.http.get('https://api-dev.themafic.co.in/api/countries').subscribe({
      next: (data) => {
        console.log(data);
        this.res = data;  // Directly assign the response
  
        if (this.res.status === 200) {
          this.productCountry = this.res.data;
          console.log(this.productCountry);
        } else {
          console.error('Error: Response status is not 200');
        }
      },
      error: (error) => {
        console.error("Error fetching SAC data:", error);
      },
      complete: () => {
        this.sharedDataService.hideLoader();  // Hide loader after API call completes, whether success or failure
      }
    });
  } 

  addFileInput() {
    if (this.fileInputs.length < 8) {  // Prevent adding more than 8 inputs
      const newId = this.fileInputs.length ? this.fileInputs[this.fileInputs.length - 1].id + 1 : 1;
      this.fileInputs.push({ id: newId, previewSrc: '' });
    }
  }

  // onHSNCodeChange(hsnCode: string) {
  //   this.http.get(`https://api-dev.themafic.co.in/api/MaficDashboard/terms?hsn_code=${hsnCode}`)
  //     .subscribe((response: any) => {
  //       if (response.responseCode === 200) {
  //         const data = response.response;
  
  //         // Initialize options for each dropdown based on the slug
  //         this.certificationAndComplianceOptions = data.filter((item: { slug: string; }) => item.slug === 'certification_and_compliance');
  //         this.materialOrderingOptions = data.filter((item: { slug: string; }) => item.slug === 'material_ordering_and_payment_terms');
  //         this.boxingAndPackagingOptions = data.filter((item: { slug: string; }) => item.slug === 'boxing_and_packaging');
  //         this.freightOptions = data.filter((item: { slug: string; }) => item.slug === 'freight');
  //         this.insuranceOptions = data.filter((item: { slug: string; }) => item.slug === 'insurance');
  //         this.incotermOptions = data.filter((item: { slug: string; }) => item.slug === 'incoterm');
  //         this.brandWarrantyOptions = data.filter((item: { slug: string; }) => item.slug === 'brand_warranty');
  //         this.returnPolicyOptions = data.filter((item: { slug: string; }) => item.slug === 'return_policy');
  //       }
  //     }, error => {
  //       console.error("Error fetching terms for the selected HSN code:", error);
  //     });
  // }
  
  removeFileInput(index: number) {
    this.fileInputs.splice(index, 1);
  }
  
  previewImage(event: Event, inputId: number) {
    const input = event.target as HTMLInputElement;
    const file = input.files ? input.files[0] : null;
    console.log(file);
    this.imgs.push(file);
    console.log(this.imgs);
    
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

  // openViewContentPopup(element: any) {
  //   // this.element = element
  //   const dialogRefContentview = this.dialog.open(ViewProductTermsAddComponent, {
  //     disableClose: true,
  //     data: {
  //       element: 
  //     }
  //   });
  //   dialogRefContentview.componentInstance.viewComplete.subscribe(() => {
  //     // Call refreshTable() when deletion is complete
  //     // this.getTandCDetails();
  //   });
  // }

  // openViewContentPopup(certificationAndComplianceId: string) {
    // console.log("certificationAndComplianceId :",certificationAndComplianceId);
    // Make API call to fetch content based on the selected certificationAndComplianceId
    // this.http.get(`https://api-dev.themafic.co.in/api/MaficDashboard/terms?slug=certification_and_compliance&hsn_code=${certificationAndComplianceId}`)
    //     .subscribe((response: any) => {
    //         if (response.responseCode === 200) {
    //             // Assuming the content is inside response.response[0].content
    //             const content = response.response[0].content;
                
    //             // Open dialog to show the content
    //             const dialogRefContentview = this.dialog.open(ViewProductTermsAddComponent, {
    //                 disableClose: true,
    //                 data: {
    //                     content: content // Pass the content to the dialog component
    //                 }
    //             });
                
    //             dialogRefContentview.componentInstance.viewComplete.subscribe(() => {
    //                 // You can handle any actions after closing the dialog if needed
    //             });
    //         } else {
    //             console.error('Error fetching content for certification and compliance.');
    //         }
    //     }, error => {
    //         console.error('API Error:', error);
    //     });
  // }

  
  addProductData(){
    this.sharedDataService.showLoader();
    
    var uploadData;
    
      uploadData = new FormData();
     
      var image_count = this.imgs.length
      for(let i=0; i<this.imgs.length; i++){
        var image_number = (i + 1)
        uploadData.append('image'+image_number, this.imgs[i]);
      }
      uploadData.append('name', this.formData.productName);
      uploadData.append('description_header', this.formData.descriptionHeader);
      uploadData.append('description', this.formData.Description);
      uploadData.append('art_name', this.formData.artName);
      uploadData.append('artist_name', this.formData.artistName);
      uploadData.append('category', this.formData.productCategory);
      uploadData.append('sub_category', this.formData.subCategory);
      uploadData.append('price', this.formData.productPrice);
      uploadData.append('discount', this.formData.productDiscount);
      uploadData.append('final_product_price_discount', this.formData.finalProductPrice);
      uploadData.append('hsn_code_id', this.formData.productSACHSNCode);
      uploadData.append('quantity', this.formData.quantity);
      uploadData.append('product_size_length', this.formData.productSizeLength);
      uploadData.append('product_size_width', this.formData.productSizeWidth);
      uploadData.append('product_size_height', this.formData.productSizeHeight);
      uploadData.append('product_size_packaging_length', this.formData.sizeLength);
      uploadData.append('product_size_packaging_width', this.formData.sizeWidth);
      uploadData.append('product_size_packaging_height', this.formData.sizeHeight);
      uploadData.append('gross_weight', this.formData.grossWeight);
      uploadData.append('net_weight', this.formData.netWeight);
      uploadData.append('material', this.formData.material);
      uploadData.append('delivery', this.formData.delivery);
      uploadData.append('country_id', this.formData.productCountry);
      uploadData.append('minimum_order_quantity', this.formData.minOrderQuantity);
      uploadData.append('product_features', this.formData.productFeatures);
      uploadData.append('certification_and_compliance_id', this.formData.certificationAndComplianceId);
      uploadData.append('sample_material_id', this.formData.sampleMaterialId);
      uploadData.append('material_ordering_and_payment_terms_id', this.formData.materialOrderingAndPaymentTermsId);
      uploadData.append('boxing_and_packaging_id', this.formData.boxingAndPackagingId);
      uploadData.append('freight_id', this.formData.freightId);
      uploadData.append('insurance_id', this.formData.insuranceId);
      uploadData.append('incoterm_id', this.formData.incotermId);
      uploadData.append('pre_shipment_inspection_id', this.formData.preShipmentInspectionId);
      uploadData.append('brand_warranty_id', this.formData.warranty);
      uploadData.append('return_policy_id', this.formData.returnPolicy);
      uploadData.append('image_count', image_count);
      // uploadData.append('sku', this.formData.productSKU);
      

      this.http.post('https://api-dev.themafic.co.in/api/products', uploadData)
        .subscribe(data => {
          console.log(data);
          this.sharedDataService.hideLoader();
          this.dialog.closeAll();
        },
          error => { },
          () => { });
  }
}
