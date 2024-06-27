import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA , MatDialogRef } from '@angular/material/dialog';
import { SharedDataService } from 'src/app/shared/shared-data.service';

@Component({
  selector: 'app-delete-productcategory',
  templateUrl: './delete-productcategory.component.html',
  styleUrls: ['./delete-productcategory.component.css']
})
export class DeleteProductcategoryComponent implements OnInit {

  // @Inject(MAT_DIALOG_DATA) public data: any;
  deletionComplete: EventEmitter<any> = new EventEmitter();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpClient,
    public datas: SharedDataService,
    private dialog:MatDialog,
    public dialogRef: MatDialogRef<DeleteProductcategoryComponent>
    // public dialogRefdel: MatDialogRef
  ) { }

  ngOnInit(): void {
  }

  uplodInfo:any = [];
  // deleteProductItem() {
  //   this.datas.showLoader()
  //   var httpbody: Object = {
  //     "id": this.data.element.id,
  //     "category": this.data.element.category,
  //     "images": this.data.element.images
  //   };
  //   console.log(httpbody)
  //   this.http.post('https://api.themafic.com/api/MaficDashboard/deleteProductCategory', httpbody)
  //     .subscribe(data => {
        
  //       this.uplodInfo = data;
  //       console.log(data);
  //       this.datas.hideLoader();
  //       if(this.uplodInfo.responseCode == "200"){
  //         this.datas.firePopup(true,'Data Deleted');
  //       } else if(this.uplodInfo.responseCode == 803) {
  //         this.datas.firePopup(false,'Something went wrong..!!!');
  //       }else {
  //         this.datas.firePopup(false,this.uplodInfo.responseMsg);
  //       }
  //       // this.dialog.closeAll();
  //       this.dialogRef.close(true);
  //       this.dialogRef.close(true);
  //     }, error => {
  //       console.error('Error deleting product category', error);
  //       // Handle error if needed
  //       this.dialogRef.close(true); // Close the dialog even if there's an error
  //     });
  // }
  
  deleteProductItem() {
    this.datas.showLoader();
    var httpbody: Object = {
      "id": this.data.element.id,
      "category": this.data.element.category,
      "images": this.data.element.images
    };

    this.http.post('https://api.themafic.com/api/MaficDashboard/deleteProductCategory', httpbody)
      .subscribe(data => {
        console.log(data);
        this.datas.hideLoader();
        // Emit an event to notify the parent component
        this.deletionComplete.emit();
        // Close the dialog
        this.dialogRef.close(true);
      }, error => {
        console.error('Error deleting product category', error);
        // Handle error if needed
        this.datas.firePopup(false, 'Error deleting product category');
        // Close the dialog even if there's an error
        this.dialogRef.close(true);
      });
  }
}




