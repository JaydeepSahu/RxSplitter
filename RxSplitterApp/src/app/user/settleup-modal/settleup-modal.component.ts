import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { SettleUpService } from 'src/app/services/settle-up.service';
import { UserGroups } from 'src/app/model/user-groups';
import { Transaction } from 'src/app/model/transaction';
import jwt_decode from 'jwt-decode';
import { GroupServiceService } from 'src/app/services/group-service.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-settleup-modal',
  templateUrl: './settleup-modal.component.html',
  styleUrls: ['./settleup-modal.component.css']
})
export class SettleupModalComponent implements OnInit {
  constructor(private _settleup:SettleUpService, private _grp:GroupServiceService) {
   }

   category:number=1;
   expenseForm: any;
   UserMemberId: any;
   Categories: any;
   CurrencyIcon:string="";
  ngOnInit() {
    //
    this._settleup.getPaymentAmount(this.grpId).subscribe((res:any)=>{
      //
      console.log("Showed+++++++++++++++++++++ ",res.response)
      this.paymentDetails=res.response
    })
    this.decoded = jwt_decode(JSON.parse(localStorage.getItem('Token') || '{}').value);
    console.log('You Name',this.decoded.Name)
    this.loggedUserVal=this.decoded.Name
    this._grp
        .getUserGroupDetailsByGrpId(this.grpId)
        .subscribe((res: any) => {
          this.participants = res.response;
          this.selectedId=this.participants[0].id
          this.participants = this.participants.filter(x=>x.name!=this.loggedUserVal)
          console.log("Prasahisd = ",this.participants)
          this.CurrencyIcon= res.response.length > 0 ? res.response[0].icon : "";
        })
    this._grp.getGroupDetailsByGrpId(this.grpId).subscribe((res:any)=>{
      this.grpName=res.response[0].groupName
    })
  }
  // @Input() isPayable="" 
  @Input() grpId:number

  grpName=""
  paymentDetails:any=[]
  participants=[]
  arr=[]
  decoded:any=[]
  loggedUserVal=""
  payableAmount=""
  selectedId=0
  selectedName=""
  SaveTransaction()
  {
    this.paymentDetails.amount=this.payableAmount
    this.paymentDetails.paidToId=this.selectedId
    let details=this.participants?.findIndex(x=>x.id==this.selectedId)
    this.paymentDetails.paidToName=this.participants[details].name
    this.paymentDetails.paidToEmail=this.participants[details].email
    this._settleup.SaveTransaction(this.grpId,JSON.stringify(this.paymentDetails)).subscribe((res:any)=>{
       
Swal.fire({
  position: 'top-end',
  icon: 'success',
  title: 'Transaction has been saved',
  showConfirmButton: false,
  timer: 1500
})
      document.getElementById('closeModal').click()
      window.location.reload()
    })
  }
}