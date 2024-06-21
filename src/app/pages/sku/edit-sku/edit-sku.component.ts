import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SharedDataService } from 'src/app/shared/shared-data.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-edit-sku',
  templateUrl: './edit-sku.component.html',
  styleUrls: ['./edit-sku.component.css']
})
export class EditSkuComponent implements OnInit {

  selectedFile: File;
  file_data:any;
  file_name:string = '';
  file_size:number = 800001;
  acceptableImageArray = ['image/png','image/jpg','image/jpeg'];
  fileAccept:boolean= false;
  uploadImageUrl:any = '';
  fileInfos?: Observable<any>;
  progress:number;
  message:string;
  uploader:boolean = false;

  file_type:any;
  type_valid:boolean = false;

  name =              new FormControl('', [Validators.required]);
  description =       new FormControl('', [Validators.required]);
  price =             new FormControl('', [Validators.required]);
  discount =          new FormControl('', [Validators.required]);
  sac_gst =           new FormControl('', [Validators.required]);
  natureService =     new FormControl({value: '', disabled: true}, [Validators.required]);
  shortDescription =  new FormControl({value: '', disabled: true}, [Validators.required]);
  gstVal =            new FormControl({value: '', disabled: true}, [Validators.required]);
  active =            new FormControl(false);
  GSTInfo:any = [];
  skuDetails:any = [];
  skuId:string;

  public addSKUForm: FormGroup = new FormGroup({
    name:         this.name,
    dexcription:  this.description,
    price:        this.price,
    discount:     this.discount
  });

  constructor(private http: HttpClient, private router:Router,
    public data:SharedDataService,private route: ActivatedRoute) { }

  ngOnInit(): void {
    const routeParams = this.route.snapshot.paramMap;
    this.skuId = String(routeParams.get('sId'));
    this.http.post(''+this.data.apiDomainPathDash+'getSingleSku',{id:this.skuId}) // Get user details
    .subscribe(data => {
      console.log(data);
      this.skuDetails = data;
      this.skuDetails = this.skuDetails.response[0];
      this.resetTabele()
    });
    this.http.get(''+this.data.apiDomainPathDash+'getSkuFormat') // Get SKU Invoice details
    .subscribe(data => { 
      let uplodInfo:any = []
      uplodInfo = data;
      this.GSTInfo = uplodInfo.response;
    });
  }

  setFormOnChange(value:any){
    let val = Number(value.value);
    let gstObj = this.GSTInfo[val];
    this.natureService.reset(gstObj.Nature_of_service);
    this.shortDescription.reset(gstObj.Short_Description);
    this.gstVal.reset(gstObj.gst)
  }

  resetTabele(){
    this.name.reset(this.skuDetails.name);
    this.description.reset(this.skuDetails.description);
    this.price.reset(this.skuDetails.price);
    this.discount.reset(this.skuDetails.discount);
    this.natureService.reset(this.skuDetails.Nature_of_service);
    this.shortDescription.reset(this.skuDetails.Short_Description);
    this.gstVal.reset(this.skuDetails.gst)
    if(this.skuDetails.active == 1){
      this.active.reset(true);
    } else{
      this.active.reset(false);
    }
    debugger
    for (let index = 0; index < this.GSTInfo.length; index++) {
      if (this.GSTInfo[index].sac_gst_code == this.skuDetails.sac_gst_code)
        this.sac_gst.reset(index);
    }
  }

  validateFormFields() {
    if (this.name.hasError('required') || this.description.hasError('required') || this.price.hasError('required')) {
     return 'Mandatory field';
    } else
    return '';
  }

  skuImage(event:any){
    if(event.target.files.length > 0){
      this.fileAccept = false;
      this.selectedFile = event.target.files[0]
      this.file_name = this.selectedFile.name;
      this.file_size = this.selectedFile.size;
      let fileType = this.selectedFile.type;
      if(this.acceptableImageArray.includes(fileType)){
        const reader = new FileReader();
        this.type_valid = true;
        // this.imagePath = files;
        reader.readAsDataURL(this.selectedFile); 
        reader.onload = () => { 
            
            const img = new Image();
            img.src = reader.result as string;
            img.onload = () => {
                const height = img.naturalHeight;
                const width = img.naturalWidth;
                console.log('Width and Height', width, height);
                if(width>=1920 && height>1080){
                this.fileAccept= true; 
                this.uploadImageUrl = reader.result; 
                } else{
                this.data.firePopup(false,'Please upload HD image (1920 x 1080)');
                this.fileAccept= false;
                }
            };
        }
      } else{
        this.data.firePopup(false,'Please upload only PNG/JPEG format');
        this.fileAccept= false;
      }
    }
    console.log(this.selectedFile);
  }

  addSku(){
    if (this.discount.value > 100) {
      this.data.firePopup(false,'Discount % should be less than 100');
      return;
    }
    let activeVal;
    if(this.active.value){
      activeVal = '1';
    } else{
      activeVal = '0';
    }
    var uploadData;
    uploadData = new FormData();
    if (this.fileAccept) 
      uploadData.append('image', this.selectedFile, this.selectedFile.name);
    uploadData.append('skuId', this.skuId);
    uploadData.append('name', this.name.value);
    uploadData.append('description', this.description.value);
    uploadData.append('discount', this.discount.value);
    uploadData.append('price', this.price.value);
    uploadData.append('sac_gst_code', this.GSTInfo[Number(this.sac_gst.value)].sac_gst_code);
    uploadData.append('Nature_of_service', this.natureService.value);
    uploadData.append('Short_Description', this.shortDescription.value);
    uploadData.append('gst', this.gstVal.value);
    this.data.showLoader();
    this.http.post(''+this.data.apiDomainPathDash+'editSku',uploadData) // Add SKU details
    .subscribe(data => { 
      let uplodInfo:any = []
      uplodInfo = data;
      this.data.hideLoader();
        if(uplodInfo.responseCode == "200"){
          this.router.navigate(['/sku']);
          this.data.firePopup(true,'SKU Editted');
        } else if(uplodInfo.responseCode == 803) {
          this.data.firePopup(false,'Something went wrong..!!!');
        }else {
          this.data.firePopup(false,uplodInfo.responseMsg);
        }
    });
  }

}
