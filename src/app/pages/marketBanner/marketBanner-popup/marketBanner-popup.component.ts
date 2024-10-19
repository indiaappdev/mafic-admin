import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-marketBanner-popup',
  templateUrl: './marketBanner-popup.component.html',
  styleUrls: ['./marketBanner-popup.component.css']
})
export class MarketBannerPopupComponent implements OnInit {

  constructor(public dailogRef:MatDialogRef<MarketBannerPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
  }

}
