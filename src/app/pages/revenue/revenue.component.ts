import { Component, OnInit } from '@angular/core';
import { SharedDataService } from 'src/app/shared/shared-data.service';

@Component({
  selector: 'app-revenue',
  templateUrl: './revenue.component.html',
  styleUrls: ['./revenue.component.css']
})
export class RevenueComponent implements OnInit {

  constructor(public data:SharedDataService) { }

  ngOnInit(): void {
  }

}
