import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SharedDataService } from 'src/app/shared/shared-data.service';

@Component({
  selector: 'app-delete-product-terms',
  templateUrl: './delete-product-terms.component.html',
  styleUrls: ['./delete-product-terms.component.css']
})
export class DeleteProductTermsComponent implements OnInit {

  deleteComplete: EventEmitter<any> = new EventEmitter();
  public dialogRef: MatDialogRef<DeleteProductTermsComponent>

  constructor( @Inject(MAT_DIALOG_DATA) public data: any,
  public sharedDataService: SharedDataService,
  private http: HttpClient,) { }

  ngOnInit(): void {
  }
  deleteProductItem() {
    this.sharedDataService.showLoader();
    var httpbody: Object = {     
        "id": this.data.element.id,     
    };
console.log(httpbody)
    this.http.post('https://api-dev.themafic.co.in/api/terms/delete', httpbody)
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
