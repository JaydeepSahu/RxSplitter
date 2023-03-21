import { formatDate } from '@angular/common';
import {
  Component,
  Input,
  OnInit,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ParticipantsShare } from 'src/app/model/participants-share';
import { Transaction } from 'src/app/model/transaction';
import { UserGroups } from 'src/app/model/user-groups';
import { GroupServiceService } from 'src/app/services/group-service.service';
import Swal from 'sweetalert2';
import jwt_decode from 'jwt-decode';
import { AllgroupMembersComponent } from '../allgroup-members/allgroup-members.component';
import { AllGroupsForUserComponent } from '../all-groups-for-user/all-groups-for-user.component';
import { fromEvent, max, Observable } from 'rxjs';
import { SettleUpComponent } from '../settle-up/settle-up.component';
import { SettleUpService } from 'src/app/services/settle-up.service';
import {
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from '@microsoft/signalr';
import { NotificationService } from 'src/app/services/notification.service';
import { each } from 'chartist';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-group-details',
  templateUrl: './group-details.component.html',
  styleUrls: ['./group-details.component.css'],
})
export class GroupDetailsComponent implements OnInit {
  loggedUserVal = '';
  decoded: any = [];
  todo = [];
  SearchDescription = '';
  done = [];
  auth_token: any;
  transaction: Transaction = {};
  CurrencyIcon: string = '';

  private connection: HubConnection;
  myExpenseGId: number;

