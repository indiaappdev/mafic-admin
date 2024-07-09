import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { SharedDataService } from 'src/app/shared/shared-data.service';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { AddProductCategoryComponent } from '../market-info/product-category/add-product-category/add-product-category.component';
import { DeleteProductcategoryComponent } from '../market-info/product-category/delete-productcategory/delete-productcategory.component';
import { EditProductcategoryComponent } from '../market-info/product-category/edit-productcategory/edit-productcategory.component';
import { ViewProductcategoryComponent } from '../market-info/product-category/view-productcategory/view-productcategory.component';
import { AddProductComponent } from '../market-info/product-details/add-product/add-product.component';
import { ViewProductDetailsComponent } from '../market-info/product-details/view-product-details/view-product-details.component';
import { EditProductDetailsComponent } from '../market-info/product-details/edit-product-details/edit-product-details.component';
import { DeleteProductDetailsComponent } from '../market-info/product-details/delete-product-details/delete-product-details.component';
import { AddTaxDetailsComponent } from '../market-info/tax-details/add-tax-details/add-tax-details.component';
import { DeleteTaxDetailsComponent } from '../market-info/tax-details/delete-tax-details/delete-tax-details.component';
import { EditTaxDetailsComponent } from '../market-info/tax-details/edit-tax-details/edit-tax-details.component';
import { EditPinComponent } from '../market-info/PIN-details/edit-pin/edit-pin.component';
import { EditOrderStatusComponent } from '../market-info/order-details/edit-order-status/edit-order-status.component';
import { Injectable } from '@angular/core';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Observable } from 'rxjs';

// import { default as invoice } from '../market-info/invoice.html';
// import { PdfService } from 'pdf-service';


@Component({
  selector: 'app-market',
  templateUrl: './market.component.html',
  styleUrls: ['./market.component.css'],

})
export class MarketComponent implements OnInit {


  @ViewChild('paginatorForProductCategory', { static: false }) paginatorForProductCategory!: MatPaginator;
  @ViewChild('paginatorForProductDetails', { static: false }) paginatorForProductDetails!: MatPaginator;
  @ViewChild('paginatorForTax', { static: false }) paginatorForTax!: MatPaginator;
  @ViewChild('paginatorForPin', { static: false }) paginatorForPin!: MatPaginator;
  @ViewChild('paginatorForOrderDetails', { static: false }) paginatorForOrderDetails!: MatPaginator;

  ProductCategoryList: any[] = [];
  ProductData: any[] = [];
  TaxData: any[] = [];
  PinData: any[] = [];
  OrderDetails: any[] = [];
  res: any;
  currentPage = 1;
  itemsPerPage = 10;
  currentItems: any[] = [];
  fileContent: string;
  htmlContent: string;

  dataSourceForProductCategory: MatTableDataSource<any>;
  dataSourceForProductDetails: MatTableDataSource<any>;
  dataSourceForTax: MatTableDataSource<any>;
  dataSourceForPin: MatTableDataSource<any>;
  dataSourceForOrderDetails: MatTableDataSource<any>;

  displayedColumnsForProductCategory: string[] = ['ID', 'CATEGORY', 'IMAGE', 'ACTION'];
  displayedColumnsForProductDetails: string[] = ['ID', 'NAME', 'PRICE', 'QUANTITY', 'DISCOUNT', 'CATEGORY', 'BRAND WARRANTY', 'RETURN POLICY', 'IMAGE', 'ACTION'];
  displayedColumnsForTax: string[] = ['ID', 'SAC_HSN', 'SACHSN_Code', 'Description', 'CGST', 'SGST', 'IGST', 'ACTION'];
  displayedColumnsForPin: string[] = ['ID', 'PO NAME', 'PIN-Code', 'DISTRICT', 'CITY', 'STATE', 'DELIVERY CHARGE', 'ACTION'];
  displayedColumnsForOrderDetails: string[] = ['ID', 'OrderId', 'PRODUCT', 'NAME', 'PRICE', 'QUANTITY', 'DISCOUNT(%)', 'GST', 'TOTAL', 'DATE', 'STATUS', 'INVOICE', 'UPDATE'];

  formDataforProductCategory = {
    text: '',
    id: ''
  };
  element: any;
  element1: any;
  showInvoice: boolean = false;
  isCollapsed: boolean = true;

