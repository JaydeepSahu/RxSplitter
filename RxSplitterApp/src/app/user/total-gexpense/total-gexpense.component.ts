import { Component, Input, OnInit } from '@angular/core';



@Component({
  selector: 'app-total-gexpense',
  templateUrl: './total-gexpense.component.html',
  styleUrls: ['./total-gexpense.component.css']
})
export class TotalGExpenseComponent implements OnInit {
  @Input()  groupExpenseListData ? : number;
  constructor() {
   
   }

   totalAmountG : any
  ngOnInit(): void {

    
    console.log('-------------totalExpense--------',this.groupExpenseListData)
  }


  

  

}
