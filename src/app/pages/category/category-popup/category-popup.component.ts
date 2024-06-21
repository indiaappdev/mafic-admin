import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-category-popup',
  templateUrl: './category-popup.component.html',
  styleUrls: ['./category-popup.component.css']
})
export class CategoryPopupComponent implements OnInit {

  constructor(public dailogRef:MatDialogRef<CategoryPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
  }

}
