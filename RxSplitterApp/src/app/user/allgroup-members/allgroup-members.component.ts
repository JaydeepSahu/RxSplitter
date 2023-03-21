import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder,  FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { UserGroups } from 'src/app/model/user-groups';
import { GroupServiceService } from 'src/app/services/group-service.service';
// import { ToastrService } from 'ngx-toastr';
import jwt_decode from 'jwt-decode';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-allgroup-members',
  templateUrl: './allgroup-members.component.html',
  styleUrls: ['./allgroup-members.component.css']
})
export class AllgroupMembersComponent implements OnInit {
  @Input()  groupExpenseListData  : number;

  showForm:FormGroup;
  totalAmountG : any
  constructor( private route : ActivatedRoute,private fb: FormBuilder, private _grp : GroupServiceService) { }
  groupId: any;
  groupName=""
  isSubmitted: boolean
  pattern=/[a-z0-9!#$%&'*+=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g;
  CurrencyIcon:string="";
  ngOnInit(): void 
  {
    console.log('-------------totalExpense--------',this.groupExpenseListData)
    //
    this.route.params.subscribe(res=>{
      this.groupId=res['GroupId']
      this._grp.getGroupDetailsByGrpId(res['GroupId']).subscribe((res:any)=>{
        this.groupName=res.response[0].groupName
      })
      this._grp.getUserGroupDetailsByGrpId(res['GroupId']).subscribe((res:any)=>{

         this.participants=res.response
         this.list=this.participants
         console.log('participants',this.participants)
         this.CurrencyIcon= res.response.length > 0 ? res.response[0].icon : "";
        // this.persons=this.participants.length
      })
      this.summaryDetails=[]
      this._grp.getSummarybyGroupId(this.groupId).subscribe((res:any)=>{
        //
        if(res.response.length>0)
        {
          this.summaryDetails=res.response
          console.log("Res  =====> ", res.response)
        }
        else{

        }
      })
      this.groupName=res['GroupId']
    })

    this.showForm = this.fb.group({
      lstGroupMember: this.fb.array([
        this.fb.group({
          Email:['', [Validators.required, Validators.email]]
        })
      ])
    })  
    
    this.decoded = jwt_decode(JSON.parse(localStorage.getItem('Token') || '{}').value);
    console.log('You Name',this.decoded.Name)
    this.loggedUserVal=this.decoded.Name
  }
  decoded:any=[]
  loggedUserVal=""

//Show List
checkDueAmount(participantId:any){
  //
  console.log("Response CheckDueAMount  =====> ", this.summaryDetails)
  var obj = this.summaryDetails.find(x=>x.participantId==participantId)
  console.log("Find Object",obj)
  if(obj.remainingAmount!=0)
  {
    return false
  }
  else{
     return true
  }
}

list :any= [];
summaryDetails=[];
participants:Array<UserGroups>=[]
@Input() grpId!:number;
@Input() isMemberActive:boolean;

//---------------------------Add Member------------------------

// showForm = new FormGroup({
//   lstGroupMember: this.fb.array([this.newQuantity()]),
// });



// getGroup(): FormArray {
//   return this.showForm.get('lstGroupMember') as FormArray;
// }

// newQuantity(): FormGroup {
//   return this.fb.group({
//     Email: new FormControl('', [Validators.required,Validators.email, Validators.pattern(this.pattern)]),
//   });
// }

addEContact() {
  //this.getGroup().push(this.newQuantity());
  let control = <FormArray>this.showForm.controls["lstGroupMember"];
    control.push(
      this.fb.group({
        Email: ['', [Validators.required, Validators.email]],
      })
    )
}

removeQuantity(i: number) {
  this.lstGroupMember.removeAt(i);
}

get lstGroupMember() : FormArray{
  return this.showForm.get('lstGroupMember') as FormArray;
}

submitGroupMember() {
  //;
  this.isSubmitted = true;

  this.route.params.subscribe(res=>{
    console.log(res['GroupId'])
    this.groupId=res['GroupId']
  })

 // this.groupId = localStorage.getItem('groupId');
  return this._grp
    .createGroupMember(this.showForm.value.lstGroupMember, this.groupId)
    .subscribe((res: any) => {
      //
      console.log('From all group members ==> '+res);
      this.showForm.reset();

      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Group Member Added',
        showConfirmButton: false,
        timer: 2000
      })
      
    });
}

//---------------------------------end------------------------------

}
