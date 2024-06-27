import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SharedDataService } from 'src/app/shared/shared-data.service';

@Component({
  selector: 'app-edit-tax-details',
  templateUrl: './edit-tax-details.component.html',
  styleUrls: ['./edit-tax-details.component.css']
})
export class EditTaxDetailsComponent implements OnInit {

  viewComplete: EventEmitter<any> = new EventEmitter();
  hsnCode: any;
  formData: any;
  res: any;
  TaxData: any;
  SACHSN=['SAC','HSN']
  id: any;

  constructor(public sharedDataService: SharedDataService,
    private dialog: MatDialog,
    private http: HttpClient,
    @Inject(MAT_DIALOG_DATA) public data: any,) {
    this.hsnCode = data.element.SACHSN_Code
    this.id = data.element.id
  }

  
  ngOnInit(): void {
    this.getSinglehsnCode();
    this.formData = new FormGroup({
      SAC_HSN: new FormControl('', Validators.required),
      SACHSNCODE: new FormControl('', Validators.required),
      Description: new FormControl('', Validators.required),
      CGST: new FormControl('', Validators.required),
      SGSTUTGST: new FormControl('', Validators.required),
      IGST: new FormControl('', Validators.required),
      Cess: new FormControl('', Validators.required),
      TCS: new FormControl('', Validators.required)     
    });
  }

  getSinglehsnCode() {
    this.sharedDataService.showLoader();
    try {
      var httpbody: Object = {
        "hsnCode": this.hsnCode
      }
      this.http.post('https://api.themafic.com/api/MaficDashboard/getSingleGstData', httpbody).subscribe(data => {
        console.log(data);
        this.res = JSON.parse(JSON.stringify(data));
        console.log(this.res)
        if (this.res.responseCode == 200) {
          this.sharedDataService.hideLoader();
          this.TaxData = this.res.response[0];
          console.log(this.TaxData)
          
          this.formData = {
            SAC_HSN: this.TaxData.SAC_HSN,
            SACHSNCODE: this.TaxData.SACHSN_Code,
            Description: this.TaxData.Description_of_Goods,
            CGST: this.TaxData.CGST,
            SGSTUTGST: this.TaxData.SGST_UTGST,
            IGST: this.TaxData.IGST,
            Cess: this.TaxData.Cess,
            TCS: this.TaxData.TCS,
            
          };
        }

      }, error => { },
        () => {
        });

    }
    catch (error) {
      console.error("not able to get response from getProductCategory API")
    }
  }

  cancelForm(){
    this.dialog.closeAll();
  }
  submitForm(form: NgForm) {
    if (form.valid) {
      this.addTaxData();
    }
    else {
      console.log('Form is invalid.');
    }
  }
  addTaxData(){
    this.sharedDataService.showLoader();
    
    var uploadData;
    
      uploadData = new FormData();
     console.log(this.id)
      
      uploadData.append('id', this.id);
      uploadData.append('SAC_HSN', this.formData.SAC_HSN);
      uploadData.append('SAC_HSN_Cod', this.formData.SACHSNCODE);
      uploadData.append('Description_of_Goods', this.formData.Description);
      uploadData.append('CGST', this.formData.CGST);
      uploadData.append('SGST_UTGST', this.formData.SGSTUTGST);
      uploadData.append('IGST', this.formData.IGST);
      uploadData.append('Cess', this.formData.Cess);
      uploadData.append('TCS', this.formData.TCS);

      this.http.post('https://api.themafic.com/api/MaficDashboard/editGstData', uploadData)
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
