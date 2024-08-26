import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { SharedDataService } from 'src/app/shared/shared-data.service';

@Component({
  selector: 'app-add-tax-details',
  templateUrl: './add-tax-details.component.html',
  styleUrls: ['./add-tax-details.component.css']
})
export class AddTaxDetailsComponent implements OnInit {
  formData: any;
  SACHSN=['SAC','HSN']
  constructor(public sharedDataService: SharedDataService,
    private dialog: MatDialog,
    private http: HttpClient,) { }

  ngOnInit(): void {
    this.formData = new FormGroup({
      SACHSN: new FormControl('', Validators.required),
      SACHSNCODE: new FormControl('', Validators.required),
      Description: new FormControl('', Validators.required),
      CGST: new FormControl('', Validators.required),
      SGSTUTGST: new FormControl('', Validators.required),
      IGST: new FormControl('', Validators.required),
      Cess: new FormControl('', Validators.required),
      TCS: new FormControl('', Validators.required)     
    });
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
     
     
      uploadData.append('SAC_HSN', this.formData.SACHSN);
      uploadData.append('SAC_HSN_Cod', this.formData.SACHSNCODE);
      uploadData.append('Description_of_Goods', this.formData.Description);
      uploadData.append('CGST', this.formData.CGST);
      uploadData.append('SGST_UTGST', this.formData.SGSTUTGST);
      uploadData.append('IGST', this.formData.IGST);
      uploadData.append('Cess', this.formData.Cess);
      uploadData.append('TCS', this.formData.TCS);

      this.http.post('https://api.themafic.com/api/MaficDashboard/addGstData', uploadData)
        .subscribe(data => {
          console.log(data);
          this.sharedDataService.hideLoader();
          this.dialog.closeAll();
        },
          error => { },
          () => { });
    
  }

}
