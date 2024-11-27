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
import { AddMarketBannerComponent } from '../marketBanner/add-marketBanner/add-marketBanner.component';
import { DeleteMarketBannerComponent } from '../marketBanner/delete-marketBanner/delete-marketBanner.component';
import { EditMarketBannerComponent } from '../marketBanner/edit-marketBanner/edit-marketBanner.component';
import { MarketBannerPopupComponent } from '../marketBanner/marketBanner-popup/marketBanner-popup.component';
import { EditProductTermsComponent } from '../market-info/terms-details/edit-product-terms/edit-product-terms.component';
import { AddProductTermsComponent } from '../market-info/terms-details/add-product-terms/add-product-terms.component';
import { DeleteProductTermsComponent } from '../market-info/terms-details/delete-product-terms/delete-product-terms.component';
import { ViewProductTermsComponent } from '../market-info/terms-details/view-product-terms/view-product-terms.component';

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
  @ViewChild('paginatorForTandC', { static: false }) paginatorForTandC!: MatPaginator;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  userDetails:any = [];
  popupClass:string;
  displayedColumns: string[] = ['id' , 'text', 'image', 'action'];
  dataSource:MatTableDataSource<any>;
  cNameDetails:any = [];
  cName = '';
  cID:number;

  configs = {
    labelField: 'label',
    valueField: 'value',
    maxItems: 1,
    highlight: true,
    create: false,
  };

  data = [
    {
      label: 'Show All',
      value: '1'
    },
      {
      label: 'Unread',
      value: '2'
    },
      {
      label: 'Read',
      value: '3'
    }
  ]

  ProductCategoryList: any[] = [];
  ProductData: any[] = [];
  TaxData: any[] = [];
  PinData: any[] = [];
  OrderDetails: any[] = [];
  TandCDetails: any[] = [];
  res: any;
  currentPage = 1;
  itemsPerPage = 10;
  currentItems: any[] = [];
  fileContent: string;
  htmlContent: string;
  slugOptions: any[] = [];

  dataSourceForProductCategory: MatTableDataSource<any>;
  dataSourceForProductDetails: MatTableDataSource<any>;
  dataSourceForTax: MatTableDataSource<any>;
  dataSourceForPin: MatTableDataSource<any>;
  dataSourceForOrderDetails: MatTableDataSource<any>;
  dataTandCDetails: MatTableDataSource<any>;

  displayedColumnsForProductCategory: string[] = ['ID', 'CATEGORY', 'IMAGE', 'ACTION'];
  displayedColumnsForProductDetails: string[] = ['ID', 'NAME', 'CATEGORY', 'PRICE', 'DISCOUNT', 'DISCOUNT_PRICE', 'QUANTITY', 'SKU', 'SIZE', 'WEIGHT', 'IMAGE', 'ACTION'];
  displayedColumnsForTax: string[] = ['ID', 'SAC_HSN', 'SACHSN_Code', 'Description', 'CGST', 'SGST', 'IGST', 'ACTION'];
  displayedColumnsForPin: string[] = ['ID', 'PO NAME', 'PIN-Code', 'DISTRICT', 'CITY', 'STATE', 'DELIVERY CHARGE', 'ACTION'];
  displayedColumnsForOrderDetails: string[] = ['ID', 'OrderId', 'PRODUCT', 'NAME', 'PRICE', 'QUANTITY', 'DISCOUNT(%)', 'GST', 'TOTAL', 'DATE', 'STATUS', 'INVOICE', 'UPDATE'];
  displayedColumnsForTandCDetails: string[] = ['SiNo', 'SLUG', 'TITLE', 'IMAGE', 'ACTION'];
  
  formDataforProductCategory = {
    text: '',
    id: ''
  };
  element: any;
  element1: any;
  showInvoice: boolean = false;
  isCollapsed: boolean = true;
  isCollapsedBanner: boolean = true;
  isCollapsedProductDetils: boolean = true;
  isCollapsedTax:  boolean = true;
  isCollapsedPIN: boolean = true;
  isCollapsedOrder: boolean = true;
  isOrderDetailsExpanded: boolean = true;
  isTandCDetailsExpanded: boolean = true;
  constructor(private http: HttpClient,
    public sharedDataService: SharedDataService,
    public datePipe: DatePipe,
    private dialog: MatDialog,) {
    this.getDataforProductCategory();
    this.getProductDetails();
    this.getTaxData();
    this.getPinCode();
    this.getOrderDetails();
    this.getTandCDetails();
    this.getTableData();
    this.fetchSlugData();
  }
  pdfSrc: string = '';
 
  ngOnInit() {
  }

  fetchSlugData(): void {
    const apiUrl = 'https://api-dev.themafic.co.in/api/terms/keys';
    this.http.get<any>(apiUrl).subscribe(response => {
      if (response.status === 200 && response.data) {
        this.slugOptions = response.data; // Store the API response
      }
    }, error => {
      console.error('Error fetching slug data', error); // Handle the error
    });
  }

  getSlugDisplayName(slug: string): string {
    const option = this.slugOptions.find(option => option.slug === slug);
    return option ? option.name : slug; // Fallback to slug if no match is found
  }

  ngOnchanges() {
    this.refreshTable();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  addCategory(data:any) {
    const dialogRef = this.dialog.open(AddMarketBannerComponent,{
      disableClose: true,
      data: {
        categoryData: data
      }});

    dialogRef.afterClosed().subscribe(result => {
      this.getTableData();
    });
    console.log(data);
  }

  openDeleteDialog(data:any) {
    const dialogRef = this.dialog.open(DeleteMarketBannerComponent,{
      disableClose: true,
      data: {
        categoryData: data
      }});
    dialogRef.afterClosed().subscribe(result => {
      this.getTableData();
    });
    console.log(data);
  }

  openEditDialog(data:any) {
    const dialogRef = this.dialog.open(EditMarketBannerComponent,{
      disableClose: true,
      data: {
        categoryData: data
      }});

    dialogRef.afterClosed().subscribe(result => {
      this.getTableData();
    });
    console.log(data);
  }


  imageOpen(data1:any){
    this.dialog.open(MarketBannerPopupComponent,{data:{
      value:data1
    }});
  }

  getTableData(){
    this.http.get(''+this.sharedDataService.apiDomainPathDashTwo+'banner',{}) // Get Category details
    .subscribe(data => {
      console.log(data);
      this.userDetails = data;
      this.userDetails = this.userDetails.response;
      this.dataSource = new MatTableDataSource(this.userDetails);
    }),
    // this.http.get(''+this.sharedDataService.apiDomainPathDash+'getCategoryTitle',{}) // Get Category details
    // .subscribe(data => {
    //   console.log(data);
    //   this.cNameDetails = data;
    //   this.cID = this.cNameDetails.response[0].id;
    //   this.cName = this.cNameDetails.response[0].title;
    // },
    // err => {
    //   // Swal.fire(err);
    // });
    this.popupClass = "popupHead d-none"
  }

  uplodInfo:any = [];
  
  updateCName(){
    if(this.cName == ''){
      this.sharedDataService.firePopup(false,'Please enter contest name');
      return;
    }
    this.sharedDataService.showLoader();
    this.http.post(''+this.sharedDataService.apiDomainPathDash+'editCategoryTitle',{title:this.cName}) // Set Category details
    .subscribe(data => {
      console.log(data);
      this.sharedDataService.hideLoader();
        this.uplodInfo = data;
        if(this.uplodInfo.responseCode == "200"){
          this.sharedDataService.firePopup(true,'Data Updated');
          this.getTableData();
        } else if(this.uplodInfo.responseCode == 803) {
          this.sharedDataService.firePopup(false,'Something went wrong..!!!');
        }else {
          this.sharedDataService.firePopup(false,this.uplodInfo.responseMsg);
        }
    },
    err => {
      // Swal.fire(err);
    });
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
  toggleCollapseBanner() {
    this.isCollapsedBanner = !this.isCollapsedBanner;
  }
  toggleCollapseProductDetils() {
    this.isCollapsedProductDetils = !this.isCollapsedProductDetils;
  }
  toggleCollapseTax() {
    this.isCollapsedTax = !this.isCollapsedTax;
  }
  toggleCollapsePIN() {
    this.isCollapsedPIN = !this.isCollapsedPIN;
  }
  toggleCollapseOrder() {
    this.isCollapsedOrder = !this.isCollapsedOrder;
  }
  toggleOrderDetails() {
    this.isOrderDetailsExpanded = !this.isOrderDetailsExpanded;
  }
  toggleTandCDetails() {
    this.isTandCDetailsExpanded = !this.isTandCDetailsExpanded;
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
      this.http.get('https://api-dev.themafic.co.in/api/products').subscribe(data => {
        console.log(data);
        this.res = data;
        console.log(this.res)
        if (this.res.status == 200) {
          this.ProductData = this.res.data;
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

  getTandCDetails() {
    try {
      this.http.get('https://api-dev.themafic.co.in/api/terms', {}).subscribe(data => {
        console.log(data);
        this.res = data;
        console.log(this.res)
        if (this.res.status == 200) {
          this.TandCDetails = this.res.data;
          console.log(this.TandCDetails)
        }

      }, error => { },
        () => {
          console.log(this.TandCDetails)
          this.dataTandCDetails = new MatTableDataSource<any>();
          this.dataTandCDetails.data = this.TandCDetails
          this.dataTandCDetails.paginator = this.paginatorForTandC;
          console.log(this.dataTandCDetails)
        });

    }
    catch (error) {
      console.error("not able to get response from getProductCategory API")
    }
  }  

  addProductCategory() {
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

  openViewContentPopup(element: any) {
    this.element = element
    const dialogRefContentview = this.dialog.open(ViewProductTermsComponent, {
      disableClose: true,
      data: {
        element: this.element
      }
    });
    dialogRefContentview.componentInstance.viewComplete.subscribe(() => {
      // Call refreshTable() when deletion is complete
      this.getTandCDetails();
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

  addTandCDetails(){
    const dialogRef = this.dialog.open(AddProductTermsComponent, {
      disableClose: true,
      data: {
        
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      // Refresh the parent table here
      this.getTandCDetails();
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

  editTandCStatus(element: any){
    this.element = element
    const dialogRefeditForTandCedit = this.dialog.open(EditProductTermsComponent, {
      disableClose: true,
      data: {
        element: this.element
      }
    });
    dialogRefeditForTandCedit.componentInstance.viewComplete.subscribe(() => {
      // Call refreshTable() when deletion is complete
      this.getTandCDetails();
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

  deleteTandCDetails(element: any){
    this.element = element
    const dialogRefDeleteForTandCDetails = this.dialog.open(DeleteProductTermsComponent, {
      disableClose: true,
      data: {
        element: this.element
      }
    });
    dialogRefDeleteForTandCDetails.componentInstance.deleteComplete.subscribe(() => {
      // Call refreshTable() when deletion is complete
      this.getTandCDetails();
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

  // editTandCStatus(element: any){
  //   this.element = element
  //   const dialogRefeditForTandCedit = this.dialog.open(EditOrderStatusComponent, {
  //     disableClose: true,
  //     data: {
  //       element: this.element
  //     }
  //   });
  //   dialogRefeditForTandCedit.componentInstance.viewComplete.subscribe(() => {
  //     this.getTandCDetails();
  //   });
  // }

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


