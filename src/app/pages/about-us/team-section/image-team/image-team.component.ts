import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-image-team',
  templateUrl: './image-team.component.html',
  styleUrls: ['./image-team.component.css']
})
export class ImageTeamComponent implements OnInit {

  constructor(public dailogRef:MatDialogRef<ImageTeamComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
  }
}
