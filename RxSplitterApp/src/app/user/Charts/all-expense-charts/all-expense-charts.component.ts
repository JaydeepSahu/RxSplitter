import { Component, OnInit } from '@angular/core';
import { chartDataAllExpenses } from 'src/app/model/chartDataAllExpenses';
import { ReportServicesService } from 'src/app/services/report-services.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-all-expense-charts',
  templateUrl: './all-expense-charts.component.html',
  styleUrls: ['./all-expense-charts.component.css']
})
export class AllExpenseChartsComponent implements OnInit {

  constructor(public reportServices : ReportServicesService) { }

  ngOnInit(): void {
    
    this.reportServices.GetAllExpenseCharts().subscribe((res: any) => {
      console.log('****GetAllExpenseCharts*****', res.response);
      this.saleData=res.response
       //this.symbolV = res.response[0].symbol
      console.log('****GetAllExpenseCharts*****', this.saleData);
      
    });

  }




  saleData : chartDataAllExpenses[] =[] 
  symbolV : string 
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
