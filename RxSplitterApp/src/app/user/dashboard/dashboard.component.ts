import { Component, OnInit } from '@angular/core';
import { GroupServiceService } from 'src/app/services/group-service.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(private _groupService:GroupServiceService) { }
DashboardData:any;
totalGroups: number;


  ngOnInit(): void {
    this._groupService.GetDashboardDetails().subscribe((data:any)=>{
      this.DashboardData=data.response[0];

      console.log('Dashboard data',this.DashboardData)
    });

    this._groupService.GetAllGroups().subscribe((res:any)=>{
   
      this.totalGroups = res.response.length
    })
  }

}
