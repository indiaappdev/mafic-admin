import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-image-element',
  templateUrl: './image-element.component.html',
  styleUrls: ['./image-element.component.css']
})
export class ImageElementComponent implements OnInit {

  constructor(public dailogRef:MatDialogRef<ImageElementComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
  }
}
