import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserGroups } from 'src/app/model/user-groups';
import { GroupServiceService } from 'src/app/services/group-service.service';
import jwt_decode from 'jwt-decode';
import Swal from 'sweetalert2';
import { NotifierOptions, NotifierService } from 'angular-notifier';


@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.css'],
})
export class GroupsComponent implements OnInit {
  alreadyMember="";
  decoded:any=[]
  auth_token : any

  private readonly notifier: NotifierService;

  constructor(
    private _grpService: GroupServiceService,
    public router: Router,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    notifierService: NotifierService
 
  ) { 

    this.auth_token =  JSON.parse(localStorage.getItem('Token') || '{}').value
    this.decoded = jwt_decode(this.auth_token);
    console.log('decodejwt',this.decoded.Email)
    this.alreadyMember=this.decoded.Email
    this.notifier = notifierService;

  }
  GroupName: any;
  groupId: any;
  showSecondForm = false;
  Currency: any[];
  CurrencyId : string ;
  

  ngOnInit(): void {
    this._grpService.GetAllCurrency().subscribe((res: any) => {
      console.log('Currency ===> New', res.response);
      this.Currency=res.response;
      });
  }

  showForm = new FormGroup({
    lstGroupMember: this.fb.array([this.newQuantity()]),
  });


  CreateGroup() 
  {
    
    if(this.CurrencyId==undefined || this.CurrencyId== "" || this.CurrencyId== "undefined" )
    {
      this.notifier.show({
        type: 'error',
        message: 'Please Choose the Currency from the dropdown',
      });
    }
    else if(this.GroupName==undefined || this.GroupName=="")
    {
      this.notifier.show({
        type: 'error',
        message: 'Please Enter a Group Name',
      });
    }
   else{ 
    this._grpService
      .createGroup(this.GroupName, parseInt(this.CurrencyId) )
      .subscribe((res: any) => {
         console.log(res);
       // alert(this.GroupName + ' ' + 'group created');
        this.showSecondForm = true;
        localStorage.setItem('groupId', res.response.result.id);
        console.log(res.response.id);

        this._grpService.GetAllGroupsByUserID().subscribe((res:any)=>{
          this._grpService.grpList=res.response
         // console.log(res)
          console.log("*****************************************************************************")
          //this.toastr.success(this.GroupName + ' ' + 'group created');

          Swal.fire({
            position: 'center',
            icon: 'success',
            title: this.GroupName + ' ' + 'group created',
            showConfirmButton: false,
            timer: 2000
          })
        })
      });
   }
    
  }

  getGroup(): FormArray {
    return this.showForm.get('lstGroupMember') as FormArray;
  }

  newQuantity(): FormGroup {
    return this.fb.group({
      Email: new FormControl('', [Validators.required, Validators.email]),
    });
  }

  addEContact() {
    this.getGroup().push(this.newQuantity());
  }

  removeQuantity(i: number) {
    this.getGroup().removeAt(i);
  }

  submitGroupMember() {
    //;
    this.groupId = localStorage.getItem('groupId');
    return this._grpService
      .createGroupMember(this.showForm.value.lstGroupMember, this.groupId)
      .subscribe((res: any) => {
        console.log("From group Component not working ==>  "+res);
      
       // alert('GroupName name Added');
        this.showForm.reset();
        this.showSecondForm = false;
        this.GroupName = '';
      //  this.toastr.warning('GroupName name Added');
      
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Group Invitation sent to user!!',
          showConfirmButton: false,
          timer: 2000
        })
      });
      
  }

  CancelGroup()
  {
    this.router.navigateByUrl('/Dashboard')
  }
  cancelAddMember(){
    this.showSecondForm=false;
    this.CurrencyId=undefined;
    this.GroupName=null;
  }
}
