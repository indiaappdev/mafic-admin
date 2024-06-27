import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
// @import '~bootstrap/dist/css/bootstrap.min.css';


@Component({
  selector: 'app-view-product-details',
  templateUrl: './view-product-details.component.html',
  styleUrls: ['./view-product-details.component.css']
})
export class ViewProductDetailsComponent implements OnInit {
  viewComplete: EventEmitter<any> = new EventEmitter();
  imageUrl: any;
  res: any;
  productID: any;
  images: any[] = [];

  constructor(private dialog:MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpClient,) {
      this.productID= data.element.id
     }

  ngOnInit(): void {
    this.getProductImages();
  }
  getProductImages(){
    try {
      var httpBody: Object={
        "productId": this.productID
      }
      this.http.post('https://api.themafic.com/api/MaficDashboard/getProductImages',httpBody).subscribe(data => {
        console.log(data);
        this.res = data;
        console.log(this.res)
        if (this.res.responseCode == 200) {
          this.images = this.res.response;
          console.log(this.images)
        }

      }, error => { },
        () => {});

    }
    catch (error) {
      console.error("not able to get response from getProductCategory API")
    }
  }

  closepopup(){
    this.dialog.closeAll();
  }
}
