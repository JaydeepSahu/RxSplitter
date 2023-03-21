import { Component, OnInit } from '@angular/core';
import { chartDataGroupExpenses } from 'src/app/model/chartDataGroupExpense';
import { GroupServiceService } from 'src/app/services/group-service.service';
import { ReportServicesService } from 'src/app/services/report-services.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-group-expenses-charts',
  templateUrl: './group-expenses-charts.component.html',
  styleUrls: ['./group-expenses-charts.component.css']
})
export class GroupExpensesChartsComponent implements OnInit {

  constructor(public reportServices : ReportServicesService , public _grp : GroupServiceService) { }
 
  groups : any
  dummyList : []
  GroupId : number

  ngOnInit(): void {
    ;

    this._grp.GetAllGroupsByUserID().subscribe((res:any)=>{
      this.groups=res.response;
      console.log("Hiii")
      console.log(this.groups);
    })

    this.reportServices.GetAllExpenseCharts().subscribe((res: any) => {
      ;
     // console.log('****GetAllExpenseCharts*****', res.response);
      this.saleData=res.response
      console.log('****GetAllExpenseCharts*****', this.saleData);
    });
  }
  saleData : chartDataGroupExpenses[] =[] 

  GetChartAccGroup(GroupId: number) {
    if(GroupId!=0)
    {
      this.reportServices.GetGroupExpensesChart(GroupId).subscribe((res: any) => {
        console.log('****GetGroupExpensesChart*****', res.response);
        this.saleData =res.response;
      });
    }
    else
    {
      this.reportServices.GetAllExpenseCharts().subscribe((res: any) => {
        ;
        this.saleData=res.response
        console.log('****GetAllExpenseCharts*****', this.saleData);
      });
    }
  }

  fileName = 'export-data.xlsx'
  exportExcel (): void 
  {
  let element = document.getElementById('excel-table');
   // let element = this.saleData[0].name;
    const ws:XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
    const wb:XLSX.WorkBook= XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb,ws,'sheet1')
    XLSX.writeFile(wb, this.fileName)
  }

  
  
}
