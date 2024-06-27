import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-view-productcategory',
  templateUrl: './view-productcategory.component.html',
  styleUrls: ['./view-productcategory.component.css']
})
export class ViewProductcategoryComponent implements OnInit {
  viewComplete: EventEmitter<any> = new EventEmitter();
  imageUrl: any;
  constructor(private dialog:MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.imageUrl= data.element.images
     }

  ngOnInit(): void {
  }
  closepopup(){
    this.dialog.closeAll();
  }
}
