import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedDataService } from 'src/app/shared/shared-data.service';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.css']
})
export class AdminLayoutComponent implements OnInit {

  url:string;
  constructor(private router:Router,private data:SharedDataService) { }

  ngOnInit(): void {
    console.log( this.router.url);
    this.url =  this.router.url;
    if(this.url.includes('cms'))
      this.data.collapse = true;
    else
      this.data.collapse = false;
  }

}
