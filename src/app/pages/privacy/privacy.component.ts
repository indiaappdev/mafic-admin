import { Component, OnInit, Inject  } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { SharedDataService } from 'src/app/shared/shared-data.service';

@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.component.html',
  styleUrls: ['./privacy.component.css']
})
export class PrivacyComponent implements OnInit {

  constructor(private http: HttpClient,public data:SharedDataService) {}

  ngOnInit(): void {
    this.data.checkAccess('survey');
  }

}
