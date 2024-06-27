import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SharedDataService } from 'src/app/shared/shared-data.service';

@Component({
  selector: 'app-edit-order-status',
  templateUrl: './edit-order-status.component.html',
  styleUrls: ['./edit-order-status.component.css']
})
export class EditOrderStatusComponent implements OnInit {

  viewComplete: EventEmitter<any> = new EventEmitter();
  formData: any;
  Orderstatus=["cancel","pending","shipped","delivered"]
  orderDetails: any;
  dataRes: any;

  // status: Object=[
  //   {
  //     statusCode: '0',
  //     StatusValue: 'cancel'
  //   },
  //   {
  //     statusCode: '1',
  //     StatusValue: 'pending'
  //   },
  //   {
  //     statusCode: '2',
  //     StatusValue: 'shipped'
  //   },
  //   {
  //     statusCode: '3',
  //     StatusValue: 'delivered'
  //   }
  // ]
  constructor(public sharedDataService: SharedDataService,
    private dialog: MatDialog,
    private http: HttpClient,
    @Inject(MAT_DIALOG_DATA) public data: any,) {

    this.orderDetails = data.element.id
    
  }

  ngOnInit(): void {
    
    
    this.formData = new FormGroup({
      status : new FormControl('', Validators.required)     
    });
    this.formData.status = this.Orderstatus[this.data.element.delivery_status]
    console.log( this.formData.status)
    
    console.log(this.data.element)
  }
  cancelForm() {
    this.dialog.closeAll();
  }
  submitForm(form: NgForm) {
    if (form.valid) {
      this.changeOrderStatus();
    }
    else {
      console.log('Form is invalid.');
    }
  }
  changeOrderStatus(){
    this.sharedDataService.showLoader();
    var httbBody:Object={
      "orderId": this.data.element.orderId,
      "userId": this.data.element.userId,
      "status": this.Orderstatus.indexOf(this.formData.status)
    }
    console.log(httbBody)
      this.http.post('https://api.themafic.com/api/MaficDashboard/changeDeliveryStatus', httbBody)
        .subscribe(res => {
          this.dataRes = res
          console.log(this.dataRes);
          if(this.dataRes.responseCode == 200){
            this.sharedDataService.hideLoader();
          this.dialog.closeAll();
          this.viewComplete.emit();
          }
          else{
            this.sharedDataService.firePopup(false, 'Something went wrong');
          }
          
        },
          error => {
            this.sharedDataService.firePopup(false, 'Something went wrong');
           },
          () => { });
  }   
  

}