  constructor(
    private route: ActivatedRoute,
    private _grp: GroupServiceService,
    private _settleup: SettleUpService,
    private router: Router,
    private _noti: NotificationService
  ) {
    this.auth_token = JSON.parse(localStorage.getItem('Token') || '{}').value;
    this.decoded = jwt_decode(this.auth_token);
    console.log('decodejwt', this.decoded.Name);
    this.loggedUserVal = this.decoded.Id;
    this.myExpenseGId = parseInt(this.decoded.MyExpense);
    console.log('myExpense Id', this.myExpenseGId);

    route.params.subscribe((res) => {
      // console.log(res['GroupId']);
      // this.grpId = res['GroupId'];
      this.router.navigate(['/groupDetails/' + res['GroupId']]);
    });
    this.connection = new HubConnectionBuilder()
      .withUrl('http://rxsplitterapi.live1.dev.radixweb.net/offers')
      //.withUrl('https://localhost:7228/offers')
      .configureLogging(LogLevel.Information)
      .build();
  }
  PageNumber:number=1;
  TotalPages: any;
  TotalData: number;
  DummyTransList: any;
  Entries: number=10;
  expenseForm: any;
  UserMemberId: any;
  Notification = [];
  @ViewChild(AllgroupMembersComponent)
  allgroupComponent: AllgroupMembersComponent;
  @ViewChild(AllGroupsForUserComponent)
  allGroupsForUserComponent: AllGroupsForUserComponent;
  private hubConnectionBuilder!: HubConnection;
  ngOnInit(): void {
    this.hubConnectionBuilder = new HubConnectionBuilder()
       //.withUrl('http://rxsplitterapi.live1.dev.radixweb.net/offers')
       .withUrl(environment.signalRLink)
      //.withUrl('https://localhost:7228/offers')
      .configureLogging(LogLevel.Information)
      .build();
    this.hubConnectionBuilder
      .start()
      .then(() => console.log('Connection started.......!'))
      .catch((err) => console.log('Error while connect with server'));
    ;
    this.hubConnectionBuilder.on('SendOffersToUser', (result: any) => {
      console.log('_____________________________');
      this.offers = [];
      let response = result;
      for (let i = response.length-1; i >=0;  i--) {
  
        if (response[i].sentTo == this.loggedUserVal) {
          this.offers.push(response[i]);
          break
        }
      }
      console.log(this.offers[0].details)
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title:this.offers[0].details,
        showConfirmButton: false,
        timer: 3000
       
      })
      this.ngOnInit()
      this.allgroupComponent.ngOnInit()
    });

  

    this.route.params.subscribe((res) => {
      console.log(res['GroupId']);
      this.grpId = res['GroupId'];
      this.router.navigate(['/groupDetails/' + this.grpId]);
      // alert(this.grpId)
      this._grp.getGroupDetailsByGrpId(res['GroupId']).subscribe((res: any) => {
        this.groupName = res.response[0].groupName;
        console.log('Testing', res.response[0].groupName);
      });
      this._grp
        .getUserGroupDetailsByGrpId(res['GroupId'])
        .subscribe((res: any) => {
          // console.log('Jaydeep', res);
          console.log('Inside THE GROUP DETAILS', res.response);
          this.participants = res.response;

          this.totalParticipants = this.participants.length;
          this.list = this.participants;
          this.selectedMember = this.list.length;
          // console.log(this.list);
          this.UserMemberId =
            this.list[
              this.list.findIndex(
                (x) => x.email.toLowerCase() == this.decoded.Email
              )
            ].id;
          // console.log('hii');
          console.log(
            'participant id',
            this.list[
              this.list.findIndex(
                (x) => x.email.toLowerCase() == this.decoded.Email
              )
            ].id
          );
          this.participantId =
            this.list[
              this.list.findIndex(
                (x) => x.email.toLowerCase() == this.decoded.Email
              )
            ].id;
          this.done = this.list;
          this.persons = this.participants.length;
          this.CurrencyIcon =
            res.response.length > 0 ? res.response[0].icon : '';
        });
      this._grp.getTransactionbyGroupId(this.grpId).subscribe((res: any) => {
        console.log('getTransactionbyGroupId ===> New', res.response.result);
        this.transactionLists = res.response.result;
        this.DummyTransList = res.response.result;
        this.TotalPages = parseInt(res.response.statusCode);
        console.log(parseInt(this.TotalPages));
        this.TotalData = res.response.status;
        this.totalAmountG = 0;
        for (var i in this.transactionLists) {
          this.totalAmountG += this.transactionLists[i].amount;
        }
        console.log('--------total gropu parent', this.totalAmountG);
      });
      this._grp.GetAllCategories().subscribe((res: any) => {
        console.log('Categories ===> New', res.response);
        this.Categories = res.response;
      });
    });
    //////////////////////////////////
    this._grp.GetAllGroups().subscribe((res: any) => {
      let det = res.response.filter((x) => x.id == this.grpId);
      this.isMemberActive = det[0].isActive;
    });
    //////////////////////////////////
    this.month = this.date.getMonth() + 1;
    this.day = this.date.getDate();
    if (this.month < 10) this.month = '0' + this.month;
    if (this.day < 10) this.day = '0' + this.day;

    this.today = `${this.year}-${this.month}-${this.day}`;
    ///Get Transaction
    this.expenseForm = new FormGroup({
      description: new FormControl('', [Validators.required]),
      totalAmount: new FormControl(0, [
        Validators.required,
        Validators.pattern('^[0-9]*$'),
      ]),
      date: new FormControl(this.today, [Validators.required]),
      groupId: new FormControl(),
      categoryId: new FormControl(),
      category: new FormControl(0, [Validators.required]),
      filePath: new FormControl(''),
      paidBy: new FormControl(this.UserMemberId),
      participants: new FormArray([
        // id:new FormControl(),
        // new FormControl()
      ]),
    });
    this._grp.GetAllGroupsByUserID().subscribe((res: any) => {
      //;
      this._grp.grpList = res.response;
      this.groups = res.response;
    });
    // this.expenseForm.patchValue({
    //   paidBy:this.list[this.list.findIndex(x=>x.email==this.decoded.Email)].id
    //  })

    this.myFunction();

    this._settleup.getTransaction(this.grpId).subscribe((res: any) => {
      console.log('transactionList--------------- ', res.response);
      this.totalExpenseAmountList = res.response;

      //
      //
      console.log('HELooooooooooooooooooooooooooooooooooooo');
      console.log(this.totalExpenseAmountList);

      for (let i of this.totalExpenseAmountList) {
        let amount = Number(i.amount.toFixed(2));
        this.totalExpenseAmount =
          Math.abs(amount) + Number(this.totalExpenseAmount.toFixed(2));
        if (i.status != 'Pending') {
          this.settledExpenseAmount =
            Math.abs(i.amount) + Number(this.settledExpenseAmount.toFixed(2));
          // alert(this.settledExpenseAmount);
        }
        if (i.status == 'Pending' && i.paidTo == this.decoded.Name) {
          this.pendingOnMeAmount =
            Math.abs(i.amount) + Number(this.pendingOnMeAmount.toFixed(2));
          // alert(this.settledExpenseAmount);
        }
        if (i.status == 'Pending' && i.paidTo != this.decoded.Name) {
          this.pendingOnOthers =
            Math.abs(i.amount) + Number(this.pendingOnOthers.toFixed(2));
          // alert(this.settledExpenseAmount);
        }
      }
    });
    //
    // document.getElementById("GroupIddd").querySelectorAll('input[type=checkbox]:checked').length
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////
  start(): void {
    this.connection.start().catch((err) => console.error(err.toString()));
  }

  receiveMessage(): Observable<string> {
    return fromEvent(this.connection, 'ReceiveMessage');
  }

  sendMessageToUser(userId: string, message: string): void {
    this.connection
      .invoke('SendMessageToUser', userId, message)
      .catch((err) => console.error(err.toString()));
  }
  //////////////////////////////////////////////////////////////////////////////////////////////////////////
  isMemberActive: boolean;
  totalExpenseAmountList: any = [];
  totalExpenseAmount: number = 0;
  settledExpenseAmount: number = 0;
  pendingOnMeAmount: number = 0;
  pendingOnOthers: number = 0;
  groups: any[];
  Categories: any;
  category: number = 1;
  participantId = 0;
  groupName = '';
  grpId!: any;
  expenditure = 0.0;
  transactionLists: any = [];
  totalAmountG: number = 0;
  offers: any[] = [];
  list: any = [];
  participants: Array<UserGroups> = [];
  persons = this.participants.length;
  totalParticipants = 0;
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
    this.selectedMember = document
      .getElementById('myDropdown')
      .querySelectorAll('input[type=checkbox]:checked').length;
  }

  // *************************************************
  LeaveGroup() {
    let amount = this.allgroupComponent.checkDueAmount(this.participantId);
    //;
    if (!amount) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'First Clear the Dues with other Participants',
        // footer: '<a href="">Why do I have this issue?</a>'
      });
    } else {
      Swal.fire({
        icon: 'info',
        title: 'Do you want to Leave the Group?',
        showDenyButton: true,
        allowOutsideClick: false,
        // showCancelButton: true,
        confirmButtonText: 'Yes, I have to',
        denyButtonText: `No , I have changed my mind`,
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          this._grp
            .removeParticipantFromGrp(this.participantId, this.grpId)
            .subscribe((res) => {
              console.log('Deleted Group', res);
              // Swal.fire('Saved!', '', 'success');
              this.router.navigateByUrl('/groupUser');
            });
        }
      });
    }
  }

  // *****************************************************

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
    this.transaction.groupId = this.grpId;
    this.transaction.categoryId = this.category;
    (this.transaction.description = this.expenseForm.value.description || ''),
      (this.transaction.amount = this.expenseForm.value.totalAmount || 0),
      (this.transaction.date = this.expenseForm.value.date || ''),
      (this.transaction.filePath = ''),
      (this.transaction.paidBy = this.UserMemberId),
      (this.transaction.lstExpenseTransaction = this.transactionParticipants);
    console.log(this.transaction);

    this._grp.addTransaction(this.transaction).subscribe((res: any) => {
      //  console.log('Transaction',res);

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
          this.allgroupComponent.ngOnInit();
          this.ngOnInit();
          this._grp
            .getTransactionbyGroupId(this.grpId)
            .subscribe((res: any) => {
              console.log(
                'getTransactionbyGroupId=========>',
                res.response.result
              );
              this.transactionLists = res.response.result;
            });
          this.expenseForm.patchValue({
            description: '',
            totalAmount: 0,
            date: this.today,
          });
          // Swal.fire('Saved!', '', 'success')
        } else {
          document.getElementById('close')?.click();
          this.allgroupComponent.ngOnInit();
          this.ngOnInit();
          this._grp
            .getTransactionbyGroupId(this.grpId)
            .subscribe((res: any) => {
              console.log(
                'getTransactionbyGroupId=========>',
                res.response.result
              );
              this.transactionLists = res.response.result;
              this.DummyTransList = res.response.result;
            });
          this.expenseForm.patchValue({
            description: '',
            totalAmount: 0,
            date: this.today,
          });
          // Swal.fire('Changes are not saved', '', 'info')
        }
      });
    });
    this._grp.getTransactionbyGroupId(this.grpId).subscribe((res: any) => {
      console.log('getTransactionbyGroupId=========>', res.response.result);
      this.transactionLists = res.response.result;
      this.DummyTransList = res.response.result;
    });
  }

  items = ['Item 1'];
  expandedIndex = 0;
  filter: string = 'All';
  GetExpenses(filter: string) {
    // alert(filter)
    this._grp
      .getTransactionbyGroupId(this.grpId, filter)
      .subscribe((res: any) => {
        console.log('getTransactionbyGroupId=========>', res.response.result);
        this.transactionLists = res.response.result;
        this.DummyTransList = res.response.result;
      });
  }

  myFunction() {
    //document.getElementById("myDropdown").classList.toggle("show");
  }

  filterFunction() {
    var input, filter, ul, li, a, i;
    input = document.getElementById('myInput');
    filter = input.value.toUpperCase();
    let div = document.getElementById('myDropdown');
    a = div.getElementsByTagName('a');
    for (i = 0; i < a.length; i++) {
      var txtValue = a[i].textContent || a[i].innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        a[i].style.display = '';
      } else {
        a[i].style.display = 'none';
      }
    }
  }

  selectedMember: number;

  GetMemberAccGroup(GroupId: number) {
    // alert(GroupId)
    this._grp.getUserGroupDetailsByGrpId(GroupId).subscribe((res: any) => {
      this.participants = res.response;
      this.list = this.participants;
      this.UserMemberId =
        this.list[this.list.findIndex((x) => x.email == this.decoded.Email)].id;
      console.log(
        'participant id',
        this.list[this.list.findIndex((x) => x.email == this.decoded.Email)].id
      );
      this.participantId =
        this.list[this.list.findIndex((x) => x.email == this.decoded.Email)].id;
      this.done = this.list;
      this.persons = this.participants.length;
      this.selectedMember = this.list.length;
      this.totalShare = Number(this.expenditure / this.selectedMember).toFixed(
        2
      );
    });
  }
  maxAmount = 0;
  payableAmount = 0;
  data = '';
  isPayable = false;
  SettleUP() {
    this.maxAmount = 0;
    let index;
    for (let i in this.list) {
      console.log(i);
      if (this.list[i].userId == this.loggedUserVal) {
        let loggedId = this.list[i].id;
        for (let j in this.allgroupComponent.summaryDetails) {
          if (
            this.allgroupComponent.summaryDetails[j].participantId == loggedId
          ) {
            if (this.allgroupComponent.summaryDetails[j].remainingAmount > 0) {
              this.data =
                'You need not to give any amount to anyone as you already Owed ' +
                this.allgroupComponent.summaryDetails[j].remainingAmount;
              this.isPayable = false;
            } else if (
              this.allgroupComponent.summaryDetails[j].remainingAmount == 0
            ) {
              this.isPayable = false;
              this.data =
                'You are already Settled up , Need not to pay or get anything from anyone';
            } else {
              this.data = '';
              this.isPayable = true;
            }

            //   for(let k in this.allgroupComponent.summaryDetails )
            //   {
            //     if(this.maxAmount<this.allgroupComponent.summaryDetails[k].remainingAmount)
            //     {
            //       this.maxAmount=this.allgroupComponent.summaryDetails[k].remainingAmount
            //       index=k
            //     }
            //   }
            //   console.log(this.maxAmount)
            //   console.log(this.allgroupComponent.summaryDetails[index])
            //   console.log(this.allgroupComponent.summaryDetails[j].remainingAmount)
            //   this.payableAmount=this.maxAmount+this.allgroupComponent.summaryDetails[j].remainingAmount
            //   if(this.payableAmount>0)
            //   {
            //     console.log()
            //     alert("YOu have to pay " + this.list[this.list.findIndex(x=>x.id==this.allgroupComponent.summaryDetails[index].participantId)].name+" amount "+this.allgroupComponent.summaryDetails[j].remainingAmount)

            //   }
            //   else{
            //     alert("YOu have to pay " + this.list[this.list.findIndex(x=>x.id==this.allgroupComponent.summaryDetails[index].participantId)].name+" amount "+this.allgroupComponent.summaryDetails[index].remainingAmount)
            //   }
          }
        }
      }
    }
  }
   openNav() {
    document.getElementById("rightBar").style.width = "250px";
  }
   closeNav() {
      document.getElementById("rightBar").style.width = "0";
  }

  counter(i: number) {
    return new Array(i);
  }
  GetExpenceAccDate(searchDate: any) {
debugger;
    if(searchDate==null || searchDate=="")
    {
      this.transactionLists = this.DummyTransList;
    }
    else{
      this.transactionLists = this.DummyTransList.filter(x => new Date(x.date).toDateString() == new Date(searchDate).toDateString());
    }
  }

  GetDataAccPageNumber(PageNo: number, Entry?:number) {
    this.PageNumber=PageNo;
    this.Entries=Entry;
    var mode='All';
    this._grp.getTransactionbyGroupId(this.grpId,mode).subscribe((res: any) => {
      console.log('getTransactionbyGroupId ===> New', res.response);
      this.transactionLists = res.response.result;
      this.DummyTransList = res.response.result;
      this.TotalPages = parseInt(res.response.statusCode);
      console.log(parseInt(this.TotalPages));
      this.TotalData = res.response.status;
    })
  }
}
