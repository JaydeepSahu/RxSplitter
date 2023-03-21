import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { AuthServiceService } from 'src/app/services/auth-service.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  constructor(private _auth : AuthServiceService,private route:ActivatedRoute,private router:Router) {
    
   }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      //
      this.checkToken = params['token'];
      if(this.checkToken){
        this.token=true
        this._auth.getEmailByToken(this.checkToken).subscribe((res:any)=>{
          console.log(res['response'])
          this.userMailId=res['response']
        })
      }
      else{
        this.token=false
      }
      
    });
  }
  resetOldPassword = new FormGroup({
    oldPassword: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(15),
    ]),
    updatePassword: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(15),
    ])
  });
  get oldPassword(): FormControl {
    return this.resetOldPassword.get('oldPassword') as FormControl;
  }
  get updatePassword(): FormControl {
    return this.resetOldPassword.get('updatePassword') as FormControl;
  }
  checkToken=""
  token=false
  userMailId=""

  resetNewPassword = new FormGroup({
    newPassword: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(15),
    ])
  });

  get newPassword(): FormControl {
    return this.resetNewPassword.get('newPassword') as FormControl;
  }
  updateOldPassword(){
    //
    this._auth.updateNewPassword(this.resetNewPassword.value.newPassword,this.checkToken).subscribe((res:any)=>{
      console.log(res)
      alert("Password Updated")
      this.router.navigateByUrl('/Login')
  })
}
  updateNewPassword(){
   
}
}
