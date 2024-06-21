import { Component, OnInit, Inject  } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SharedDataService } from 'src/app/shared/shared-data.service';

@Component({
  selector: 'app-contest-details',
  templateUrl: './contest-details.component.html',
  styleUrls: ['./contest-details.component.css']
})
export class ContestDetailsComponent implements OnInit {

  
  
  constructor(public dailogRef:MatDialogRef<ContestDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data1: any, public data:SharedDataService) {
      console.log(data1);

     }


  ngOnInit(): void {

  }

}

