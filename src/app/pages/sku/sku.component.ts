import { Component, OnInit, AfterViewInit, ViewChild  } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {MatPaginator} from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { SharedDataService } from 'src/app/shared/shared-data.service';
import {MatDialog} from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { DeleteSkuComponent } from './delete-sku/delete-sku.component';
declare var $: any;

@Component({
  selector: 'app-sku',
  templateUrl: './sku.component.html',
  styleUrls: ['./sku.component.css']
})
export class SkuComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;

  skuDetails       :any = [];
  popupClass        :string;
  displayedColumns  : string[] = ['id', 'name', 'description', 'image','price','discount', 'sac_gst_code', 'gst', 'active', 'action', 'invoice'];
  dataSource        :MatTableDataSource<any>;
  image:string = '';
  
  constructor(private http    : HttpClient, 
              private dialog  : MatDialog, 
              public datas    : SharedDataService) { }

  openDeleteDialog(data:any) {
    const dialogRef = this.dialog.open(DeleteSkuComponent,{
      disableClose: true,
      data: {
        data: data
      }});

    dialogRef.afterClosed().subscribe(result => {
      this.getTableData();
    });
    // console.log(data);
  }


  ngOnInit(): void {
    this.getTableData();
    this.datas.checkAccess('sku');
  }
  getTableData(){
    this.http.post(''+this.datas.apiDomainPathDash+'getSku',{}) // Get sku details
    .subscribe(data => {
      console.log(data);
      this.skuDetails = data;
      this.skuDetails = this.skuDetails.response;
      this.setTableData(this.skuDetails);
    });
    this.popupClass = "popupHead d-none"
  }

  openImage(url:string){
    this.image = url;
    $("#image_pup_sku").modal("show");
  }

  setTableData(tData:any){
    this.dataSource = new MatTableDataSource(tData);
      this.dataSource.paginator = this.paginator;
      console.log(this.dataSource);
      // this.dataSource.sort = this.sort;
      setTimeout(() => {
        this.dataSource.sort = this.sort;
      });
  }

}

