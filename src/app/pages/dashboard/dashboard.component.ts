import { Component, OnInit } from '@angular/core';
import { ViewEncapsulation } from '@angular/core';
import Chart from 'chart.js/auto';
import { SharedDataService } from 'src/app/shared/shared-data.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class DashboardComponent implements OnInit {
  ctx:any;
  myChart:any;
  selectedDate:any;
  eventSpamData:any = [];

  JuryDetails:any = [];
  eventsDetails:any = [];
  userDetails:any =  []

  constructor(public data:SharedDataService,private http: HttpClient) { }

  ngOnInit(): void {

    this.http.get(''+this.data.apiDomainPathDash+'totalJuryCount') // Get Jury details
    .subscribe(data => {
      console.log(data);
      this.JuryDetails = data;
    });

    this.http.post(''+this.data.apiDomainPath+'getEvents',{}) // Get contest details
    .subscribe(data => {
      console.log(data);
      this.eventsDetails = data;
    });

    this.http.post(''+this.data.apiDomainPathDash+'getAllUsers',{}) // Get user details
    .subscribe(data => {
      this.userDetails = data;
    });

    this.http.post(''+this.data.apiDomainPathDash+'getReportAsSpam',{}) // Get spam details
    .subscribe(data => {
      console.log(data);
      this.eventSpamData = data;
      this.eventSpamData = this.eventSpamData.response;
    });


  this.ctx = document.getElementById('myChart');
  this.myChart = new Chart(this.ctx, {
      type: 'bar',
      data: {
          labels: ["01/2016", "02/2016", "03/2016", "04/2016", "05/2016", "06/2016", "07/2016"],
          datasets: [{
              label: "Contest",
              backgroundColor: "rgba(2,93,131,1)",
              borderColor: "rgba(2,93,131,1)",
              borderWidth: 2,
              barPercentage: 0.6,
              data: [30, 75, 46, 71, 70, 20, 65]
            },
            {
              label: "Ecommerce",
              backgroundColor: "rgba(112,193,179,1)",
              borderColor: "rgba(112,193,179,1)",
              borderWidth: 2,
              barPercentage: 0.7,
              data: [65, 20, 70, 80, 46, 75, 30],
            }
          ]
      },
      options: {
          scales: {
              y: {
                  beginAtZero: true
              }
          }
      }
  });
  }

}
