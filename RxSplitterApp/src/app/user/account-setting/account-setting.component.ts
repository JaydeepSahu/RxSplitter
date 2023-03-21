import { Component, OnInit } from '@angular/core';
import jwt_decode from 'jwt-decode';
import { Router } from '@angular/router';
import { AccountsettingService } from 'src/app/services/accountsetting.service';
import { AccountSetting } from 'src/app/model/account-setting';
import Swal from 'sweetalert2';
import { EmailUserSetting } from 'src/app/model/EmailUserSetting';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { id } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-account-setting',
  templateUrl: './account-setting.component.html',
  styleUrls: ['./account-setting.component.css'],
})
export class AccountSettingComponent implements OnInit {
  loggedUserVal: string = '';
  loggedUserValEmail = '';
  phonenumber = '';
  profileimage = '';
  //dob ="";
  decoded: any = [];
  auth_token: any;
  useraccountsetting: AccountSetting = {
    name: '',
    email: '',
    phonenumber: '',
    profileimage: '',
  };
  imageSrc: string;

  EmailType: any;
  EmailPeriodType: any;
  EmailTypeCheck: any[] = [];
  EmailP: number;
  NotificationsType: any;
  EmailUser:EmailUserSetting={
            email:false,
            notification:false,
            userSettings:[{
              id: 0,
              emailTypeName: '',
              userId: '',
              emailPeriodId: null,
              emailTypeId: 0,
              isActive: false,
            }]
  }
  settingForm: FormGroup;
 isSelectAll:boolean = false;
  constructor(
    public router: Router,
    private accountSetting: AccountsettingService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.auth_token = JSON.parse(localStorage.getItem('Token') || '{}').value;
    this.decoded = jwt_decode(this.auth_token);

    this.accountSetting.GetUserDetail().subscribe((res: any) => {
      //this.useraccountsetting = res.response;
      this.useraccountsetting.name = res.response.name;
      this.useraccountsetting.email = res.response.email;
      this.useraccountsetting.phonenumber = res.response.phoneNumber;
      this.imageSrc = res.response.profileImage;
    });

    this.accountSetting.GetAllEmailType().subscribe((res: any) => {
      this.EmailType = res.response;
      console.log('GetAllEmailType', this.EmailType);
    });

    this.accountSetting.GetAllEmailPeriodType().subscribe((res: any) => {
      this.EmailPeriodType = res.response;
      console.log('EmailPeriodType', this.EmailPeriodType);
    });

    this.accountSetting.GetAllNotificationsType().subscribe((res: any) => {
      this.NotificationsType = res.response;
      console.log('EmailPeriodType', this.NotificationsType);
    });

    this.settingForm = this.fb.group({
      email: [false],
      notification: [false],
      userSettings: this.fb.array([])
    })
    this.getAccountSettingDetail();
    this.isAllSelected();
  }

  isAllSelected() {
    this.isSelectAll = this.userSettings.controls.every(function(item:any) {
        return item.value.isActive == true;
      });
  }

  newSetting(data: any): FormGroup {
    return this.fb.group({
      id: [data.id],
      userId: [data.userId],
      emailTypeId: [data.emailTypeId],
      emailPeriodId: [data.emailPeriodId, [Validators.required]],
      emailTypeName: [data.emailTypeName],
      isActive: [data.isActive]
    })
  }

  emailTypeName(i: number) {
    return this.userSettings.value[i].emailTypeName;
  }

  get userSettings(): FormArray {
    return this.settingForm.get("userSettings") as FormArray;
  }

  CancelAccountSetting() {
    this.router.navigateByUrl('/Dashboard');
  }

  SaveUserDetail() {
    this.useraccountsetting.profileimage = this.imageSrc;
    return this.accountSetting
      .UpdateUserDetail(this.useraccountsetting)
      .subscribe((res: any) => {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'User updated successfully !',
          showConfirmButton: false,
          timer: 2000,
        });
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      });
  }

  

  onFileChange(event) {
    const reader = new FileReader();
    const [file] = event.target.files;
    if (event.target.files && event.target.files.length) {
      if (
        file.type == 'image/jpeg' ||
        file.type == 'image/png' ||
        file.type == 'image/jpg'
      ) {
        reader.readAsDataURL(file);

        reader.onload = () => {
          this.imageSrc = reader.result as string;
        };
      } else {
        //file.name = "";
        this.imageSrc = '';
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Please select a valid file format (.png , .jpg , .jpeg)!',
          showConfirmButton: false,
          timer: 2000,
        });
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    }
  }

  EmailTypeList(i: any) {
    this.EmailTypeCheck.push(i);
    console.log('EmailTypeList', this.EmailTypeCheck);
  }

  selectAll(event) {
    this.userSettings.controls.map(value => value.get('isActive').setValue(event.target.checked));
    console.log(this.userSettings.value);
    
  }

  SaveEmailUserSetting() {
    return this.accountSetting
      .SaveEmailUserSetting(this.settingForm.value)
      .subscribe((res: any) => {

        console.log('lstEmailNotification ==> ' + res);
        this.settingForm.reset();
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Notification Added',
          showConfirmButton: false,
          timer: 2000,
        });
        
        this.accountSetting.GetUserEmailSettingByUserId().subscribe((res: any) => {
          this.EmailUser = res.response;
          
          this.settingForm.patchValue({
            email:this.EmailUser.email,
            notification:this.EmailUser.notification,
            userSettings: this.EmailUser.userSettings
          });
        });
      });

      
  }

  getAccountSettingDetail()
  {
    this.accountSetting.GetUserEmailSettingByUserId().subscribe((res: any) => {
      this.EmailUser = res.response;
      this.settingForm.patchValue({
        email:this.EmailUser.email,
        notification:this.EmailUser.notification
      });

      this.EmailUser.userSettings.map(data => {
        this.userSettings.push(this.newSetting(data))
      })

      this.isAllSelected();
    });
  }

}
