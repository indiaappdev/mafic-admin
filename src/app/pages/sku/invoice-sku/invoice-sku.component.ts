import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SharedDataService } from 'src/app/shared/shared-data.service';
import { Observable } from 'rxjs';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: 'app-invoice-sku',
  templateUrl: './invoice-sku.component.html',
  styleUrls: ['./invoice-sku.component.css']
})
export class InvoiceSkuComponent implements OnInit {

  pinCodePattern        = "^[0-9]{6,12}$";
  
  billAdressOne         = new FormControl('', [Validators.required]);
  billAdressTwo         = new FormControl('', [Validators.required]);
  billAdressCity        = new FormControl('', [Validators.required]);
  billAdressState       = new FormControl('', [Validators.required]);
  billAdressPCode       = new FormControl('', [Validators.required,Validators.pattern(this.pinCodePattern)]);

  shipAdressOne         = new FormControl('', [Validators.required]);
  shipAdressTwo         = new FormControl('', [Validators.required]);
  shipAdressCity        = new FormControl('', [Validators.required]);
  shipAdressState       = new FormControl('', [Validators.required]);
  shipAdressPCode       = new FormControl('', [Validators.required,Validators.pattern(this.pinCodePattern)]);
  userGST               = new FormControl('');
  userId                = new FormControl('', [Validators.required]);
  gmail                 = new FormControl('', [Validators.required]);
  sameFields            :boolean = false;
  skuId                 :string = '';
  artistDetails         :any = [];
  stateList             :any = [];

  public adressForm     : FormGroup = new FormGroup({
    billAdressOne       :this.billAdressOne,    
    billAdressTwo       :this.billAdressTwo,   
    billAdressCity      :this.billAdressCity,  
    billAdressState     :this.billAdressState,
    billAdressPCode     :this.billAdressPCode,
    userGST             :this.userGST,
    shipAdressOne       :this.shipAdressOne,    
    shipAdressTwo       :this.shipAdressTwo,    
    shipAdressCity      :this.shipAdressCity,   
    shipAdressState     :this.shipAdressState,  
    shipAdressPCode     :this.shipAdressPCode
  });


  constructor(private http: HttpClient, private router:Router,
    public data:SharedDataService,private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.data.showLoader();
    const routeParams = this.route.snapshot.paramMap;
    this.skuId = String(routeParams.get('sId'));
    this.http.get(''+this.data.apiDomainPathDash+'getAllArtist') // Get user details
    .subscribe(data => {
      this.data.hideLoader();
      console.log(data);
      this.artistDetails = data;
      this.artistDetails = this.artistDetails.response;
    });
    this.http.get(''+this.data.apiDomainPathDash+'getStates') // Get user details
    .subscribe(data => {
      let res:any = data;
      console.log(JSON.parse(res.response));
      this.stateList = JSON.parse(res.response);
    });
  }

  addSameFields(event:MatCheckboxChange): void {
    if(event.checked){
      this.shipAdressOne.reset(this.billAdressOne.value);
      this.shipAdressTwo.reset(this.billAdressTwo.value);
      this.shipAdressCity.reset(this.billAdressCity.value);
      this.shipAdressState.reset(this.billAdressState.value);
      this.shipAdressPCode.reset(this.billAdressPCode.value);
    }
  }

  validateFormFields() {
    if (this.billAdressCity.hasError('required') || this.billAdressOne.hasError('required') || this.billAdressState.hasError('required') || this.billAdressTwo.hasError('required') || this.shipAdressCity.hasError('required') || this.shipAdressOne.hasError('required') || this.shipAdressState.hasError('required') || this.shipAdressTwo.hasError('required')) {
      return 'Mandatory field';
    } else
      return '';
  }

  pinCodeValidator() {
    if (this.billAdressPCode.hasError('required') || this.shipAdressPCode.hasError('required'))
      return 'Please enter your Pincode';
    else if (this.billAdressPCode.hasError('pattern') || this.shipAdressPCode.hasError('pattern'))
      return 'Please enter valid Pincode';
    else
      return '';
  }

  setAdress(){

    if (this.gmail.value == '' && this.userId.value == ''){
      this.data.firePopup(false,'Please Enter the Email Or User Name');
      return;
    }

    let formData = {
      userId                :this.userId.value,
      emailId               :this.gmail.value,
      skuId                 :this.skuId,
      billingAddressLine1   :this.billAdressOne.value,
      billingAddressLine2   :this.billAdressTwo.value,
      billingCityName       :this.billAdressCity.value,
      billingStateName      :this.billAdressState.value,
      billingPostalCode     :this.billAdressPCode.value,
      GstNumber             :this.userGST.value,
      shippingAddressLine1  :this.shipAdressOne.value,
      shippingAddressLine2  :this.shipAdressTwo.value,
      shippingCityName      :this.shipAdressCity.value,
      shippingStateName     :this.shipAdressState.value,
      shippingPostalCode    :this.shipAdressPCode.value
    }
    this.data.showLoader();
    this.http.post(''+this.data.apiDomainPathDash+'addSkuInvoice',formData) // Add SKU Invoice details
    .subscribe(data => { 
      let uplodInfo:any = []
      uplodInfo = data;
      this.data.hideLoader();
        if(uplodInfo.responseCode == "200"){
          this.router.navigate(['/sku']);
          this.data.firePopup(true,'SKU Invoice sent');
        } else if(uplodInfo.responseCode == 803) {
          this.data.firePopup(false,'Something went wrong..!!!');
        }else {
          this.data.firePopup(false,uplodInfo.responseMsg);
        }
    });
  }

}
