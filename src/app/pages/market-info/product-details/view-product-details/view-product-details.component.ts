import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';

interface ProductImage {
  id: number;
  images: string;
}

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
  images: ProductImage[] = []; // Correctly typed array

  constructor(private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpClient) {
      this.productID = data.element.id;
  }

  ngOnInit(): void {
    this.getProductImages();
  }

  getProductImages() {
    try {
      this.http.get(`https://api-dev.themafic.co.in/api/products/images?id=${this.productID}`).subscribe(
        (data: any) => {
          console.log(data);
          this.res = data;
          console.log(this.res);
          if (this.res.status === 200) {
            // Map the images from the data array
            this.images = this.res.data.map((item: ProductImage) => ({ id: item.id, images: item.images }));
            console.log(this.images);
          }
        },
        error => {
          console.error("Error occurred while fetching product images:", error);
        }
      );
    } catch (error) {
      console.error("Unable to get response from getProductImages API", error);
    }
  }

  closepopup() {
    this.dialog.closeAll();
  }
}
