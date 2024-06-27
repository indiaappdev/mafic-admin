import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SharedDataService } from 'src/app/shared/shared-data.service';

@Component({
  selector: 'app-delete-tax-details',
  templateUrl: './delete-tax-details.component.html',
  styleUrls: ['./delete-tax-details.component.css']
})
export class DeleteTaxDetailsComponent implements OnInit {
  
  deleteComplete: EventEmitter<any> = new EventEmitter();
  public dialogRef: MatDialogRef<DeleteTaxDetailsComponent>

  constructor( @Inject(MAT_DIALOG_DATA) public data: any,
  public sharedDataService: SharedDataService,
  private http: HttpClient,) { }

  ngOnInit(): void {
  }

  deleteTaxData(){
    this.sharedDataService.showLoader();
    var httpbody: Object = {   
       "id": this.data.element.id      
    };
console.log(httpbody)
    this.http.post('https://api.themafic.com/api/MaficDashboard/deleteGstData', httpbody)
      .subscribe(data => {
        console.log(data);
        this.sharedDataService.hideLoader();
        this.deleteComplete.emit();
       this.dialogRef.close(true);
        this.sharedDataService.firePopup(true, 'successfully deleted');
      }, error => {
        console.error('Error deleting product category', error);
        this.sharedDataService.firePopup(false, 'Error deleting product category');
        this.dialogRef.close(true);
      });
  }
}
