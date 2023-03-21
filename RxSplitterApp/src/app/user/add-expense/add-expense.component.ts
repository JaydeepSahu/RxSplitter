import { formatDate } from '@angular/common';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ParticipantsShare } from 'src/app/model/participants-share';
import { Transaction } from 'src/app/model/transaction';
import { UserGroups } from 'src/app/model/user-groups';
import { GroupServiceService } from 'src/app/services/group-service.service';
import Swal from 'sweetalert2';
import jwt_decode from 'jwt-decode';
// import { AllgroupMembersComponent } from '../allgroup-members/allgroup-members.component';
// import { AllGroupsForUserComponent } from '../all-groups-for-user/all-groups-for-user.component';
@Component({
  selector: 'app-add-expense',
  templateUrl: './add-expense.component.html',
  styleUrls: ['./add-expense.component.css']
})
export class AddExpenseComponent implements OnInit {
ChoosenGroupId:number;
  loggedUserVal = '';
  decoded: any = [];
  todo = [];
  SearchDescription=""
  done = [];
  auth_token: any;
  transaction: Transaction = {};
  constructor(
    private route: ActivatedRoute,
    private _grp: GroupServiceService,
    private router:Router
  ) {
    this.auth_token = JSON.parse(localStorage.getItem('Token') || '{}').value;
    this.decoded = jwt_decode(this.auth_token);
    console.log('decodejwt', this.decoded.Name);
    this.loggedUserVal = this.decoded.Id;
    // route.params.subscribe((res) => {
    //   // console.log(res['GroupId']);
    //   // this.grpId = res['GroupId'];
    //   this.router.navigate(['/groupDetails/'+res['GroupId']])
    // });
   
  }
  category:number=1;
  expenseForm: any;
  UserMemberId: any;
  Categories: any;
  // @ViewChild(AllgroupMembersComponent) allgroupComponent: AllgroupMembersComponent;
  //  @ViewChild(AllGroupsForUserComponent) AllGroupsForUserComponent: AllGroupsForUserComponent;

  ngOnInit(): void {
    this._grp.GetAllCategories().subscribe((res: any) => {
          console.log('Categories ===> New', res.response);
          this.Categories=res.response;
    });
  
    if (this.month < 10) this.month = '0' + this.month;
    if (this.day < 10) this.day = '0' + this.day;

    this.today = `${this.year}-${this.month}-${this.day}`;

    ///Get Transaction
    this.expenseForm = new FormGroup({
      description: new FormControl('', [Validators.required]),
      totalAmount: new FormControl(0, [Validators.required]),
      date: new FormControl(this.today, [Validators.required]),
      groupId: new FormControl(),
      categoryId: new FormControl('1'),
      filePath: new FormControl(''),
      category:new FormControl('1', [Validators.required]), 
      paidBy: new FormControl(this.UserMemberId),
      participants: new FormArray([
        // id:new FormControl(),
        // new FormControl()
      ]),
    });
    console.log("Hiii")
    this._grp.GetAllGroupsByUserID().subscribe((res:any)=>{
      //
      this._grp.grpList=res.response;
      this.groups=res.response;
      console.log("Hiii")
      console.log(this.groups);
    })
    // this.expenseForm.patchValue({
    //   paidBy:this.list[this.list.findIndex(x=>x.email==this.decoded.Email)].id
    //  })
    this.myFunction();
    // document.getElementById("GroupIddd").querySelectorAll('input[type=checkbox]:checked').length

  }
  groups:any[];

  participantId=0
  groupName = '';
  // grpId!: any;
  expenditure = 0.0;
  transactionLists: any = [];
  totalAmountG: number = 0;

  list: any = [];
  participants: Array<UserGroups> = [];
  persons = this.participants.length;
  totalShare: any = 0.0;
  Participants(person: any) {
    //;
    console.log('Person Name', person.name);
    console.log('Participants', this.participants);
    if (this.participants.findIndex((x) => x.email == person.email) != -1) {
      this.participants = this.participants.filter(
        (x) => x.email != person.email
      );
      console.log('********', this.participants);
      this.persons = this.participants.length;
      this.totalShare = Number(this.expenditure / this.persons).toFixed(2);
    } else {
      this.participants.push(person);
      this.persons = this.participants.length;
      this.totalShare = Number(this.expenditure / this.persons).toFixed(2);
      console.log('****Adding****', this.participants);
    }
    this.selectedMember= document.getElementById("myDropdown").querySelectorAll('input[type=checkbox]:checked').length;
  }




  calculation() {
    this.totalShare = Number(this.expenditure / this.persons).toFixed(2);
  }
  clicked = true;
  class = 'dropdown-menu';
  dropDownClick() {
    if (this.clicked) {
      this.class = 'dropdown-menu show';
      this.clicked = false;
    } else {
      this.clicked = true;
      this.class = 'dropdown-menu';
    }
  }
  date = new Date();
  year = this.date.getFullYear();

