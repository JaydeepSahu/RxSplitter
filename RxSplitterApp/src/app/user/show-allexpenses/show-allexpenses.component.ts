import { Component, OnInit } from '@angular/core';
import { GroupServiceService } from 'src/app/services/group-service.service';
import jwt_decode from 'jwt-decode';

@Component({
  selector: 'app-show-allexpenses',
  templateUrl: './show-allexpenses.component.html',
  styleUrls: ['./show-allexpenses.component.css']
})
export class ShowAllexpensesComponent implements OnInit {

  constructor(private _grp: GroupServiceService) { }
  decoded: any = []
  auth_token: any
  userId: number
  transactionLists: any = [];
  PageNumber:number=1;
  TotalPages: any;
  TotalData: number;
  DummyTransList: any;
  Entries: number=10;
  groups:any;
  ngOnInit(): void {
    // this.auth_token =  JSON.parse(localStorage.getItem('Token') || '{}').value
    // this.decoded = jwt_decode(this.auth_token);
    // console.log('decodejwt---UserId',this.decoded.Id)
    // this.userId=this.decoded.Id

    this._grp.getTransactionbyUserId(this.PageNumber,this.Entries,'All').subscribe((res: any) => {
      console.log('getTransactionbyGroupId ===> New', res);
      this.transactionLists = res.response.response;
      this.DummyTransList = res.response.response;
      this.TotalPages = parseInt(res.response.statusCode);
      console.log(parseInt(this.TotalPages));
      this.TotalData = res.response.status;
    })
    this._grp.GetAllGroupsByUserID().subscribe((res:any)=>{
      //
      this._grp.grpList=res.response;
      this.groups=res.response;
      console.log("Hiii")
      console.log(this.groups);
    })

  }
  counter(i: number) {
    return new Array(i);
  }

  GetExpenceAccDate(searchDate: any) {

    if(searchDate==null || searchDate=="")
    {
      this.transactionLists = this.DummyTransList;
    }
    else{
      this.transactionLists = this.DummyTransList.filter(x => new Date(x.date).toDateString() == new Date(searchDate).toDateString());
    }
  }

  GetDataAccPageNumber(PageNo: number, Entry?:number) {
    debugger;
    this.PageNumber=PageNo;
    this.Entries=Entry;
    var mode='All';
    this._grp.getTransactionbyUserId(PageNo,this.Entries,mode).subscribe((res: any) => {
      console.log('getTransactionbyGroupId ===> New', res.response);
      this.transactionLists = res.response.response;
      this.DummyTransList = res.response.response;
      this.TotalPages = parseInt(res.response.statusCode);
      console.log(parseInt(this.TotalPages));
      this.TotalData = res.response.status;
    })
  }

  GetExpenseAccGroup(GroupId: any) {
    if(GroupId==0)
    {
      this.transactionLists = this.DummyTransList;
    }
    else
    {
      this.transactionLists = this.DummyTransList.filter(x => x.groupId==GroupId);
    }
  }
  filter:string='All';
  GetExpenses(filter:string){
    // alert(filter)
    //;
    this._grp.getTransactionbyUserId(this.PageNumber,this.Entries,filter).subscribe((res:any)=>{
      console.log("getTransactionbyGroupId=========>",res.response)
      this.transactionLists=res.response.response;
    })
  }
  SearchDescription:string='';
}
