import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-descdialog',
  templateUrl: './descdialog.component.html',
  styleUrls: ['./descdialog.component.css']
})
export class DescdialogComponent implements OnInit {

  constructor(public dailogRef:MatDialogRef<DescdialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
                console.log(data)
               }

  ngOnInit(): void {
  }

}
