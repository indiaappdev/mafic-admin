import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { GlobalErrorHandler } from 'global-error-handler';
import { MatSliderModule } from '@angular/material/slider';
import { NgxImageZoomModule } from 'ngx-image-zoom';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';

import { ReactiveFormsModule } from '@angular/forms';
import {NgSelectizeModule } from 'ng-selectize';
import { CommonModule, DatePipe } from '@angular/common';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { MatDialogModule } from '@angular/material/dialog';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { AdminLayoutComponent } from './layout/admin-layout/admin-layout.component';
import { HeaderComponent } from './common/header/header.component';
import { SidebarModule } from './common/sidebar/sidebar.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CookieService } from 'ngx-cookie-service';
import { AuthGuard } from './services/auth.guard';
import { MarketComponent } from './pages//market/market.component'
import { AddProductCategoryComponent } from './pages/market-info/product-category/add-product-category/add-product-category.component';
import { MatInputModule } from '@angular/material/input';
import { DeleteProductcategoryComponent } from './pages/market-info/product-category/delete-productcategory/delete-productcategory.component';
import { EditProductcategoryComponent } from './pages/market-info/product-category/edit-productcategory/edit-productcategory.component';
import { ViewProductcategoryComponent } from './pages/market-info/product-category/view-productcategory/view-productcategory.component';
import { AddProductComponent } from './pages/market-info/product-details/add-product/add-product.component';
import { DeleteProductDetailsComponent } from './pages/market-info/product-details/delete-product-details/delete-product-details.component';
import { EditProductDetailsComponent } from './pages/market-info/product-details/edit-product-details/edit-product-details.component';
import { ViewProductDetailsComponent } from './pages/market-info/product-details/view-product-details/view-product-details.component';
import { MatSelectModule } from '@angular/material/select';
import { EditTaxDetailsComponent } from './pages/market-info/tax-details/edit-tax-details/edit-tax-details.component';
import { DeleteTaxDetailsComponent } from './pages/market-info/tax-details/delete-tax-details/delete-tax-details.component';
import { AddTaxDetailsComponent } from './pages/market-info/tax-details/add-tax-details/add-tax-details.component';
import { EditPinComponent } from './pages/market-info/PIN-details/edit-pin/edit-pin.component';
import { EditOrderStatusComponent } from './pages/market-info/order-details/edit-order-status/edit-order-status.component';
import { InvoiceComponent } from './pages/market-info/order-details/invoice/invoice.component';
import { EditProductTermsComponent } from './pages/market-info/terms-details/edit-product-terms/edit-product-terms.component';
import { AddProductTermsComponent } from './pages/market-info/terms-details/add-product-terms/add-product-terms.component';
import { DeleteProductTermsComponent } from './pages/market-info/terms-details/delete-product-terms/delete-product-terms.component';
import { ViewProductTermsComponent } from './pages/market-info/terms-details/view-product-terms/view-product-terms.component';
import { ViewProductTermsAddComponent } from './pages/market-info/product-details/view-product-terms-add/view-product-terms-add.component';

const ErrorHandler = new GlobalErrorHandler();

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LoginComponent,
    AdminLayoutComponent,
    MarketComponent,
    AddProductCategoryComponent,
    DeleteProductcategoryComponent,
    EditProductcategoryComponent,
    ViewProductcategoryComponent,
    AddProductTermsComponent,
    EditProductTermsComponent,
    DeleteProductTermsComponent,
    ViewProductTermsComponent,
    ViewProductTermsAddComponent,
    AddProductComponent,
    DeleteProductDetailsComponent,
    EditProductDetailsComponent,
    ViewProductDetailsComponent,
    EditTaxDetailsComponent,
    DeleteTaxDetailsComponent,
    AddTaxDetailsComponent,
    EditPinComponent,
    EditOrderStatusComponent,
    InvoiceComponent,
  ],
  imports: [
    MatSelectModule,
    MatInputModule,
    MatTableModule ,
    MatPaginatorModule,
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    MatCheckboxModule,
    FormsModule,
    SidebarModule,
    NgSelectizeModule,
    CommonModule,
    MatSliderModule,
    MatDialogModule,
    HttpClientModule,
    NgxImageZoomModule,
    NgxDaterangepickerMd.forRoot(),
    RouterModule.forRoot([
      { path: '', component: LoginComponent },
      {
        path: '',
        component: AdminLayoutComponent,
        children: [
            { path: '', loadChildren: () => import('./layout/admin-layout/admin-layout.module').then(m => m.AdminLayoutModule),canActivate: [AuthGuard] }
          ]}
    ]),
    BrowserAnimationsModule,
  ],
  providers: [
    {
      provide: ErrorHandler, 
      useClass: GlobalErrorHandler,
      
    },CookieService,
    DatePipe
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