  constructor(private http: HttpClient,
    public sharedDataService: SharedDataService,
    public datePipe: DatePipe,
    private dialog: MatDialog,) {
    this.getDataforProductCategory();
    this.getProductDetails();
    this.getTaxData();
    this.getPinCode();
    this.getOrderDetails();
  }
  pdfSrc: string = '';

 
  ngOnInit() {

  }

  ngOnchanges() {
    this.refreshTable();
  }

  // fetchHtml(filePath: string) {
  //   const reader = new FileReader();
  //   reader.onload = (e) => {
  //     this.fileContent = reader.result as string;
  //     console.log('File content:', this.fileContent);
  //     // Here you can process the file content as needed
  //   };
  //   reader.readAsText(filePath);
  // }

  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
  }

  getDataforProductCategory() {
    this.sharedDataService.showLoader();
    try {
      this.http.get('https://api.themafic.com/api/MaficDashboard/getProductCategory').subscribe(data => {
        console.log(data);
        this.res = JSON.parse(JSON.stringify(data));
        console.log(this.res)
        if (this.res.responseCode == 200) {
          this.sharedDataService.hideLoader();
          this.sharedDataService.ProductCategoryList = this.ProductCategoryList = this.res.response;
          console.log(this.ProductCategoryList)
        }

      }, error => { },
        () => {
          console.log(this.ProductCategoryList)
          this.dataSourceForProductCategory = new MatTableDataSource<any>();
          this.dataSourceForProductCategory.data = this.ProductCategoryList
          this.dataSourceForProductCategory.paginator = this.paginatorForProductCategory;
          console.log(this.dataSourceForProductCategory)
        });

    }
    catch (error) {
      console.error("not able to get response from getProductCategory API")
    }
  }


  getProductDetails() {
    try {
      this.http.get('https://api.themafic.com/api/MaficDashboard/getProductData').subscribe(data => {
        console.log(data);
        this.res = data;
        console.log(this.res)
        if (this.res.responseCode == 200) {
          this.ProductData = this.res.response;
          console.log(this.ProductData)
        }

      }, error => { },
        () => {
          console.log(this.ProductData)
          this.dataSourceForProductDetails = new MatTableDataSource<any>();
          this.dataSourceForProductDetails.data = this.ProductData
          this.dataSourceForProductDetails.paginator = this.paginatorForProductDetails;
          console.log(this.dataSourceForProductDetails)
        });

    }
    catch (error) {
      console.error("not able to get response from getProductCategory API")
    }
  }

  getTaxData() {
    try {
      this.http.get('https://api.themafic.com/api/MaficDashboard/getGstData').subscribe(data => {
        console.log(data);
        this.res = data;
        console.log(this.res)
        if (this.res.responseCode == 200) {
          this.TaxData = this.res.response;
          console.log(this.TaxData)
        }

      },
        error => { },
        () => {
          console.log(this.TaxData)
          this.dataSourceForTax = new MatTableDataSource<any>();
          this.dataSourceForTax.data = this.TaxData
          this.dataSourceForTax.paginator = this.paginatorForTax;
          console.log(this.dataSourceForTax)
        });

    }
    catch (error) {
      console.error("not able to get response from getProductCategory API")
    }
  }

  getPinCode() {
    try {
      this.http.get('https://api.themafic.com/api/MaficDashboard/getPincodesData').subscribe(data => {
        console.log(data);
        this.res = data;
        console.log(this.res)
        if (this.res.responseCode == 200) {
          this.PinData = this.res.response;
          console.log(this.PinData)
        }

      }, error => { },
        () => {
          console.log(this.PinData)
          this.dataSourceForPin = new MatTableDataSource<any>();
          this.dataSourceForPin.data = this.PinData
          this.dataSourceForPin.paginator = this.paginatorForPin;
        });

    }
    catch (error) {
      console.error("not able to get response from getProductCategory API")
    }
  }

  getOrderDetails() {
    try {
      this.http.post('https://api.themafic.com/api/MaficDashboard/userPaymentOrderList', {}).subscribe(data => {
        console.log(data);
        this.res = data;
        console.log(this.res)
        if (this.res.responseCode == 200) {
          this.OrderDetails = this.res.response;
          console.log(this.OrderDetails)
        }

      }, error => { },
        () => {
          console.log(this.OrderDetails)
          this.dataSourceForOrderDetails = new MatTableDataSource<any>();
          this.dataSourceForOrderDetails.data = this.OrderDetails
          this.dataSourceForOrderDetails.paginator = this.paginatorForOrderDetails;
          console.log(this.dataSourceForOrderDetails)
        });

    }
    catch (error) {
      console.error("not able to get response from getProductCategory API")
    }
  }

  addCategory() {
    const dialogRef = this.dialog.open(AddProductCategoryComponent, {
      disableClose: true,
      data: {
        roleData: '1'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      // Refresh the parent table here
      this.refreshTable();
    });
  }

  openEditPopup(element: any) {
    this.element = element
    const dialogRefedit = this.dialog.open(EditProductcategoryComponent, {
      disableClose: true,
      data: {
        element: this.element
      }
    });
    dialogRefedit.componentInstance.editComplete.subscribe(() => {
      // Call refreshTable() when deletion is complete
      this.refreshTable();
    });
  }

  editProductItem(element: any) {
    console.log(element)
    var uploadData = new FormData();
    uploadData.append('text', this.formDataforProductCategory.text)
    uploadData.append('id', this.formDataforProductCategory.id);
    this.http.post('https://api.themafic.com/api/MaficDashboard/editProductCategory', uploadData)
      .subscribe(data => {
        console.log(data);
        this.sharedDataService.hideLoader();
      },
        error => { },
        () => { });
  }

  // dele function
  openDelPopup(element: any) {
    this.element = element
    const dialogRef = this.dialog.open(DeleteProductcategoryComponent, {
      disableClose: true,
      data: {
        element: this.element
      }
    });


    dialogRef.componentInstance.deletionComplete.subscribe(() => {
      // Call refreshTable() when deletion is complete
      this.refreshTable();
    });
  }

  refreshTable() {
    console.log('Refreshing table...');
    this.getDataforProductCategory();
    this.getProductDetails();
  }
  openViewImagePopup(element: any) {
    this.element = element
    const dialogRefview = this.dialog.open(ViewProductcategoryComponent, {
      disableClose: true,
      data: {
        element: this.element
      }
    });
    dialogRefview.componentInstance.viewComplete.subscribe(() => {
      // Call refreshTable() when deletion is complete
      this.refreshTable();
    });
  }

  addProductDetails(){
    const dialogRef = this.dialog.open(AddProductComponent, {
      disableClose: true,
      data: {
        
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      // Refresh the parent table here
      //this.refreshTable();
      this.getProductDetails();
    });
  }

  viewProductDetails(element: any){
    this.element = element
    const dialogRefviewForProductDetails = this.dialog.open(ViewProductDetailsComponent, {
      disableClose: true,
      data: {
        element: this.element
      }
    });
    dialogRefviewForProductDetails.componentInstance.viewComplete.subscribe(() => {
      // Call refreshTable() when deletion is complete
      this.getProductDetails();
    });
  }

  editPdocuctDetails(element: any){
    this.element = element
    const dialogRefeditForProductDetails = this.dialog.open(EditProductDetailsComponent, {
      disableClose: true,
      data: {
        element: this.element
      }
    });
    dialogRefeditForProductDetails.componentInstance.viewComplete.subscribe(() => {
      // Call refreshTable() when deletion is complete
      this.refreshTable();
    });
  }
  deletePdocuctDetails(element: any){
    this.element = element
    const dialogRefDeleteForProductDetails = this.dialog.open(DeleteProductDetailsComponent, {
      disableClose: true,
      data: {
        element: this.element
      }
    });
    dialogRefDeleteForProductDetails.componentInstance.deleteComplete.subscribe(() => {
      // Call refreshTable() when deletion is complete
      this.refreshTable();
    });
  }

  addTaxDetails(){
    const dialogRefForTax = this.dialog.open(AddTaxDetailsComponent, {
      disableClose: true,
      data: {
        
      }
    });

    dialogRefForTax.afterClosed().subscribe(result => {
      // Refresh the parent table here
      //this.refreshTable();
      this.getTaxData();
    });
  }

  deleteTaxData(element: any){
    this.element = element
    const dialogRefDeleteForTax = this.dialog.open(DeleteTaxDetailsComponent, {
      disableClose: true,
      data: {
        element: this.element
      }
    });
    dialogRefDeleteForTax.componentInstance.deleteComplete.subscribe(() => {
      // Call refreshTable() when deletion is complete
      this.getTaxData();
    });
  }
  editTaxData(element: any){
    this.element = element
    const dialogRefeditForTaxEdit = this.dialog.open(EditTaxDetailsComponent, {
      disableClose: true,
      data: {
        element: this.element
      }
    });
    dialogRefeditForTaxEdit.componentInstance.viewComplete.subscribe(() => {
      this.getTaxData();
    });
  }

  editCharges(element: any){
    this.element = element
    const dialogRefeditForPINEdit = this.dialog.open(EditPinComponent, {
      disableClose: true,
      data: {
        element: this.element
      }
    });
    dialogRefeditForPINEdit.componentInstance.viewComplete.subscribe(() => {
      this.getPinCode();
    });
  }
  // EditOrderStatusComponent
  editOrderStatus(element: any){
    this.element = element
    const dialogRefeditForOrderdit = this.dialog.open(EditOrderStatusComponent, {
      disableClose: true,
      data: {
        element: this.element
      }
    });
    dialogRefeditForOrderdit.componentInstance.viewComplete.subscribe(() => {
      this.getOrderDetails();
    });
  }
  openInvoice(){
    this.showInvoice = true;
  }

  openPdf(element: any){
    
    var httpbody: Object={
      "userId": element.userId,
    "paymentId": element.paymentId,
    "productId": element.productId
    }
    console.log(element);
    this.sharedDataService.showLoader();
    try {
      
        this.http.post('https://api.themafic.com/api/Mafic/marketPlaceInvoice',httpbody,{
          responseType: 'blob' // Important to set responseType to 'blob' to handle binary data
        })
      .subscribe(data => {
        const blob = new Blob([data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        window.open(url);
        this.sharedDataService.hideLoader();
      },
        error => { },
        () => { });

    }
    catch (error) {
      console.error("not able to get response from marketPlaceInvoice API")
    }
  }
  
  // fetchHtml(filePath: string): Observable<string> {
  //   return this.http.get(filePath, { responseType: 'text' });
  // }
  
  // generatePdfFromHtml(htmlContent: string): void {
  //   const div = document.createElement('div');
  //   div.innerHTML = htmlContent;
  //   document.body.appendChild(div);

  //   html2canvas(div).then((canvas) => {
  //     const imgWidth = 208;
  //     const pageHeight = 295;
  //     const imgHeight = (canvas.height * imgWidth) / canvas.width;
  //     const pdf = new jsPDF('p', 'mm', 'a4');
  //     const position = 0;

  //     var invoiceURL = pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
  //     // pdf.save('converted.pdf');
  //     // window.open(invoiceURL,'_self')

  //     document.body.removeChild(div);
  //   });
  // }

  
  
  // openPdf(element: any): void {
  //   const filePath = 'assets/invoice.html';
  //   this.fetchAndGeneratePdf(filePath, element);
  // }

  // fetchAndGeneratePdf(filePath: string, elementData: any) {
    
  //   this.fetchHtml(filePath).subscribe((fileContent) => {
  //     this.createDynamicHtml(fileContent, elementData)
  //     this.generatePdfFromHtml(this.htmlContent);
  //   });    
  // }
  // createDynamicHtml(fileContent: string, elementData: any) {
  //   console.log(elementData)
  //   // Inject dynamic data into the HTML template
  //   this.htmlContent = fileContent.replace(/{{\s*(\w+)\s*}}/g, (match, key) => elementData[key]);
  // }
  // generatePdfFromHtml(htmlContent: string): void {
  //   const div = document.createElement('div');
  //   div.innerHTML = htmlContent;

  //   // // Update the HTML content with dynamic data
  //   // const invoiceElement = div.querySelector('.invoice-data');
  //   // if (invoiceElement) {
  //   //   invoiceElement.textContent = `Invoice Number: ${elementData.invoiceNumber}`;
  //   // }

  //   document.body.appendChild(div);

  //   html2canvas(div).then((canvas) => {
  //     const imgWidth = 208;
  //     const pageHeight = 295;
  //     const imgHeight = (canvas.height * imgWidth) / canvas.width;
  //     const pdf = new jsPDF('p', 'mm', 'a4');
  //     const position = 0;

  //     pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);

  //     // Generate blob URL for the PDF
  //     const blobUrl = URL.createObjectURL(pdf.output('blob'));

  //     // Open the PDF in a new tab
  //     window.open(blobUrl, '_blank');

  //     document.body.removeChild(div);
  //   });
  // }
  // fetchHtml(filePath: string): Observable<string> {
  //   return this.http.get(filePath, { responseType: 'text' });
  // }
}


