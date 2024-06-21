import { Component, OnInit } from '@angular/core';
import { SharedDataService } from 'src/app/shared/shared-data.service';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.css']
})
export class AboutUsComponent implements OnInit {

  constructor(public data:SharedDataService) { }

  ngOnInit(): void {
    this.data.checkAccess('survey');
  }

}
