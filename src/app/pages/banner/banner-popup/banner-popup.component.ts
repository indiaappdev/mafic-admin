import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-banner-popup',
  templateUrl: './banner-popup.component.html',
  styleUrls: ['./banner-popup.component.css']
})
export class BannerPopupComponent implements OnInit {

  constructor(public dailogRef:MatDialogRef<BannerPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
  }

}
