import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { SharedDataService } from 'src/app/shared/shared-data.service';
import { ViewProductTermsAddComponent } from '../view-product-terms-add/view-product-terms-add.component';

interface Term {
  id: number;
  title: string;
  slug: string;
  file: string | null;
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
  preShipmentInspectionOptions=['Yes','No']
  productImages: any;
  formData: any;
  imgs: any=[];

  sampleMaterialOptions: Term[] = [];
  certificationAndComplianceOptions: Term[] = [];
  materialOrderingOptions: Term[] = [];
  boxingAndPackagingOptions: Term[] = [];
  freightOptions: Term[] = [];
  insuranceOptions: Term[] = [];
  incotermOptions: Term[] = [];
  brandWarrantyOptions: Term[] = [];
  returnPolicyOptions: Term[] = [];

  selectedFiles: { [key: string]: string | null } = {
    sampleMaterial: null,
    certificationAndCompliance: null,
    materialOrdering: null,
    boxingAndPackaging: null,
    freight: null,
    insurance: null,
    incoterm: null,
    brandWarranty: null,
    returnPolicy: null
  };

  // Create a mapping of field names to option arrays
  optionsMapping: { [key: string]: Term[] } = {
    sampleMaterial: this.sampleMaterialOptions,
    certificationAndCompliance: this.certificationAndComplianceOptions,
    materialOrdering: this.materialOrderingOptions,
    boxingAndPackaging: this.boxingAndPackagingOptions,
    freight: this.freightOptions,
    insurance: this.insuranceOptions,
    incoterm: this.incotermOptions,
    brandWarranty: this.brandWarrantyOptions,
    returnPolicy: this.returnPolicyOptions
  };

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
      minOrderQuantity: new FormControl(''),
      // sampleMaterialId: new FormControl(''),
      // certificationAndComplianceId: new FormControl(),
      // materialOrderingAndPaymentTermsId: new FormControl(),
      // boxingAndPackagingId: new FormControl(),
      // freightId: new FormControl(),
      // insuranceId: new FormControl(),
      // incotermId: new FormControl(),
      // warranty: new FormControl(''),
      // returnPolicy: new FormControl(''),
      preShipmentInspectionId: new FormControl(),
      imgs: new FormControl([]) // Initialize as empty array
    });
    this.ProductCategoryList = this.sharedDataService.ProductCategoryList
    this.getSACData();
    this.getCountryData();

    this.http.get<any>('https://api-dev.themafic.co.in/api/terms').subscribe(response => {
      if (response.status === 200) {
        const terms = response.data as Term[];

        this.sampleMaterialOptions = terms.filter(term => term.slug == 'sample_material');
        this.certificationAndComplianceOptions = terms.filter(term => term.slug == 'certification_and_compliance');
        this.materialOrderingOptions = terms.filter(term => term.slug == 'material_ordering_and_payment_terms');
        this.boxingAndPackagingOptions = terms.filter(term => term.slug == 'boxing_and_packaging');
        this.freightOptions = terms.filter(term => term.slug == 'freight');
        this.insuranceOptions = terms.filter(term => term.slug == 'insurance');
        this.incotermOptions = terms.filter(term => term.slug == 'incoterm');
        this.brandWarrantyOptions = terms.filter(term => term.slug == 'brand_warranty');
        this.returnPolicyOptions = terms.filter(term => term.slug == 'return_policy');
      }
    });
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

  onSelectionChange(event: any, field: string) {
    const selectedId = event.value;
    console.log(selectedId);

    this.http.get(`https://api-dev.themafic.co.in/api/terms/show?id=${selectedId}`).subscribe(
      (data: any) => {
        console.log(data);
        const fileUrl = data.data.file;
        console.log(fileUrl);
        this.selectedFiles[field] = fileUrl;
      },
      error => {
        console.error('Error fetching file URL', error);
        this.selectedFiles[field] = null;
      }
    );
  }

  openViewContentPopup(field: string) {
    const fileUrl = this.selectedFiles[field];
    console.log(fileUrl);
    if (fileUrl) {
      const dialogRef = this.dialog.open(ViewProductTermsAddComponent, {
        width: '600px',
        data: { fileUrl }
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
      });
    } else {
      alert('No file available for the selected option.');
    }
  }
  
  addProductData(){
    this.sharedDataService.showLoader();
    
    var uploadData;
    
      uploadData = new FormData();
     
      var image_count = this.imgs.length
      for(let i=0; i<this.imgs.length; i++){
        var image_number = (i + 1)
        uploadData.append('image_'+image_number, this.imgs[i]);
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
      uploadData.append('certification_and_compliance_id', this.formData.certificationAndComplianceId || '');
      uploadData.append('sample_material_id', this.formData.sampleMaterialId || '');
      uploadData.append('material_ordering_and_payment_terms_id', this.formData.materialOrderingAndPaymentTermsId || '');
      uploadData.append('boxing_and_packaging_id', this.formData.boxingAndPackagingId || '');
      uploadData.append('freight_id', this.formData.freightId || '');
      uploadData.append('insurance_id', this.formData.insuranceId || '');
      uploadData.append('incoterm_id', this.formData.incotermId || '');
      uploadData.append('brand_warranty_id', this.formData.warranty || '');
      uploadData.append('return_policy_id', this.formData.returnPolicy || '');
      uploadData.append('pre_shipment_inspection', this.formData.preShipmentInspectionId);
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
