import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportServicesService {

  constructor(private _http: HttpClient) { }
   
  grpList: any
  
  auth_token =  JSON.parse(localStorage.getItem('Token') || '{}').value
  
  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${this.auth_token}`
  });

//link="http://rxsplitterapi.live1.dev.radixweb.net/api/v1/"
link=environment.link

//link="https://localhost:7228/api/v1/" 

GetAllExpenseCharts()
{
   return this._http.get(this.link+"Report/getExpensesChart",{
   headers: this.headers
   })
 }

 GetGroupExpensesChart(groupId : number)
{
   return this._http.get(this.link+"Report/GetGroupExpensesChart?groupId="+ groupId,{
   headers: this.headers
   })
 }                                                                                          

 GetMonthwiseExpenses(year : number)
 {
    return this._http.get(this.link+"Report/GetMonthwiseExpenses?year="+ year,{
    headers: this.headers
    })
}

 //https://localhost:7228/api/v1/Report/GetMonthwiseExpenses?year=0
}
