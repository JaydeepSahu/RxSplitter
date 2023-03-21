import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserLogin } from 'src/app/model/user-login';
import { UserRegister } from 'src/app/model/user-register';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import jwt_decode from 'jwt-decode';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  expiry : string="";
  isSubmitted: boolean=false;
  displayEmail:string="";
  decoded:any=[]
  checkToken=""
  token=false

  constructor(private _auth : AuthServiceService, public router : Router,private route: ActivatedRoute) 
  {}

  ngOnInit(): void {

    this.route.params.subscribe(params => {
    
      this.checkToken = params['token'];
      if(this.checkToken){
        this.token=true
        this.decoded = jwt_decode(this.checkToken);
        console.log('decodejwt',this.decoded.Email)
        
        this.displayEmail=this.decoded.Email
      }
      else{
        this.token=false
        this.displayEmail=null
      }
      
    });
  }

  //---LoginForm---//
  loginForm = new FormGroup({
    userName: new FormControl('', [Validators.required, Validators.email] ) ,
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(15),
    ]),
  });

 
  loginSubmitted() 
  {
   
    this.isSubmitted = true;
    if(this.loginForm.invalid){
      return 1
    }
    //this.loaderInvoked()
    if(this.checkToken)
    {
    this.loginForm.value.userName= this.displayEmail
    }
      return this._auth.login(this.loginForm.value as UserLogin).subscribe((res:any)=>
    {
     // this.loaderInvoked()
      console.log(res);
       if(!res.token) 
      {
        alert('Invalid Email Id or Password');
      }
      else
      { 
        console.log(res);
        this.setWithExpiry('Token',res.token)
        this._auth.loggedUser=this.loginForm.value.userName as string
        this.router.navigateByUrl('/Dashboard')
      }
    })
  }

  setWithExpiry(key:string, value:string)
  {
     const now = new Date()
     // `item` is an object which contains the original value
     // as well as the time when it's supposed to expire
     const item = {
         value: value,
         expiry: now.getTime() + 6000000,
     }   
     localStorage.setItem(key, JSON.stringify(item))
  }

  get userName(): FormControl {
    return this.loginForm.get('userName') as FormControl;
  }

  get password(): FormControl {
    return this.loginForm.get('password') as FormControl;
  }

  //---RegisterForm---//
  registerForm = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
      Validators.pattern('[a-zA-Z].*'),
    ]),

    email: new FormControl('', [Validators.required, Validators.email]),

    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(15),
    ]),
  });

  registeredSubmit() 
  {
    //  
    //this.loaderInvoked()
    if(this.checkToken)
    {
      this.registerForm.value.email= this.displayEmail
    }
  
    this._auth.registration(this.registerForm.value as UserRegister).subscribe((res:any)=>{
      //
      console.log(res)
      
      if(res.statusCode == '200')
      {
      // this.loaderInvoked()
        alert("User Registered")
        this.registerForm.reset();
        this.router.navigateByUrl('/Login')  
      }
      else{
     //  this.loaderInvoked()
        alert('Email Id Already Exist')
      }
    })
 
  }
// loader=false
//   loaderInvoked(){
//     if(this.loader)
//     this.loader=false
//     else{
//       this.loader=true
//     }
//   }


  get name(): FormControl {
    return this.registerForm.get('name')  as FormControl;
  }

  get email(): FormControl {
    return this.registerForm.get('email')  as FormControl;
  }

  get Password(): FormControl 
  {
    return this.registerForm.get('password') as FormControl;
  }
}
