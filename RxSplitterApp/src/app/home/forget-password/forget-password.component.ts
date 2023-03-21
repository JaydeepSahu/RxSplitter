import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthServiceService } from 'src/app/services/auth-service.service';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css']
})
export class ForgetPasswordComponent implements OnInit {

  constructor(private _auth:AuthServiceService) { }
  mailSent=false

  ngOnInit(): void {
  }
  forgetPassword = new FormGroup({
    userName: new FormControl('', [Validators.required, Validators.email])
  });
  get userName(): FormControl {
    return this.forgetPassword.get('userName') as FormControl;
  }

  sendMail(){
    this._auth.sendMail(this.forgetPassword.value).subscribe((res:any)=>{
      //
      if(res.statusCode=='200')
      {
        this.mailSent=true
        this.forgetPassword.setValue({
          userName:''
        })
      }
      else
      {
        alert("Not a Valid Email id ")
      }
    })
  }
}