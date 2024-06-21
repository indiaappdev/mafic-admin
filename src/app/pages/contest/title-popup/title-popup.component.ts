import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-title-popup',
  templateUrl: './title-popup.component.html',
  styleUrls: ['./title-popup.component.css']
})
export class TitlePopupComponent implements OnInit {

  constructor(public dailogRef:MatDialogRef<TitlePopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
  }

}
