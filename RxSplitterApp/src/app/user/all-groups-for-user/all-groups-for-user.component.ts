import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ParticipantsShare } from 'src/app/model/participants-share';
import { UserGroups } from 'src/app/model/user-groups';
import { GroupServiceService } from 'src/app/services/group-service.service';
import Swal from 'sweetalert2';
import { AllgroupMembersComponent } from '../allgroup-members/allgroup-members.component';
import { Transaction } from 'src/app/model/transaction';
import { PageEvent } from '@angular/material/paginator';


@Component({
  selector: 'app-all-groups-for-user',
  templateUrl: './all-groups-for-user.component.html',
  styleUrls: ['./all-groups-for-user.component.css']
})
export class AllGroupsForUserComponent implements OnInit {

  totalAmountG: number = 0;
  expenseForm: any;
  grpId : number;
  transactionLists: any = [];
  SearchGroup=""
  totalGroups : number

  constructor(public _service : GroupServiceService,private router:Router,  private route: ActivatedRoute,) { }
activeGroups:any;
inActiveGroups:any;

  ngOnInit(): void {
 

      this.loaderInvoked()
    console.log("*****************************************************************************")
    console.log(JSON.parse(localStorage.getItem('Token') || '{}').value.token)
    this._service.GetAllGroups().subscribe((res:any)=>{
      this._service.grpList= res.response
      console.log('groups**********',res)
      this.groups=res.response
      console.log("*****************************************************************************")
    this.activeGroups=res.response.filter(x=>x.isActive==true);
    this.inActiveGroups=res.response.filter(x=>x.isActive==false);

      this.totalGroups = res.response.length;

      this.TotalPages = parseInt(res.response.statusCode);
      console.log(parseInt(this.TotalPages));
      this.TotalData = res.response.status;
    })
  }

  loader=false
  loaderInvoked(){
    if(this.loader)
    this.loader=false
    else{
      this.loader=true
    }
  }


  groups:any=[]
  send(id:Number)
  {
    this.router.navigate(['groupDetails/'+id])
   // this.router.navigate(['groupMembersDetails/'+id])
  }


  ////-------------Paging-----------------------

  PageNumber:number=1;
  TotalPages: any;
  Entries: number=8;
  TotalData: number;

  GetDataAccPageNumber(PageNo: number, Entry?:number) 
  {
    this.PageNumber=PageNo;
    this.Entries=Entry;
   
    this._service.GetAllGroups().subscribe((res: any) => {
      console.log('GetAllGroups ===> New', res.response);
      this.transactionLists = res.response.response;
     console.log('-------paging---------' ,this.transactionLists.length)
    })
  }

  counter(i: number) {
    return new Array(i);
  }

  
}


