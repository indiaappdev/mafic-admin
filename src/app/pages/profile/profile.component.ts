import { Component, OnInit } from '@angular/core';
import { SharedDataService } from 'src/app/shared/shared-data.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor(public data:SharedDataService) { }

  ngOnInit(): void {
  }

}
