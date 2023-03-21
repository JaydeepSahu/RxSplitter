import { Component, Input, OnInit } from '@angular/core';
import { SettleUpService } from 'src/app/services/settle-up.service';
import jwt_decode from 'jwt-decode';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-settle-up',
  templateUrl: './settle-up.component.html',
  styleUrls: ['./settle-up.component.css']
})
export class SettleUpComponent implements OnInit {

  pendingonMeCount:number = 0;
  constructor(private _settleup:SettleUpService) {
  }

 ngOnInit() {


   this._settleup.getTransaction(this.grpId).subscribe((res:any)=>{
     
     console.log("transactionList+++++++++++++++++++++ ",res.response)
     
     this.transactionList=res.response;
     this.lstPendingOnMe = this.transactionList.filter(x => x.isLoggedIn == 1 && x.status == "Pending");
     this.lstPendingOnOthers = this.transactionList.filter(x => x.status == "Pending" && x.paidTo!= this.decode.Name);
   })
    this.decode = jwt_decode(JSON.parse(localStorage.getItem('Token') || '{}').value);
    console.log('decodejwt',this.decode.Name)
    this.loggedUserVal=this.decode.Name

    // this.settledAmount()
 }
 @Input() grpId:Number=0
 @Input() Transaction:Number
 transactionList=[]
 lstPendingOnMe=[]
 lstPendingOnOthers=[]
 loggedUserVal=""
 decode:any
settleAmount=0
pendingOnMe=0
pendingOnOthers=0

  
accept(id:any)
{
  this._settleup.acceptTransaction(id).subscribe((res:any)=>{
     
Swal.fire({
  position: 'top-end',
  icon: 'success',
  title: 'Your work has been saved',
  showConfirmButton: false,
  timer: 1500
})
    window.location.reload()
  })
}

}
