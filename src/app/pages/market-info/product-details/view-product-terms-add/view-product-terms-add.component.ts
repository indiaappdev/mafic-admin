import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
// @import '~bootstrap/dist/css/bootstrap.min.css';


@Component({
  selector: 'app-view-product-terms-add',
  templateUrl: './view-product-terms-add.component.html',
  styleUrls: ['./view-product-terms-add.component.css']
})
export class ViewProductTermsAddComponent implements OnInit {
  viewComplete: EventEmitter<any> = new EventEmitter();
  content: any;
  res: any;
  productID: any;
  SingleProductData: any;
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
    try {~
      // this.http.post('https://api.themafic.com/api/MaficDashboard/getProductImages',httpBody).subscribe(data => {
        this.http.get(`https://api-dev.themafic.co.in/api/MaficDashboard/terms/show?id=${this.productID}`).subscribe(data => {
        console.log(data);
        this.res = JSON.parse(JSON.stringify(data));
        console.log(this.res)
        if (this.res.responseCode == 200) {
          this.SingleProductData = this.res.response;
          this.content = this.SingleProductData.content;
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
