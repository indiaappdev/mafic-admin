// import { HttpClient } from '@angular/common/http';
// import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
// import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
// // @import '~bootstrap/dist/css/bootstrap.min.css';


// @Component({
//   selector: 'app-view-product-terms',
//   templateUrl: './view-product-terms.component.html',
//   styleUrls: ['./view-product-terms.component.css']
// })
// export class ViewProductTermsComponent implements OnInit {
//   viewComplete: EventEmitter<any> = new EventEmitter();
//   content: any;
//   res: any;
//   productID: any;
//   SingleProductData: any;
//   images: any[] = [];

//   constructor(private dialog:MatDialog,
//     @Inject(MAT_DIALOG_DATA) public data: any,
//     private http: HttpClient,) {
//       console.log(data.element);
//       this.productID= data.element.id
//       console.log(this.productID);
//      }

//   ngOnInit(): void {
//     this.getProductImages();
//   }
//   getProductImages(){
//     this.content = this.data.element.file;
//   }

//   closepopup(){
//     this.dialog.closeAll();
//   }
// }

import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-view-product-terms',
  templateUrl: './view-product-terms.component.html',
  styleUrls: ['./view-product-terms.component.css']
})
export class ViewProductTermsComponent implements OnInit {
  viewComplete: EventEmitter<any> = new EventEmitter();
  content: any;
  sanitizedUrl: SafeResourceUrl;
  productID: any;
  SingleProductData: any;
  images: any[] = [];

  constructor(
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpClient,
    private sanitizer: DomSanitizer
  ) {
    console.log(data.element);
    this.productID = data.element.id;
    console.log(this.productID);
  }

  ngOnInit(): void {
    this.getProductImages();
  }

  getProductImages() {
    this.content = this.data.element.file;
    this.sanitizedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.content);
  }

  isImage(): boolean {
    const imageExtensions = ['jpeg', 'jpg', 'png'];
    const urlExtension = this.content.split('.').pop().toLowerCase();
    return imageExtensions.includes(urlExtension);
  }

  closepopup() {
    this.dialog.closeAll();
  }
}
