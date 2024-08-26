import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SharedDataService } from 'src/app/shared/shared-data.service';

@Component({
  selector: 'app-delete-product-details',
  templateUrl: './delete-product-details.component.html',
  styleUrls: ['./delete-product-details.component.css']
})
export class DeleteProductDetailsComponent implements OnInit {

  deleteComplete: EventEmitter<any> = new EventEmitter();
  public dialogRef: MatDialogRef<DeleteProductDetailsComponent>

  constructor( @Inject(MAT_DIALOG_DATA) public data: any,
  public sharedDataService: SharedDataService,
  private http: HttpClient,) { }

  ngOnInit(): void {
  }
  deleteProductItem() {
    this.sharedDataService.showLoader();
    var httpbody: Object = {      
      "productId":{
        "id": this.data.element.id,
        "name": this.data.element.name,
        "header": this.data.element.header,
        "description": this.data.element.description,
        "price": this.data.element.price,
        "discount": this.data.element.discount,
        "categoryId": this.data.element.categoryId,
        "sub_category": this.data.element.sub_category,
        "sku": this.data.element.sku,
        "item_no": this.data.element.item_no,
        "art_name": this.data.element.art_name,
        "artist_name": this.data.element.artist_name,
        "quantity": this.data.element.quantity,
        "size": this.data.element.size,
        "category": this.data.element.category,
        "hsn_code": this.data.element.hsn_code,
        "total_price": this.data.element.total_price,
        "brand_warranty": this.data.element.brand_warranty,
        "return_policy": this.data.element.return_policy,
        "delivery": this.data.element.delivery,
      }
      
    };
console.log(httpbody)
    this.http.post('https://api.themafic.com/api/MaficDashboard/deleteProductData', httpbody)
      .subscribe(data => {
        console.log(data);
        this.sharedDataService.hideLoader();
        // Emit an event to notify the parent component
        this.deleteComplete.emit();
        // Close the dialog
        this.dialogRef.close(true);
        this.sharedDataService.firePopup(true, 'successfully deleted');
      }, error => {
        console.error('Error deleting product category', error);
        // Handle error if needed
        this.sharedDataService.firePopup(false, 'Error deleting product category');
        // Close the dialog even if there's an error
        this.dialogRef.close(true);
      });
  }

}
