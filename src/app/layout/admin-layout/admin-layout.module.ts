import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {NgSelectizeModule } from 'ng-selectize';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { MatTableModule } from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { HttpClientModule } from '@angular/common/http';
import { NgxImageZoomModule } from 'ngx-image-zoom';
import {ClipboardModule} from '@angular/cdk/clipboard';
import { AuthGuard } from 'src/app/services/auth.guard';


import {MatButtonModule} from '@angular/material/button';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatNativeDateModule} from '@angular/material/core';
import {MatChipsModule} from '@angular/material/chips';
import {MatDialogModule} from '@angular/material/dialog';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatSortModule} from '@angular/material/sort';
import {CdkTableModule} from '@angular/cdk/table';
import {A11yModule} from '@angular/cdk/a11y';

import { DashboardComponent } from 'src/app/pages/dashboard/dashboard.component';
import { UserComponent } from 'src/app/pages/user/user.component';
import { RevenueComponent } from 'src/app/pages/revenue/revenue.component';
import { ContestComponent } from 'src/app/pages/contest/contest.component';
import { AddUserComponent } from 'src/app/pages/add-user/add-user.component';
import { ProfileComponent } from 'src/app/pages/profile/profile.component';

import { DeletePopComponent } from 'src/app/pages/user/delete-pop/delete-pop.component';
import { DeleteContestComponent } from 'src/app/pages/contest/delete-contest/delete-contest.component';
import { EditContestComponent } from 'src/app/pages/contest/edit-contest/edit-contest.component';
import { DeletePopComponent as DeletePopRoleComponent } from 'src/app/pages/role/delete-pop/delete-pop.component';
import { ManageModuleComponent } from 'src/app/pages/role/manage-module/manage-module.component';
import { AddRoleComponent } from 'src/app/pages/role/add-role/add-role.component';
import { EditRoleComponent } from 'src/app/pages/role/edit-role/edit-role.component';
import { EditUserPopComponent } from 'src/app/pages/user/edit-user-pop/edit-user-pop.component';
import { TitlePopupComponent } from 'src/app/pages/contest/title-popup/title-popup.component';
import { ContestDetailsComponent } from 'src/app/pages/contest/contest-details/contest-details.component';
import { EntriesComponent } from 'src/app/pages/contest/entries/entries.component';
import { ImagePopupComponent } from 'src/app/pages/contest/image-popup/image-popup.component';

