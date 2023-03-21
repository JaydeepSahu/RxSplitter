import { JsonPipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Token } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { Transaction } from '../model/transaction';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GroupServiceService {
  constructor(private _http: HttpClient) { }
   
  grpList: any[];
  
  auth_token =  JSON.parse(localStorage.getItem('Token') || '{}').value
 
  
  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${this.auth_token}`
  });
link=environment.link
// link="http://rxsplitterapi.live1.dev.radixweb.net/api/v1/"
// link="https://localhost:7228/api/v1/" 

  createGroup(GroupName:string, CurrencyId : number)
  {
    console.log(this.auth_token)
    return this._http.post(this.link+"Group/CreateGroup",{GroupName,CurrencyId},
    { headers: this.headers}
    )
  }

  GetAllGroupsByUserID()
 {
    return this._http.get(this.link+"Group/GetAllGroupsOfUser",{
    headers: this.headers
    })
  }

  createGroupMember(lstGroupMember:any, groupId : number)
  {
    console.log(this.auth_token)
    //
   
    return this._http.post(this.link+"GroupMember/CreateGroupMember/" + groupId,JSON.stringify(lstGroupMember),
    {
       headers: this.headers
    }
    )
  }
  getGroupDetailsByGrpId(id:number){
    //
    return this._http.get(this.link+"Group/GetGroupDetailsById/"+id,
    {
      headers:this.headers
    })
  }
  
 GetAllGroups()
  {
     return this._http.get(this.link+"Group/GetAllGroupsForAll",{
     headers: this.headers
     })
   }


  //  GetAllGroups(PageNumber:number,Entry?:number)
  //  {
  //     return this._http.get(this.link+"Group/GetAllGroupsForAll/" + PageNumber+'/'+Entry,{
  //     headers: this.headers
  //     })
  //   }

  getUserGroupDetailsByGrpId(id:number){
    //
    return this._http.get(this.link+"GroupMember/GetAllMembersByGroupId/"+id,
    {
      headers:this.headers
    })
  }
  

  addTransaction(transaction:Transaction)
  {
    //
    console.log('ttttttttttttttttttt',transaction)
    return this._http.post(this.link+"Expense/AddExpense",JSON.stringify(transaction),
    { headers: this.headers}
    )
  }

  getTransactionbyGroupId(id:Number, mode?:string){
    //;
    if(mode==null || mode==undefined || mode=='')
    {
      mode='All'
    }
    return this._http.get(this.link+'Expense/GetAllExpensesAccGroupId/'+mode+'/'+id,{
      headers:this.headers
    })
  }

  getTransactionbyUserId(PageNumber:number, Entries:number ,mode?:string){
    //;
    if(mode==null || mode==undefined || mode=='')
    {
      mode='All'
    }
    return this._http.get(this.link+'Expense/GetAllExpensesAccUserId/'+mode+'/'+PageNumber+'/'+Entries,{
    // return this._http.get(this.link+'Expense/GetAllExpensesAccUserId/'+mode,{
      headers:this.headers
    })
  }

  getSummarybyGroupId(id:Number){
    return this._http.get(this.link+"Expense/GetSummary?GroupId="+id,{
      headers:this.headers
    })
  }

  removeParticipantFromGrp(participantId:any,groupId:any)
  {
    return this._http.post(this.link+"GroupMember/DeleteGroupMember?memberId="+participantId+"&groupId="+groupId,"",{
      headers:this.headers
    })
  }
  
  GetDashboardDetails()
  {
    return this._http.get(this.link+"Expense/GetUserDashboardDetails",{
      headers:this.headers
    })
  }
  GetAllCategories()
  {
    return this._http.get(this.link+"Group/GetAllCategories",{
      headers:this.headers
    })
  }

  GetAllCurrency()
  {
    return this._http.get(this.link+"Group/GetAllCurrencies",{
      headers:this.headers
    })
  }
}