  month: number | string = this.date.getMonth() + 1;
  day: number | string = this.date.getDate();
  today = '';
  selectedPerson = 's';
  selectedTeam = '';

  transactionParticipants: Array<ParticipantsShare> = [];
  SaveTransaction() {
    this.transactionParticipants = [];
    for (let users of this.list) {
      let flag = 0;
      for (let selectedUser of this.participants) {
        if (users.id == selectedUser.id) {
          flag = 1;
        }
      }
      if (flag == 1) {
        this.transactionParticipants.push({
          participantMemberId: users.id,
          amount: this.totalShare,
        });
      } else {
        this.transactionParticipants.push({
          participantMemberId: users.id,
          amount: 0,
        });
      }
    }
    this.transaction.groupId = this.ChoosenGroupId;
    console.log(this.expenseForm.value);
    this.transaction.categoryId= this.category;
    (this.transaction.description = this.expenseForm.value.description || ''),
      (this.transaction.amount = this.expenseForm.value.totalAmount || 0),
      (this.transaction.date = this.expenseForm.value.date || ''),
      (this.transaction.filePath = ''),
      (this.transaction.paidBy = this.UserMemberId),
      (this.transaction.lstExpenseTransaction = this.transactionParticipants);
    console.log(this.transaction);

    this._grp.addTransaction(this.transaction).subscribe((res: any) => {
      //  console.log('Transaction',res);
      this.expenseForm.patchValue({
        description: '',
        totalAmount: 0,
        date: '',
      });
      Swal.fire({
        icon: 'success',
        title: 'Do you want to Add more Expenses?',
        showDenyButton: true,
        allowOutsideClick: false,
        // showCancelButton: true,
        confirmButtonText: 'Yes, I have to',
        denyButtonText: `No , I am Fine`,
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          // this.allgroupComponent.ngOnInit();
          // this._grp.getTransactionbyGroupId(this.grpId).subscribe((res: any) => {
          //   console.log('getTransactionbyGroupId=========>', res.response.result);
          //   this.transactionLists = res.response.result;
          // });
          // Swal.fire('Saved!', '', 'success')
        } else  {
          document.getElementById('close')?.click();
          // this.allgroupComponent.ngOnInit();
          // this._grp.getTransactionbyGroupId(this.grpId).subscribe((res: any) => {
          //   console.log('getTransactionbyGroupId=========>', res.response.result);
          //   this.transactionLists = res.response.result;
          // });
          // Swal.fire('Changes are not saved', '', 'info')
        }

      });
    });
    // this._grp.getTransactionbyGroupId(this.grpId).subscribe((res: any) => {
    //   console.log('getTransactionbyGroupId=========>', res.response.result);
    //   this.transactionLists = res.response.result;
    // });
  }


  items = ['Item 1'];
  expandedIndex = 0;
  filter:string='All';
  GetExpenses(filter:string){
    // alert(filter)
    //;
    // this._grp.getTransactionbyGroupId(this.grpId,filter).subscribe((res:any)=>{
    //   console.log("getTransactionbyGroupId=========>",res.response.result)
    //   this.transactionLists=res.response.result;
    // })
  }

  myFunction() {
    //document.getElementById("myDropdown").classList.toggle("show");
  }
  
  filterFunction() {
    var input, filter, ul, li, a, i;
    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();
    let div = document.getElementById("myDropdown");
    a = div.getElementsByTagName("a");
    for (i = 0; i < a.length; i++) {
      var txtValue = a[i].textContent || a[i].innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        a[i].style.display = "";
      } else {
        a[i].style.display = "none";
      }
    }
  }

  selectedMember:number;

  GetMemberAccGroup(GroupId:number){
    // alert(GroupId)
    if(GroupId!=null && GroupId!=0)
    {
    this.ChoosenGroupId=GroupId;
    this._grp
        .getUserGroupDetailsByGrpId(GroupId)
        .subscribe((res: any) => {
          this.participants = res.response;
          this.list = this.participants;
          this.UserMemberId =
            this.list[
              this.list.findIndex((x) => x.email == this.decoded.Email)
            ].id;
          console.log(
            'participant id',
            this.list[this.list.findIndex((x) => x.email == this.decoded.Email)]
              .id
          );
          this.participantId= this.list[this.list.findIndex((x) => x.email == this.decoded.Email)]
          .id
          this.done = this.list;
          this.persons = this.participants.length;
          this.selectedMember= this.list.length;
          this.totalShare = Number(this.expenditure / this.selectedMember).toFixed(2);
        });
      }
  }

}