import { SurveyComponent } from 'src/app/pages/survey/survey.component';
import { DescdialogComponent } from 'src/app/pages/descdialog/descdialog.component';
import { RoleComponent } from 'src/app/pages/role/role.component';
import { AddContestComponent } from 'src/app/pages/add-contest/add-contest.component';
import { BannerComponent } from 'src/app/pages/banner/banner.component';
import { BannerPopupComponent } from 'src/app/pages/banner/banner-popup/banner-popup.component';
import { BannerDeleteComponent } from 'src/app/pages/banner/banner-delete/banner-delete.component';
import { EditBannerComponent } from 'src/app/pages/banner/edit-banner/edit-banner.component';
import { BannerAddComponent } from 'src/app/pages/banner/banner-add/banner-add.component';
import { CategoryComponent } from 'src/app/pages/category/category.component';
import { DeleteCategoryComponent } from 'src/app/pages/category/delete-category/delete-category.component';
import { AddCategoryComponent } from 'src/app/pages/category/add-category/add-category.component';
import { EditCategoryComponent } from 'src/app/pages/category/edit-category/edit-category.component';
import { CategoryPopupComponent } from 'src/app/pages/category/category-popup/category-popup.component';
import { AboutComponent } from 'src/app/pages/about/about.component';
import { ContestCheckComponent } from 'src/app/pages/contest/contest-check/contest-check.component';
import { EventsComponent } from 'src/app/pages/events/events.component';
import { SurveyOverviewComponent } from 'src/app/pages/survey/survey-overview/survey-overview.component';
import { SurveyAnalysisComponent } from 'src/app/pages/survey/survey-analysis/survey-analysis.component';
import { SurveyAddComponent } from 'src/app/pages/survey/survey-add/survey-add.component';
import { SurveyAddQtnComponent } from 'src/app/pages/survey/survey-add-qtn/survey-add-qtn.component';
import { SurveyEditComponent } from 'src/app/pages/survey/survey-edit/survey-edit.component';
import { SurveyQtnEditComponent } from 'src/app/pages/survey/survey-qtn-edit/survey-qtn-edit.component';
import { SurveyDeleteComponent } from 'src/app/pages/survey/survey-delete/survey-delete.component';
import { SurveyQtnDeleteComponent } from 'src/app/pages/survey/survey-qtn-delete/survey-qtn-delete.component';
import { BlogsComponent } from 'src/app/pages/blogs/blogs.component';
import { AddBlogsComponent } from 'src/app/pages/add-blogs/add-blogs.component';
import { BlogsDeleteComponent } from 'src/app/pages/blogs/blogs-delete/blogs-delete.component';
import { EditBlogsComponent } from 'src/app/pages/blogs/edit-blogs/edit-blogs.component';
import { ExcelService } from 'src/app/pages/survey/services/ExcelServices';
import { ContactUsComponent } from 'src/app/pages/contact-us/contact-us.component';
import { FirstSectionComponent } from '../../pages/about-us/first-section/first-section.component';
import { SecondSectionComponent } from 'src/app/pages/about-us/second-section/second-section.component';
import { ThirdSectionComponent } from 'src/app/pages/about-us/third-section/third-section.component';
import { FourSectionComponent } from 'src/app/pages/about-us/four-section/four-section.component';
import { FifthSectionComponent } from 'src/app/pages/about-us/fifth-section/fifth-section.component';
import { TeamSectionComponent } from 'src/app/pages/about-us/team-section/team-section.component';
import { AboutUsComponent } from 'src/app/pages/about-us/about-us.component';
import { NewsLetterComponent } from 'src/app/pages/news-letter/news-letter.component';
import { FooterContentComponent } from 'src/app/pages/footer-content/footer-content.component';
import { HomeLastSecComponent } from 'src/app/pages/home-last-sec/home-last-sec.component';
import { CoreElementsComponent } from 'src/app/pages/core-elements/core-elements.component';
import { AddElementComponent } from 'src/app/pages/core-elements/add-element/add-element.component';
import { DeleteElementComponent } from 'src/app/pages/core-elements/delete-element/delete-element.component';
import { EditElementComponent } from 'src/app/pages/core-elements/edit-element/edit-element.component';
import { ImageElementComponent } from 'src/app/pages/core-elements/image-element/image-element.component';
import { AddTeamComponent } from 'src/app/pages/about-us/team-section/add-team/add-team.component';
import { EditTeamComponent } from 'src/app/pages/about-us/team-section/edit-team/edit-team.component';
import { DeleteTeamComponent } from 'src/app/pages/about-us/team-section/delete-team/delete-team.component';
import { ImageTeamComponent } from 'src/app/pages/about-us/team-section/image-team/image-team.component';
import { MetaDataComponent } from 'src/app/pages/meta-data/meta-data.component';
import { AssignJuryComponent } from 'src/app/pages/contest/assign-jury/assign-jury.component';
import { LogoComponent } from 'src/app/pages/logo/logo.component';
import { PrivacyComponent } from 'src/app/pages/privacy/privacy.component';
import { TermsConditionsComponent } from 'src/app/pages/privacy/terms-conditions/terms-conditions.component';
import { DisclaimerComponent } from 'src/app/pages/privacy/disclaimer/disclaimer.component';
import { ConsentOfDataComponent } from 'src/app/pages/privacy/consent-of-data/consent-of-data.component';
import { PrivacyPolicyComponent } from 'src/app/pages/privacy/privacy-policy/privacy-policy.component';
import { HeaderDetailsComponent } from 'src/app/pages/header-details/header-details.component';
import { BannerImageComponent } from 'src/app/pages/banner-image/banner-image.component';
import { DeleteEntryComponent } from 'src/app/pages/contest/delete-entry/delete-entry.component';
import { SkuComponent } from 'src/app/pages/sku/sku.component';
import { DeleteSkuComponent } from 'src/app/pages/sku/delete-sku/delete-sku.component';
import { EditSkuComponent } from 'src/app/pages/sku/edit-sku/edit-sku.component';
import { AddSkuComponent } from 'src/app/pages/sku/add-sku/add-sku.component';
import { InvoiceSkuComponent } from 'src/app/pages/sku/invoice-sku/invoice-sku.component';
import { QueryComponent } from 'src/app/pages/query/query.component';
import { SendResponseComponent } from 'src/app/pages/query/send-response/send-response.component';
import { ViewQueryComponent } from 'src/app/pages/query/view-query/view-query.component';
import { MarketComponent } from 'src/app/pages/market/market.component';
// const ErrorHandler = new GlobalErrorHandler();
const matDialogRefStub = {};

