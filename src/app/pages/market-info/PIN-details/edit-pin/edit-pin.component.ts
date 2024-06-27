import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SharedDataService } from 'src/app/shared/shared-data.service';

@Component({
  selector: 'app-edit-pin',
  templateUrl: './edit-pin.component.html',
  styleUrls: ['./edit-pin.component.css']
})
export class EditPinComponent implements OnInit {
  charges: any;
  id: any;
  formData: any;
  viewComplete: EventEmitter<any> = new EventEmitter();
  // dialog: any;

  constructor(public sharedDataService: SharedDataService,
    private dialog: MatDialog,
    private http: HttpClient,
    @Inject(MAT_DIALOG_DATA) public data: any,) {
    this.charges = data.element.SACHSN_Code
    this.id = data.element.id
  }
  ngOnInit(): void {
    this.formData = new FormGroup({
      charges : new FormControl('', Validators.required)     
    });
    this.formData.charges = this.data.element.delivery_charge
    console.log(this.data.element.delivery_charge)
  }
  cancelForm(){
    this.dialog.closeAll();
  }
  submitForm(form: NgForm) {
    if (form.valid) {
      this.changeDeliveryChargesForPIN();
    }
    else {
      console.log('Form is invalid.');
    }
  }
  changeDeliveryChargesForPIN(){
    this.sharedDataService.showLoader();
    var httbBody:Object={
      "PincodeId": this.id,
    "delivery_charge": this.formData.charges
    }

      this.http.post('https://api.themafic.com/api/MaficDashboard/editPincodeData', httbBody)
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