@NgModule({
  declarations: [
    DashboardComponent,
    UserComponent,
    RevenueComponent,
    SurveyComponent,
    ContestComponent,
    AddUserComponent,
    ProfileComponent,
    DeletePopComponent,
    EditUserPopComponent,
    RoleComponent,
    DeletePopRoleComponent,
    DeleteContestComponent,
    EditContestComponent,
    ContestDetailsComponent,
    EntriesComponent,
    ImagePopupComponent,
    TitlePopupComponent,
    DescdialogComponent,
    AddRoleComponent,
    AddContestComponent,
    EditRoleComponent,
    ManageModuleComponent,
    BannerComponent,
    BannerPopupComponent,
    BannerDeleteComponent,
    EditBannerComponent,
    BannerAddComponent,
    CategoryComponent,
    DeleteCategoryComponent,
    AddCategoryComponent,
    EditCategoryComponent,
    CategoryPopupComponent,
    AboutComponent,
    ContestCheckComponent,
    EventsComponent,
    SurveyOverviewComponent,
    SurveyAnalysisComponent,
    SurveyAddComponent,
    SurveyAddQtnComponent,
    SurveyEditComponent,
    SurveyQtnEditComponent,
    SurveyDeleteComponent,
    SurveyQtnDeleteComponent,
    BlogsComponent,
    AddBlogsComponent,
    BlogsDeleteComponent,
    EditBlogsComponent,
    ContactUsComponent,
    FirstSectionComponent,
    SecondSectionComponent,
    ThirdSectionComponent,
    FourSectionComponent,
    FifthSectionComponent,
    TeamSectionComponent,
    AboutUsComponent,
    NewsLetterComponent,
    FooterContentComponent,
    HomeLastSecComponent,
    CoreElementsComponent,
    AddElementComponent,
    DeleteElementComponent,
    EditElementComponent,
    ImageElementComponent,
    AddTeamComponent,
    EditTeamComponent,
    DeleteTeamComponent,
    ImageTeamComponent,
    MetaDataComponent,
    AssignJuryComponent,
    LogoComponent,
    PrivacyComponent,
    TermsConditionsComponent,
    DisclaimerComponent,
    ConsentOfDataComponent,
    PrivacyPolicyComponent,
    HeaderDetailsComponent,
    BannerImageComponent,
    DeleteEntryComponent,
    SkuComponent,
    DeleteSkuComponent,
    EditSkuComponent,
    AddSkuComponent,
    InvoiceSkuComponent,
    QueryComponent,
    SendResponseComponent,
    ViewQueryComponent
  ],
  entryComponents:[
    DeletePopComponent,
    EditUserPopComponent,
    DescdialogComponent,
    RoleComponent,
    SurveyDeleteComponent,
    SurveyQtnDeleteComponent,
    BlogsDeleteComponent,
    EditBlogsComponent,
    AddElementComponent,
    DeleteElementComponent,
    EditElementComponent,
    ImageElementComponent,
    AddTeamComponent,
    EditTeamComponent,
    DeleteTeamComponent,
    ImageTeamComponent,
    DeleteEntryComponent,
    DeleteSkuComponent,
    SendResponseComponent,
    ViewQueryComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgSelectizeModule,
    A11yModule,
    CdkTableModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule,
    MatChipsModule,
    MatCheckboxModule,
    MatSnackBarModule,
    MatInputModule,
    MatSelectModule,
    MatChipsModule,
    MatCheckboxModule,
    MatButtonModule,
    MatDialogModule,
    MatSortModule,
    ClipboardModule,
    NgxImageZoomModule,
    NgxDaterangepickerMd.forRoot(),
    RouterModule.forChild([
      { path: 'dashboard', component: DashboardComponent },
      { path: 'user', component: UserComponent },
      // { path: 'revenue', component: RevenueComponent },
      { path: 'survey', component: SurveyComponent },
      { path: 'survey/add-survey', component: SurveyAddComponent },
      { path: 'survey/survey-analysis/:sId', component: SurveyAnalysisComponent },
      { path: 'survey/survey-overview', component: SurveyOverviewComponent },
      { path: 'survey/add-survey', component: SurveyAddComponent },
      { path: 'survey/add-survey-qtn/:sId', component: SurveyAddQtnComponent },
      { path: 'survey/edit-survey/:sId', component: SurveyEditComponent },
      { path: 'survey/edit-survey-qtn/:sId', component: SurveyQtnEditComponent },
      { path: 'contest', component: ContestComponent },
      { path: 'user/add-user', component: AddUserComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'roles', component: RoleComponent },
      { path: 'contest/entries/:cId', component: EntriesComponent },
      { path: 'contest/add-contest', component: AddContestComponent },
      { path: 'contest/edit-contest/:cId', component: EditContestComponent },
      { path: 'cms/banner', component: BannerComponent },
      // { path: 'cms/category', component: CategoryComponent },
      { path: 'cms/about-us', component: AboutUsComponent },
      { path: 'cms/blogs', component: BlogsComponent },
      { path: 'cms/blogs/add-blogs', component: AddBlogsComponent },
      { path: 'events', component: EventsComponent },
      { path: 'contest/contest-details/:cId/:uId', component: ContestCheckComponent },
      { path: 'cms/contact-us', component: ContactUsComponent },
      { path: 'cms/news-letter', component: NewsLetterComponent },
      { path: 'cms/footer-content', component: FooterContentComponent },
      { path: 'cms/meta-data', component: MetaDataComponent },
      { path: 'cms/logo', component: LogoComponent },
      { path: 'contest/assign-jury/:cId/:rCount',component:AssignJuryComponent},
      { path: 'cms/privacy', component: PrivacyComponent },
      { path: 'cms/head-details', component: HeaderDetailsComponent },
      { path: 'cms/banner-image', component: BannerImageComponent },
      { path: 'sku', component: SkuComponent },
      { path: 'sku/edit-sku/:sId', component: EditSkuComponent },
      { path: 'sku/add-sku', component: AddSkuComponent },
      { path: 'sku/invoice-sku/:sId', component: InvoiceSkuComponent },
      { path: 'query', component: QueryComponent },
      {
    path:'market',
    component:MarketComponent
  }

    ]),
  ], 
  providers: [
    { 
      provide: MatDialogRef,
      useValue: [matDialogRefStub]
       }, 
      { 
      provide: MAT_DIALOG_DATA, 
      useValue: [] 
      },ExcelService
  ]
})
export class AdminLayoutModule { }
